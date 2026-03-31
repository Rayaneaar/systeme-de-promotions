<?php

namespace Database\Factories;

use App\Enums\GradeEnum;
use App\Models\Professeur;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfesseurFactory extends Factory
{
    protected $model = Professeur::class;

    public function definition(): array
    {
        $recruitmentDate = Carbon::instance(fake()->dateTimeBetween('-18 years', '-2 years'));
        $grade = fake()->randomElement(GradeEnum::cases());

        return [
            'user_id' => User::factory(),
            'num_dr' => 'DRPP '.str_pad((string) fake()->unique()->numberBetween(1, 999), 3, '0', STR_PAD_LEFT),
            'cin' => fake()->boolean(60) ? strtoupper(fake()->unique()->bothify('??######')) : null,
            'ppr' => fake()->boolean(60) ? fake()->unique()->numerify('########') : null,
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'date_of_birth' => fake()->dateTimeBetween('-65 years', '-30 years'),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'specialite' => fake()->randomElement(['Informatique', 'Mathematiques', 'Physique', 'Chimie', 'Droit', 'Economie']),
            'grade' => $grade,
            'echelon' => fake()->numberBetween(1, 4),
            'date_recrutement' => $recruitmentDate->toDateString(),
            'date_last_promotion' => $recruitmentDate->copy()->addYears(fake()->numberBetween(0, 6))->toDateString(),
            'date_last_grade_promotion' => $recruitmentDate->copy()->addYears(fake()->numberBetween(0, 6))->toDateString(),
            'date_last_echelon_promotion' => $recruitmentDate->copy()->addYears(fake()->numberBetween(0, 6))->toDateString(),
            'anciennete_cache' => $recruitmentDate->diffInYears(now()),
        ];
    }
}
