<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'professeur_id' => $this->professeur_id,
            'original_name' => $this->original_name,
            'display_name' => $this->display_name,
            'stored_name' => $this->stored_name,
            'file_path' => $this->file_path,
            'category' => $this->category?->value,
            'category_label' => $this->category?->label(),
            'file_type' => $this->file_type,
            'mime_type' => $this->mime_type,
            'file_size' => $this->file_size,
            'download_url' => route('documents.download', $this->resource),
            'preview_url' => route('documents.preview', $this->resource),
            'professeur' => $this->whenLoaded('professeur', fn () => new ProfesseurResource($this->professeur)),
            'uploader' => $this->whenLoaded('uploader', fn () => new UserResource($this->uploader)),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
