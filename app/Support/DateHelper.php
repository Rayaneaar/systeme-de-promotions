<?php

namespace App\Support;

use Carbon\CarbonInterface;

class DateHelper
{
    public static function format(?CarbonInterface $date, string $format = 'd/m/Y'): ?string
    {
        return $date?->translatedFormat($format);
    }
}
