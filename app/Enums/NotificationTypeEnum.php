<?php

namespace App\Enums;

enum NotificationTypeEnum: string
{
    case PROMOTION_SUBMITTED = 'promotion_submitted';
    case PROMOTION_APPROVED = 'promotion_approved';
    case PROMOTION_REJECTED = 'promotion_rejected';
    case ADMIN_MESSAGE = 'admin_message';
    case TEACHER_REPORT = 'teacher_report';

    public function label(): string
    {
        return match ($this) {
            self::PROMOTION_SUBMITTED => 'Nouvelle demande',
            self::PROMOTION_APPROVED => 'Promotion approuvee',
            self::PROMOTION_REJECTED => 'Promotion rejetee',
            self::ADMIN_MESSAGE => 'Message administratif',
            self::TEACHER_REPORT => 'Signalement enseignant',
        };
    }
}
