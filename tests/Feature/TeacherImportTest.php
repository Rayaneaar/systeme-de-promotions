<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TeacherImportTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_import_teachers_from_a_csv_file(): void
    {
        $admin = User::factory()->create([
            'role' => RoleEnum::ADMIN,
        ]);

        Sanctum::actingAs($admin);

        $file = UploadedFile::fake()->createWithContent(
            'teachers.csv',
            implode("\n", [
                'NUM DRPP,Nom,Prenom,Email,Date recrutement,Grade,Echelon',
                'DRPP 120,Alaoui,Salma,salma@example.com,2020-01-01,A,2',
            ])
        );

        $response = $this->post('/api/professeurs/import', [
            'file' => $file,
        ], [
            'Accept' => 'application/json',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.created_count', 1);

        $this->assertDatabaseHas('users', [
            'email' => 'salma@example.com',
            'role' => 'teacher',
        ]);

        $this->assertDatabaseHas('professeurs', [
            'num_dr' => 'DRPP 120',
            'first_name' => 'Salma',
            'last_name' => 'Alaoui',
        ]);
    }
}
