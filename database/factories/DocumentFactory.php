<?php

namespace Database\Factories;

use App\Models\Document;
use App\Models\Professeur;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentFactory extends Factory
{
    protected $model = Document::class;

    public function definition(): array
    {
        return [
            'professeur_id' => Professeur::factory(),
            'original_name' => fake()->randomElement(['attestation-travail.pdf', 'cv-academique.pdf', 'arrete-nomination.pdf']),
            'display_name' => fake()->optional()->sentence(3),
            'stored_name' => fake()->uuid().'.pdf',
            'file_path' => 'documents/'.$this->faker->numberBetween(1, 20).'/'.$this->faker->uuid().'.pdf',
            'file_type' => 'pdf',
            'mime_type' => 'application/pdf',
            'file_size' => fake()->numberBetween(10000, 250000),
        ];
    }
}
