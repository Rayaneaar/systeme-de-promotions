<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Models\Professeur;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCreateTeacherTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_teacher_account(): void
    {
        $admin = User::factory()->create([
            'role' => RoleEnum::ADMIN,
        ]);

        $response = $this
            ->actingAs($admin, 'sanctum')
            ->postJson('/api/professeurs', [
                'num_dr' => 'DRPP 777',
                'first_name' => 'Salma',
                'last_name' => 'Bennani',
                'email' => 'salma.bennani@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'grade' => 'A',
                'echelon' => 1,
                'date_recrutement' => now()->subYears(2)->toDateString(),
            ]);

        $response
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.email', 'salma.bennani@example.com')
            ->assertJsonPath('data.grade', 'A');

        $this->assertDatabaseHas('users', [
            'email' => 'salma.bennani@example.com',
            'role' => 'teacher',
        ]);

        $this->assertDatabaseHas('professeurs', [
            'num_dr' => 'DRPP 777',
            'first_name' => 'Salma',
            'last_name' => 'Bennani',
        ]);

        $this->assertSame('Salma Bennani', Professeur::query()->firstOrFail()->user->name);
    }
}
