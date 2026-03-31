<?php

namespace Database\Factories;

use App\Enums\PromotionStatusEnum;
use App\Enums\PromotionTypeEnum;
use App\Models\Professeur;
use App\Models\Promotion;
use Illuminate\Database\Eloquent\Factories\Factory;

class PromotionFactory extends Factory
{
    protected $model = Promotion::class;

    public function definition(): array
    {
        $type = fake()->randomElement(PromotionTypeEnum::cases());
        $status = fake()->randomElement(PromotionStatusEnum::cases());
        $oldEchelon = fake()->numberBetween(1, 3);

        return [
            'professeur_id' => Professeur::factory(),
            'type' => $type,
            'old_grade' => fake()->randomElement(['A', 'B']),
            'new_grade' => fake()->randomElement(['B', 'C']),
            'old_echelon' => $oldEchelon,
            'new_echelon' => $type === PromotionTypeEnum::GRADE ? 1 : $oldEchelon + 1,
            'status' => $status,
            'effective_date' => fake()->optional()->date(),
            'decided_at' => $status === PromotionStatusEnum::PENDING ? null : now(),
            'notes' => fake()->optional()->sentence(),
            'rejection_reason' => $status === PromotionStatusEnum::REJECTED ? fake()->sentence() : null,
        ];
    }
}
