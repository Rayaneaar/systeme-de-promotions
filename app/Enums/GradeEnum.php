<?php

namespace App\Enums;

enum GradeEnum: string
{
    case A = 'A';
    case B = 'B';
    case C = 'C';

    public function label(): string
    {
        return match ($this) {
            self::A => 'Grade A',
            self::B => 'Grade B',
            self::C => 'Grade C',
        };
    }

    public function next(): ?self
    {
        return match ($this) {
            self::A => self::B,
            self::B => self::C,
            self::C => null,
        };
    }
}
