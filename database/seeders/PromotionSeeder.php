<?php

namespace Database\Seeders;

use App\Enums\PromotionStatusEnum;
use App\Enums\PromotionTypeEnum;
use App\Models\Professeur;
use App\Models\Promotion;
use App\Models\User;
use Illuminate\Database\Seeder;

class PromotionSeeder extends Seeder
{
    public function run(): void
    {
        $adminId = User::query()->where('email', 'admin@example.com')->value('id');

        Professeur::query()->take(6)->get()->each(function (Professeur $professeur) use ($adminId) {
            Promotion::create([
                'professeur_id' => $professeur->id,
                'requested_by' => $professeur->user_id,
                'approved_by' => $adminId,
                'type' => PromotionTypeEnum::ECHELON,
                'old_grade' => $professeur->grade->value,
                'new_grade' => $professeur->grade->value,
                'old_echelon' => max(1, $professeur->echelon - 1),
                'new_echelon' => $professeur->echelon,
                'status' => PromotionStatusEnum::APPROVED,
                'effective_date' => now()->subMonths(18)->toDateString(),
                'decided_at' => now()->subMonths(18),
                'notes' => 'Avancement d echelon valide apres verification administrative.',
            ]);
        });

        Professeur::query()->whereIn('grade', ['A', 'B'])->take(4)->get()->each(function (Professeur $professeur) {
            Promotion::create([
                'professeur_id' => $professeur->id,
                'requested_by' => $professeur->user_id,
                'type' => PromotionTypeEnum::GRADE,
                'old_grade' => $professeur->grade->value,
                'new_grade' => $professeur->grade->next()?->value,
                'old_echelon' => $professeur->echelon,
                'new_echelon' => 1,
                'status' => PromotionStatusEnum::PENDING,
                'notes' => 'Passage au grade superieur en attente de validation.',
            ]);
        });

        $rejectedProfesseur = Professeur::query()->where('grade', 'B')->first();

        if ($rejectedProfesseur) {
            Promotion::create([
                'professeur_id' => $rejectedProfesseur->id,
                'requested_by' => $rejectedProfesseur->user_id,
                'approved_by' => $adminId,
                'type' => PromotionTypeEnum::GRADE,
                'old_grade' => 'B',
                'new_grade' => 'C',
                'old_echelon' => max(3, $rejectedProfesseur->echelon),
                'new_echelon' => 1,
                'status' => PromotionStatusEnum::REJECTED,
                'decided_at' => now()->subMonths(2),
                'notes' => 'Demande rejetee apres etude de la commission.',
                'rejection_reason' => 'Pieces administratives incompletes.',
            ]);
        }
    }
}
