<?php

namespace App\Services;

use App\Enums\GradeEnum;
use App\Enums\RoleEnum;
use App\Models\Professeur;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use ZipArchive;

class TeacherImportService
{
    protected const DEFAULT_PASSWORD = 'password';

    protected const HEADER_ALIASES = [
        'num_dr' => ['numdrpp', 'numdrp', 'numdr', 'drpp', 'drp', 'matricule'],
        'last_name' => ['nom', 'lastname', 'surname'],
        'first_name' => ['prenom', 'prénom', 'firstname', 'givenname'],
        'date_of_birth' => ['naissance', 'datenaissance', 'dateofbirth', 'birthdate'],
        'email' => ['email', 'mail', 'courriel', 'e-mail'],
        'date_recrutement' => ['daterecrutement', 'recrutement', 'datederecrutement', 'recruitmentdate'],
        'date_last_promotion' => ['datedernierepromotion', 'datedernierpromo', 'datedernierepromo', 'datelastpromotion'],
        'date_last_grade_promotion' => ['datedernierepromotiongrade', 'datelastgradepromotion'],
        'date_last_echelon_promotion' => ['datedernierepromotionechelon', 'datelastechelonpromotion'],
        'phone' => ['telephone', 'téléphone', 'phone', 'tel'],
        'address' => ['adresse', 'address'],
        'specialite' => ['specialite', 'spécialité', 'speciality'],
        'cin' => ['cin'],
        'ppr' => ['ppr'],
        'grade' => ['grade'],
        'echelon' => ['echelon', 'échelon'],
        'password' => ['password', 'motdepasse'],
    ];

    public function import(UploadedFile $file): array
    {
        $rows = $this->readRows($file);
        [$headerMap, $dataRows] = $this->extractHeaderMap($rows);

        if ($headerMap === []) {
            return [
                'created_count' => 0,
                'updated_count' => 0,
                'skipped_count' => count($rows),
                'errors' => [
                    "Impossible de detecter les colonnes attendues. Utilisez au minimum: NUM DRPP, Nom, Prenom, Email, Date recrutement.",
                ],
            ];
        }

        $created = 0;
        $updated = 0;
        $skipped = 0;
        $errors = [];

        foreach ($dataRows as $index => $row) {
            if ($this->rowIsEmpty($row)) {
                continue;
            }

            $lineNumber = $index + 1;
            $payload = $this->mapRow($row, $headerMap);

            if (blank($payload['num_dr'] ?? null) || blank($payload['first_name'] ?? null) || blank($payload['last_name'] ?? null) || blank($payload['date_recrutement'] ?? null)) {
                $skipped++;
                $errors[] = "Ligne {$lineNumber}: informations obligatoires manquantes.";

                continue;
            }

            $result = $this->upsertTeacher($payload, $lineNumber);

            if ($result['status'] === 'created') {
                $created++;
            } elseif ($result['status'] === 'updated') {
                $updated++;
            } else {
                $skipped++;
                $errors[] = $result['message'];
            }
        }

        return [
            'created_count' => $created,
            'updated_count' => $updated,
            'skipped_count' => $skipped,
            'errors' => array_slice($errors, 0, 20),
        ];
    }

    protected function upsertTeacher(array $payload, int $lineNumber): array
    {
        $existingProfesseur = Professeur::query()
            ->with('user')
            ->where('num_dr', $payload['num_dr'])
            ->first();

        $userId = $existingProfesseur?->user_id;
        $professeurId = $existingProfesseur?->id;
        $email = $payload['email'] ?: $this->buildFallbackEmail($payload['num_dr']);

        $validator = Validator::make(
            [
                ...$payload,
                'email' => $email,
            ],
            [
                'num_dr' => ['required', 'string', 'max:30', 'unique:professeurs,num_dr,'.($professeurId ?: 'NULL').',id'],
                'first_name' => ['required', 'string', 'max:255'],
                'last_name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255', 'unique:users,email,'.($userId ?: 'NULL').',id'],
                'cin' => ['nullable', 'string', 'max:20', 'unique:professeurs,cin,'.($professeurId ?: 'NULL').',id'],
                'ppr' => ['nullable', 'string', 'max:20', 'unique:professeurs,ppr,'.($professeurId ?: 'NULL').',id'],
                'date_of_birth' => ['nullable', 'date'],
                'date_recrutement' => ['required', 'date'],
                'date_last_promotion' => ['nullable', 'date'],
                'phone' => ['nullable', 'string', 'max:30'],
                'address' => ['nullable', 'string'],
                'specialite' => ['nullable', 'string', 'max:255'],
                'grade' => ['required', 'in:A,B,C'],
                'echelon' => ['required', 'integer', 'min:1', 'max:4'],
                'password' => ['nullable', 'string', 'min:8'],
            ]
        );

