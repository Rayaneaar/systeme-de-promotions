<?php

namespace Database\Seeders;

use App\Models\Document;
use App\Models\Professeur;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentSeeder extends Seeder
{
    public function run(): void
    {
        Storage::disk('local')->makeDirectory('documents');

        Professeur::query()->take(6)->get()->each(function (Professeur $professeur) {
            foreach ([
                'attestation-travail.pdf',
                'cv-academique.pdf',
                'arrete-nomination.pdf',
            ] as $name) {
                $storedName = now()->format('YmdHis').'_'.Str::uuid().'.pdf';
                $path = 'documents/'.$professeur->id.'/'.$storedName;

                Storage::disk('local')->put($path, "%PDF-1.1\n".'Document exemple pour '.$professeur->full_name);

                Document::create([
                    'professeur_id' => $professeur->id,
                    'original_name' => $name,
                    'display_name' => pathinfo($name, PATHINFO_FILENAME),
                    'stored_name' => $storedName,
                    'file_path' => $path,
                    'file_type' => 'pdf',
                    'mime_type' => 'application/pdf',
                    'file_size' => Storage::disk('local')->size($path),
                    'uploaded_by' => $professeur->user_id,
                ]);
            }
        });
    }
}
