<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromotionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'professeur_id' => $this->professeur_id,
            'type' => $this->type?->value,
            'type_label' => $this->type?->label(),
            'old_grade' => $this->old_grade,
            'new_grade' => $this->new_grade,
            'old_echelon' => $this->old_echelon,
            'new_echelon' => $this->new_echelon,
            'status' => $this->status?->value,
            'status_label' => $this->status?->label(),
            'effective_date' => $this->effective_date?->toDateString(),
            'decided_at' => $this->decided_at?->toISOString(),
            'notes' => $this->notes,
            'rejection_reason' => $this->rejection_reason,
            'professeur' => $this->whenLoaded('professeur', fn () => new ProfesseurResource($this->professeur)),
            'requester' => $this->whenLoaded('requester', fn () => new UserResource($this->requester)),
            'approver' => $this->whenLoaded('approver', fn () => new UserResource($this->approver)),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
