<?php

namespace App\Services;

use App\Models\Document;
use App\Models\Professeur;
use App\Models\User;
use App\Support\FileHelper;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class DocumentService
{
    public function upload(Professeur $professeur, UploadedFile $file, User $uploader, ?string $displayName = null): Document
    {
        $storedName = FileHelper::buildStoredName($file);
        $folder = 'documents/'.$professeur->id;
        $path = $file->storeAs($folder, $storedName, 'local');

        return Document::create([
            'professeur_id' => $professeur->id,
            'original_name' => $file->getClientOriginalName(),
            'display_name' => $displayName,
            'stored_name' => $storedName,
            'file_path' => $path,
            'file_type' => FileHelper::extensionFromName($file->getClientOriginalName()),
            'mime_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'uploaded_by' => $uploader->id,
        ]);
    }

    public function rename(Document $document, string $displayName): Document
    {
        $document->update([
            'display_name' => $displayName,
        ]);

        return $document->fresh(['professeur', 'uploader']);
    }

    public function delete(Document $document): void
    {
        if (Storage::disk('local')->exists($document->file_path)) {
            Storage::disk('local')->delete($document->file_path);
        }

        $document->delete();
    }

    public function deleteAllForProfesseur(Professeur $professeur): int
    {
        $documents = $professeur->documents()->get();
        $count = $documents->count();

        foreach ($documents as $document) {
            $this->delete($document);
        }

        return $count;
    }
}
