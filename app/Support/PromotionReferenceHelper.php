<?php

namespace App\Support;

class PromotionReferenceHelper
{
    public static function resolve(?string $grade, ?int $echelon): ?int
    {
        if (! $grade || ! $echelon) {
            return null;
        }

        return config("promotion.reference_numbers.{$grade}.{$echelon}");
    }

    public static function matrix(): array
    {
        return collect(config('promotion.reference_numbers', []))
            ->map(fn (array $echelons, string $grade) => [
                'grade' => $grade,
                'rows' => collect($echelons)
                    ->map(fn (int $referenceNumber, int|string $echelon) => [
                        'echelon' => (int) $echelon,
                        'reference_number' => $referenceNumber,
                    ])
                    ->values()
                    ->all(),
            ])
            ->values()
            ->all();
    }
}
