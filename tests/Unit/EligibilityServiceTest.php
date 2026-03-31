<?php

namespace Tests\Unit;

use App\Enums\GradeEnum;
use App\Enums\RoleEnum;
use App\Models\Professeur;
use App\Models\User;
use App\Services\EligibilityService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EligibilityServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_marks_professor_as_grade_eligible_when_rules_are_met(): void
    {
        $user = User::create([
            'name' => 'Prof Test',
            'email' => 'prof@test.com',
            'password' => 'password',
            'role' => RoleEnum::TEACHER,
        ]);

        $professeur = Professeur::create([
            'user_id' => $user->id,
            'num_dr' => 'DRPP 999',
            'cin' => 'AA111111',
            'ppr' => '44556677',
            'first_name' => 'Prof',
            'last_name' => 'Test',
            'specialite' => 'Mathematiques',
            'grade' => GradeEnum::A,
            'echelon' => 3,
            'date_recrutement' => now()->subYears(10)->toDateString(),
            'date_last_promotion' => now()->subYears(2)->toDateString(),
            'date_last_grade_promotion' => now()->subYears(6)->toDateString(),
            'date_last_echelon_promotion' => now()->subYears(2)->toDateString(),
            'anciennete_cache' => 10,
        ]);

        $eligibility = app(EligibilityService::class)->getEligibilityForProfesseur($professeur);

        $this->assertTrue($eligibility['overall']['eligible_for_grade']);
        $this->assertSame('B', $eligibility['grade']['next']);
        $this->assertSame('grade', $eligibility['overall']['recommended_type']);
    }
}
