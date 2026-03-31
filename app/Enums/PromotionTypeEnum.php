<?php

namespace App\Enums;

enum PromotionTypeEnum: string
{
    case GRADE = 'grade';
    case ECHELON = 'echelon';

    public function label(): string
    {
        return match ($this) {
            self::GRADE => 'Promotion de grade',
            self::ECHELON => "Promotion d'echelon",
        };
    }
}
