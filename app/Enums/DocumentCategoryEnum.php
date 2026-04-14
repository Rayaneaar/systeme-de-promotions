<?php

namespace App\Enums;

enum DocumentCategoryEnum: string
{
    case ADMINISTRATIF = 'administratif';
    case PEDAGOGIQUE = 'pedagogique';

    public function label(): string
    {
        return match ($this) {
            self::ADMINISTRATIF => 'Administratif',
            self::PEDAGOGIQUE => 'Pedagogique',
        };
    }
}
