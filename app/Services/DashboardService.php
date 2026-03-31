<?php

namespace App\Services;

use App\Models\Document;
use App\Models\Professeur;
use App\Models\Promotion;
use App\Models\User;

class DashboardService
{
    public function __construct(
        protected EligibilityService $eligibilityService
    ) {
    }

    public function admin(): array
    {
        $professeurs = Professeur::all();
        $eligibleGrade = 0;
        $eligibleEchelon = 0;

        foreach ($professeurs as $professeur) {
            $eligibility = $this->eligibilityService->getEligibilityForProfesseur($professeur);

            if ($eligibility['overall']['eligible_for_grade']) {
                $eligibleGrade++;
            }

            if ($eligibility['overall']['eligible_for_echelon']) {
                $eligibleEchelon++;
            }
        }

        return [
            'stats' => [
                'total_teachers' => $professeurs->count(),
                'eligible_grade_promotions' => $eligibleGrade,
                'eligible_echelon_promotions' => $eligibleEchelon,
                'pending_promotions' => Promotion::query()->where('status', 'pending')->count(),
                'total_documents' => Document::query()->count(),
            ],
            'recent_promotions' => Promotion::query()->latest()->with(['professeur', 'approver'])->limit(5)->get(),
            'recent_documents' => Document::query()->latest()->with(['professeur', 'uploader'])->limit(5)->get(),
        ];
    }

    public function teacher(User $user): array
    {
        $professeur = $user->professeur()->with(['documents', 'promotions.approver'])->firstOrFail();
        $eligibility = $this->eligibilityService->getEligibilityForProfesseur($professeur);

        return [
            'profile' => $professeur,
            'eligibility' => $eligibility,
            'stats' => [
                'current_grade' => $professeur->grade->value,
                'current_echelon' => $professeur->echelon,
                'years_of_service' => $eligibility['years_of_service'],
                'documents_count' => $professeur->documents->count(),
                'promotions_count' => $professeur->promotions->count(),
            ],
            'recent_documents' => $professeur->documents->sortByDesc('created_at')->take(5)->values(),
            'recent_promotions' => $professeur->promotions->sortByDesc('created_at')->take(5)->values(),
        ];
    }
}
