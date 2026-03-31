<?php

namespace App\Enums;

enum PromotionStatusEnum: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'En attente',
            self::APPROVED => 'Approuvee',
            self::REJECTED => 'Rejetee',
        };
    }
}
