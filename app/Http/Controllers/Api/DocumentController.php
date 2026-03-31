<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Document\RenameDocumentRequest;
use App\Http\Requests\Document\UploadDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use App\Models\Professeur;
use App\Services\DocumentService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function __construct(
        protected DocumentService $documentService
    ) {
    }

    public function index(Request $request)
    {
        $documents = Document::query()
            ->with(['professeur.user', 'uploader'])
            ->when($request->filled('professeur_id'), fn ($builder) => $builder->where('professeur_id', $request->integer('professeur_id')))
            ->when($request->string('search')->toString(), function ($builder, $search) {
                $builder->where(function ($nested) use ($search) {
                    $nested
                        ->where('original_name', 'like', "%{$search}%")
                        ->orWhere('display_name', 'like', "%{$search}%")
                        ->orWhereHas('professeur', fn ($professeurQuery) => $professeurQuery
                            ->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->paginate($request->integer('per_page', 12))
            ->withQueryString();

        return ApiResponse::paginated(
            $documents,
            DocumentResource::collection($documents->getCollection())->resolve(),
            'Documents recuperes.'
        );
    }

    public function myDocuments(Request $request)
    {
        $professeur = $request->user()->professeur()->firstOrFail();
        $documents = $professeur->documents()->with(['professeur.user', 'uploader'])->latest()->get();

        return ApiResponse::success(DocumentResource::collection($documents)->resolve(), 'Mes documents ont ete recuperes.');
    }

    public function listForProfesseur(Professeur $professeur)
    {
        $this->authorize('view', $professeur);
        $documents = $professeur->documents()->with(['professeur.user', 'uploader'])->latest()->get();

        return ApiResponse::success(DocumentResource::collection($documents)->resolve(), 'Documents du professeur recuperes.');
    }

    public function uploadMyDocument(UploadDocumentRequest $request)
    {
        $professeur = $request->user()->professeur()->firstOrFail();
        $document = $this->documentService
            ->upload($professeur, $request->file('file'), $request->user(), $request->input('display_name'))
            ->load(['professeur.user', 'uploader']);

        return ApiResponse::success(new DocumentResource($document), 'Document televerse avec succes.', 201);
    }

    public function uploadForProfesseur(UploadDocumentRequest $request, Professeur $professeur)
    {
        $this->authorize('create', [Document::class, $professeur]);
        $document = $this->documentService
            ->upload($professeur, $request->file('file'), $request->user(), $request->input('display_name'))
            ->load(['professeur.user', 'uploader']);

        return ApiResponse::success(new DocumentResource($document), 'Document televerse avec succes.', 201);
    }

    public function download(Document $document)
    {
        $this->authorize('view', $document);

        return Storage::disk('local')->download($document->file_path, $document->display_name ?: $document->original_name);
    }

    public function rename(RenameDocumentRequest $request, Document $document)
    {
        $this->authorize('update', $document);
        $document = $this->documentService
            ->rename($document, $request->validated()['display_name']);

        return ApiResponse::success(new DocumentResource($document), 'Document renomme avec succes.');
    }

    public function destroy(Document $document)
    {
        $this->authorize('delete', $document);
        $this->documentService->delete($document);

        return ApiResponse::success(null, 'Document supprime avec succes.');
    }

    public function destroyAllForProfesseur(Professeur $professeur)
    {
        $this->authorize('deleteAll', [Document::class, $professeur]);
        $count = $this->documentService->deleteAllForProfesseur($professeur);

        return ApiResponse::success(['deleted_count' => $count], 'Tous les documents du professeur ont ete supprimes.');
    }
}
