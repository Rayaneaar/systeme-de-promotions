<?php

namespace App\Services;

use App\Enums\PromotionTypeEnum;
use App\Models\Professeur;
use Carbon\Carbon;

class EligibilityService
{
    public function getEligibilityForProfesseur(Professeur $professeur): array
    {
        $today = Carbon::today();
        $yearsOfService = Carbon::parse($professeur->date_recrutement)->diffInYears($today);

        $gradeReference = Carbon::parse($professeur->date_last_grade_promotion ?? $professeur->date_recrutement);
        $echelonReference = Carbon::parse($professeur->date_last_echelon_promotion ?? $professeur->date_last_promotion ?? $professeur->date_recrutement);
        $lastPromotionReference = Carbon::parse($professeur->date_last_promotion ?? $professeur->date_recrutement);

        $gradeRule = config('promotion.grade_rules')[$professeur->grade->value] ?? null;
        $echelonRule = config('promotion.echelon_rules')[$professeur->echelon] ?? null;

        $yearsInGrade = $gradeReference->diffInYears($today);
        $yearsInEchelon = $echelonReference->diffInYears($today);
        $yearsSinceLastPromotion = $lastPromotionReference->diffInYears($today);

        $gradeEligible = $gradeRule !== null
            && $yearsInGrade >= $gradeRule['years_in_grade_required']
            && $professeur->echelon >= $gradeRule['min_echelon']
            && $yearsInEchelon >= $gradeRule['years_in_echelon_required'];

        $echelonEligible = $echelonRule !== null
            && $yearsInEchelon >= $echelonRule['years_required'];

        $recommendation = $gradeEligible
            ? PromotionTypeEnum::GRADE->value
            : ($echelonEligible ? PromotionTypeEnum::ECHELON->value : null);

        return [
            'years_of_service' => $yearsOfService,
            'years_since_last_promotion' => $yearsSinceLastPromotion,
            'cadre' => config('promotion.cadre_label'),
            'grade' => [
                'current' => $professeur->grade->value,
                'next' => $gradeRule['next'] ?? null,
                'eligible' => $gradeEligible,
                'years_in_grade' => $yearsInGrade,
                'years_required' => $gradeRule['years_in_grade_required'] ?? null,
                'min_echelon' => $gradeRule['min_echelon'] ?? null,
                'years_in_current_echelon' => $yearsInEchelon,
                'years_required_in_current_echelon' => $gradeRule['years_in_echelon_required'] ?? null,
                'remaining_years' => $gradeRule ? max(0, $gradeRule['years_in_grade_required'] - $yearsInGrade) : null,
            ],
            'echelon' => [
                'current' => $professeur->echelon,
                'next' => $echelonRule['next'] ?? null,
                'eligible' => $echelonEligible,
                'years_in_echelon' => $yearsInEchelon,
                'years_required' => $echelonRule['years_required'] ?? null,
                'remaining_years' => $echelonRule ? max(0, $echelonRule['years_required'] - $yearsInEchelon) : null,
            ],
            'overall' => [
                'eligible_for_grade' => $gradeEligible,
                'eligible_for_echelon' => $echelonEligible,
                'can_submit_request' => $gradeEligible || $echelonEligible,
                'recommended_type' => $recommendation,
            ],
        ];
    }

    public function getSummary(Professeur $professeur): array
    {
        $eligibility = $this->getEligibilityForProfesseur($professeur);

        return [
            'years_of_service' => $eligibility['years_of_service'],
            'eligible_for_grade' => $eligibility['overall']['eligible_for_grade'],
            'eligible_for_echelon' => $eligibility['overall']['eligible_for_echelon'],
            'recommended_type' => $eligibility['overall']['recommended_type'],
            'next_grade' => $eligibility['grade']['next'],
            'next_echelon' => $eligibility['echelon']['next'],
        ];
    }
}