        if ($validator->fails()) {
            return [
                'status' => 'skipped',
                'message' => "Ligne {$lineNumber}: ".$validator->errors()->first(),
            ];
        }

        DB::transaction(function () use ($payload, $existingProfesseur, $email): void {
            if ($existingProfesseur) {
                $user = $existingProfesseur->user;
                $user->update([
                    'name' => trim($payload['first_name'].' '.$payload['last_name']),
                    'email' => blank($user->email) ? $email : $user->email,
                ]);

                $existingProfesseur->update([
                    'cin' => $payload['cin'],
                    'ppr' => $payload['ppr'],
                    'first_name' => $payload['first_name'],
                    'last_name' => $payload['last_name'],
                    'date_of_birth' => $payload['date_of_birth'],
                    'specialite' => $payload['specialite'],
                    'grade' => $payload['grade'],
                    'echelon' => $payload['echelon'],
                    'date_recrutement' => $payload['date_recrutement'],
                    'date_last_promotion' => $payload['date_last_promotion'],
                    'date_last_grade_promotion' => $payload['date_last_grade_promotion'],
                    'date_last_echelon_promotion' => $payload['date_last_echelon_promotion'],
                    'anciennete_cache' => Carbon::parse($payload['date_recrutement'])->diffInYears(now()),
                    'phone' => blank($existingProfesseur->phone) ? $payload['phone'] : $existingProfesseur->phone,
                    'address' => blank($existingProfesseur->address) ? $payload['address'] : $existingProfesseur->address,
                ]);

                return;
            }

            $user = User::create([
                'name' => trim($payload['first_name'].' '.$payload['last_name']),
                'email' => $email,
                'password' => $payload['password'] ?: self::DEFAULT_PASSWORD,
                'role' => RoleEnum::TEACHER,
            ]);

            Professeur::create([
                'user_id' => $user->id,
                'num_dr' => $payload['num_dr'],
                'cin' => $payload['cin'],
                'ppr' => $payload['ppr'],
                'first_name' => $payload['first_name'],
                'last_name' => $payload['last_name'],
                'date_of_birth' => $payload['date_of_birth'],
                'phone' => $payload['phone'],
                'address' => $payload['address'],
                'specialite' => $payload['specialite'],
                'grade' => $payload['grade'],
                'echelon' => $payload['echelon'],
                'date_recrutement' => $payload['date_recrutement'],
                'date_last_promotion' => $payload['date_last_promotion'],
                'date_last_grade_promotion' => $payload['date_last_grade_promotion'],
                'date_last_echelon_promotion' => $payload['date_last_echelon_promotion'],
                'anciennete_cache' => Carbon::parse($payload['date_recrutement'])->diffInYears(now()),
            ]);
        });

