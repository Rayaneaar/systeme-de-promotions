<?php

namespace App\Http\Resources;

use App\Support\PromotionReferenceHelper;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfesseurResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $eligibility = $this->eligibility ?? null;

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'num_dr' => $this->num_dr,
            'cin' => $this->cin,
            'ppr' => $this->ppr,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->whenLoaded('user', fn () => $this->user?->email),
            'phone' => $this->phone,
            'address' => $this->address,
            'specialite' => $this->specialite,
            'cadre_label' => config('promotion.cadre_label'),
            'grade' => $this->grade?->value,
            'grade_label' => $this->grade?->label(),
            'echelon' => $this->echelon,
            'reference_number' => PromotionReferenceHelper::resolve($this->grade?->value, $this->echelon),
            'date_of_birth' => $this->date_of_birth?->toDateString(),
            'date_recrutement' => $this->date_recrutement?->toDateString(),
            'date_last_promotion' => $this->date_last_promotion?->toDateString(),
            'date_last_grade_promotion' => $this->date_last_grade_promotion?->toDateString(),
            'date_last_echelon_promotion' => $this->date_last_echelon_promotion?->toDateString(),
            'anciennete_cache' => $this->anciennete_cache,
            'promotion_reference_matrix' => PromotionReferenceHelper::matrix(),
            'promotion_timeline' => $this->buildPromotionTimeline(),
            'eligibility' => $this->when(! is_null($eligibility), $eligibility),
            'next_promotion' => $this->when(! is_null(data_get($eligibility, 'next_promotion')), data_get($eligibility, 'next_promotion')),
            'documents_count' => $this->whenCounted('documents'),
            'promotions_count' => $this->whenCounted('promotions'),
            'user' => $this->whenLoaded('user', fn () => new UserResource($this->user)),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }

    protected function buildPromotionTimeline(): array
    {
        $recruitmentDate = $this->date_recrutement ? Carbon::parse($this->date_recrutement) : null;

        if (! $recruitmentDate) {
            return [];
        }

        $b1 = $recruitmentDate->copy()->addYears(6);
        $c1 = $b1->copy()->addYears(6);

        return [
            'grade_a' => [
                'echelon_2' => $recruitmentDate->copy()->addYears(2)->toDateString(),
                'echelon_3' => $recruitmentDate->copy()->addYears(4)->toDateString(),
                'echelon_4' => $recruitmentDate->copy()->addYears(6)->toDateString(),
            ],
            'grade_b' => [
                'echelon_1' => $b1->toDateString(),
                'echelon_2' => $b1->copy()->addYears(2)->toDateString(),
                'echelon_3' => $b1->copy()->addYears(4)->toDateString(),
                'echelon_4' => $b1->copy()->addYears(6)->toDateString(),
            ],
            'grade_c' => [
                'echelon_1' => $c1->toDateString(),
                'echelon_2' => $c1->copy()->addYears(2)->toDateString(),
                'echelon_3' => $c1->copy()->addYears(4)->toDateString(),
                'echelon_4' => $c1->copy()->addYears(6)->toDateString(),
            ],
        ];
    }
}
