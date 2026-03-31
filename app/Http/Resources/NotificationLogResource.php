<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type?->value,
            'type_label' => $this->type?->label(),
            'title' => $this->title,
            'message' => $this->message,
            'is_read' => $this->is_read,
            'read_at' => $this->read_at?->toISOString(),
            'data' => $this->data,
            'promotion' => $this->whenLoaded('promotion', fn () => new PromotionResource($this->promotion)),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
