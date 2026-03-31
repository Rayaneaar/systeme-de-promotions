<?php

namespace App\Enums;

enum NotificationTypeEnum: string
{
    case PROMOTION_APPROVED = 'promotion_approved';
    case PROMOTION_REJECTED = 'promotion_rejected';

    public function label(): string
    {
        return match ($this) {
            self::PROMOTION_APPROVED => 'Promotion approuvee',
            self::PROMOTION_REJECTED => 'Promotion rejetee',
        };
    }
}