        return [
            'status' => $existingProfesseur ? 'updated' : 'created',
        ];
    }

    protected function mapRow(array $row, array $headerMap): array
    {
        $values = [];

        foreach ($headerMap as $field => $columnIndex) {
            $values[$field] = $this->cleanCell($row[$columnIndex] ?? null);
        }

        return [
            'num_dr' => $values['num_dr'] ?? null,
            'first_name' => $values['first_name'] ?? null,
            'last_name' => $values['last_name'] ?? null,
            'email' => $values['email'] ?? null,
            'password' => $values['password'] ?? null,
            'cin' => $values['cin'] ?? null,
            'ppr' => $values['ppr'] ?? null,
            'phone' => $values['phone'] ?? null,
            'address' => $values['address'] ?? null,
            'specialite' => $values['specialite'] ?? null,
            'grade' => $this->normalizeGrade($values['grade'] ?? null),
            'echelon' => $this->normalizeEchelon($values['echelon'] ?? null),
            'date_of_birth' => $this->normalizeDate($values['date_of_birth'] ?? null),
            'date_recrutement' => $this->normalizeDate($values['date_recrutement'] ?? null),
            'date_last_promotion' => $this->normalizeDate($values['date_last_promotion'] ?? null),
            'date_last_grade_promotion' => $this->normalizeDate($values['date_last_grade_promotion'] ?? $values['date_last_promotion'] ?? null),
            'date_last_echelon_promotion' => $this->normalizeDate($values['date_last_echelon_promotion'] ?? $values['date_last_promotion'] ?? null),
        ];
    }

    protected function readRows(UploadedFile $file): array
    {
        $extension = strtolower($file->getClientOriginalExtension());

        return match ($extension) {
            'csv', 'txt' => $this->readCsvRows($file),
            'xlsx' => $this->readXlsxRows($file),
            default => [],
        };
    }

    protected function readCsvRows(UploadedFile $file): array
    {
        $handle = fopen($file->getRealPath(), 'rb');
        $rows = [];

        if (! $handle) {
            return $rows;
        }

        while (($data = fgetcsv($handle, 0, ';')) !== false) {
            $rows[] = count($data) === 1 ? str_getcsv($data[0]) : $data;
        }

        fclose($handle);

        return $rows;
    }

    protected function readXlsxRows(UploadedFile $file): array
    {
        $zip = new ZipArchive();

        if ($zip->open($file->getRealPath()) !== true) {
            return [];
        }

        $sharedStrings = $this->readSharedStrings($zip);
        $sheetPath = $this->resolveFirstSheetPath($zip);
        $sheetXml = $sheetPath ? $zip->getFromName($sheetPath) : false;
        $zip->close();

        if ($sheetXml === false) {
            return [];
        }

        $sheet = @simplexml_load_string($sheetXml);

        if (! $sheet) {
            return [];
        }

        $sheet->registerXPathNamespace('main', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');
        $rows = [];

        foreach ($sheet->xpath('//main:sheetData/main:row') as $row) {
            $cells = [];

            foreach ($row->c as $cell) {
                $reference = (string) $cell['r'];
                $columnIndex = $this->columnLettersToIndex(preg_replace('/\d+/', '', $reference));
                $type = (string) $cell['t'];
                $value = (string) ($cell->v ?? '');

                if ($type === 's') {
                    $cells[$columnIndex] = $sharedStrings[(int) $value] ?? '';
                } elseif ($type === 'inlineStr') {
                    $cells[$columnIndex] = (string) ($cell->is->t ?? '');
                } else {
                    $cells[$columnIndex] = $value;
                }
            }

            if (! empty($cells)) {
                ksort($cells);
                $maxIndex = max(array_keys($cells));
                $filledRow = array_fill(0, $maxIndex + 1, null);

                foreach ($cells as $columnIndex => $cellValue) {
                    $filledRow[$columnIndex] = $cellValue;
                }

                $rows[] = $filledRow;
            }
        }

        return $rows;
    }

    protected function readSharedStrings(ZipArchive $zip): array
    {
        $sharedStringsXml = $zip->getFromName('xl/sharedStrings.xml');

        if ($sharedStringsXml === false) {
            return [];
        }

        $xml = @simplexml_load_string($sharedStringsXml);

        if (! $xml) {
            return [];
        }

        $xml->registerXPathNamespace('main', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');

        return collect($xml->xpath('//main:si'))
            ->map(function ($item) {
                $chunks = [];

                foreach ($item->xpath('.//main:t') as $textNode) {
                    $chunks[] = (string) $textNode;
                }

                return implode('', $chunks);
            })
            ->all();
    }

    protected function resolveFirstSheetPath(ZipArchive $zip): ?string
    {
        if ($zip->locateName('xl/worksheets/sheet1.xml') !== false) {
            return 'xl/worksheets/sheet1.xml';
        }

        $workbookRelsXml = $zip->getFromName('xl/_rels/workbook.xml.rels');

        if ($workbookRelsXml === false) {
            return null;
        }

        $xml = @simplexml_load_string($workbookRelsXml);

        if (! $xml) {
            return null;
        }

        foreach ($xml->Relationship as $relationship) {
            $target = (string) $relationship['Target'];

            if (str_contains($target, 'worksheets/')) {
                return Str::startsWith($target, 'xl/') ? $target : 'xl/'.$target;
            }
        }

        return null;
    }

    protected function extractHeaderMap(array $rows): array
    {
        $requiredHeaders = collect([
            ...self::HEADER_ALIASES['num_dr'],
            ...self::HEADER_ALIASES['last_name'],
            ...self::HEADER_ALIASES['first_name'],
            ...self::HEADER_ALIASES['date_recrutement'],
        ])->map(fn ($header) => $this->normalizeHeader($header))->all();

        foreach ($rows as $index => $row) {
            $normalizedRow = collect($row)->map(fn ($cell) => $this->normalizeHeader($cell))->all();

            if (collect($normalizedRow)->intersect($requiredHeaders)->count() < 3) {
                continue;
            }

            $headerMap = [];

            foreach ($normalizedRow as $columnIndex => $header) {
                foreach (self::HEADER_ALIASES as $field => $aliases) {
                    if (in_array($header, array_map([$this, 'normalizeHeader'], $aliases), true)) {
                        $headerMap[$field] = $columnIndex;
                    }
                }
            }

            return [$headerMap, array_slice($rows, $index + 1)];
        }

        return [[], []];
    }

    protected function rowIsEmpty(array $row): bool
    {
        return Collection::make($row)->filter(fn ($cell) => filled($this->cleanCell($cell)))->isEmpty();
    }

    protected function cleanCell(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $string = trim((string) $value);

        return $string === '' ? null : $string;
    }

    protected function normalizeHeader(mixed $value): string
    {
        return Str::of((string) $value)
            ->ascii()
            ->lower()
            ->replaceMatches('/[^a-z0-9]+/', '')
            ->toString();
    }

    protected function normalizeDate(mixed $value): ?string
    {
        if (blank($value)) {
            return null;
        }

        if (is_numeric($value)) {
            return Carbon::create(1899, 12, 30)->addDays((int) $value)->toDateString();
        }

        $stringValue = trim((string) $value);

        foreach (['Y-m-d', 'd/m/Y', 'd/m/y', 'j/n/Y', 'j/n/y', 'm/d/Y', 'n/j/Y', 'm/d/y', 'n/j/y'] as $format) {
            try {
                return Carbon::createFromFormat($format, $stringValue)->toDateString();
            } catch (\Throwable) {
            }
        }

        try {
            return Carbon::parse($stringValue)->toDateString();
        } catch (\Throwable) {
            return null;
        }
    }

    protected function normalizeGrade(?string $value): string
    {
        $grade = Str::upper(trim((string) $value));

        return GradeEnum::tryFrom($grade)?->value ?? GradeEnum::A->value;
    }

    protected function normalizeEchelon(mixed $value): int
    {
        $echelon = (int) $value;

        return $echelon >= 1 && $echelon <= 4 ? $echelon : 1;
    }

    protected function buildFallbackEmail(string $numDr): string
    {
        $slug = Str::of($numDr)
            ->ascii()
            ->lower()
            ->replaceMatches('/[^a-z0-9]+/', '-')
            ->trim('-')
            ->toString();

        return "{$slug}@import.local";
    }

    protected function columnLettersToIndex(string $letters): int
    {
        $letters = strtoupper($letters);
        $index = 0;

        foreach (str_split($letters) as $character) {
            $index = ($index * 26) + (ord($character) - 64);
        }

        return max(0, $index - 1);
    }
}
