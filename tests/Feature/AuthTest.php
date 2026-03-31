<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_can_register_and_receive_a_token(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'num_dr' => 'DRPP 120',
            'first_name' => 'Salma',
            'last_name' => 'Alaoui',
            'email' => 'salma@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'cin' => 'ZZ123456',
            'ppr' => '99887766',
            'specialite' => 'Informatique',
            'grade' => 'A',
            'echelon' => 2,
            'date_recrutement' => now()->subYears(4)->toDateString(),
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.email', 'salma@example.com');

        $this->assertDatabaseHas('users', [
            'email' => 'salma@example.com',
            'role' => 'teacher',
        ]);
    }
}
