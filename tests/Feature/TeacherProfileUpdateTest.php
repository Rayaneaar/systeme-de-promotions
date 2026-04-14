<?php

namespace Tests\Feature;

use App\Enums\GradeEnum;
use App\Enums\RoleEnum;
use App\Models\Professeur;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TeacherProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_can_only_update_contact_fields_from_settings(): void
    {
        $teacher = User::factory()->create([
            'role' => RoleEnum::TEACHER,
            'email' => 'teacher@example.com',
        ]);

        Professeur::factory()->create([
            'user_id' => $teacher->id,
            'first_name' => 'Initial',
            'last_name' => 'Teacher',
            'phone' => '0600000000',
            'address' => 'Adresse initiale',
            'grade' => GradeEnum::A,
            'echelon' => 2,
        ]);

        Sanctum::actingAs($teacher);

        $response = $this->patchJson('/api/me/profile', [
            'first_name' => 'Modifie',
            'email' => 'new@example.com',
            'phone' => '0611111111',
            'address' => 'Nouvelle adresse',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.email', 'new@example.com')
            ->assertJsonPath('data.phone', '0611111111')
            ->assertJsonPath('data.address', 'Nouvelle adresse')
            ->assertJsonPath('data.first_name', 'Initial');

        $this->assertDatabaseHas('users', [
            'id' => $teacher->id,
            'email' => 'new@example.com',
        ]);

        $this->assertDatabaseHas('professeurs', [
            'user_id' => $teacher->id,
            'first_name' => 'Initial',
            'phone' => '0611111111',
            'address' => 'Nouvelle adresse',
        ]);
    }
}
