<?php

namespace App\Services;

use App\Enums\PromotionStatusEnum;
use App\Enums\PromotionTypeEnum;
use App\Mail\PromotionApprovedMail;
use App\Models\Professeur;
use App\Models\Promotion;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;

class PromotionService
{
    public function __construct(
        protected EligibilityService $eligibilityService,
        protected NotificationService $notificationService
    ) {
    }

    public function createPromotion(array $data, User $actor): Promotion
    {
        $professeur = Professeur::findOrFail($data['professeur_id']);
        $payload = $this->buildPromotionPayload($professeur, $data['type']);

        return Promotion::create([
            ...$payload,
            'professeur_id' => $professeur->id,
            'requested_by' => $actor->id,
            'status' => PromotionStatusEnum::PENDING,
            'notes' => $data['notes'] ?? null,
        ]);
    }

    public function submitTeacherRequest(Professeur $professeur, User $teacher, ?string $type = null, ?string $notes = null): Promotion
    {
        $eligibility = $this->eligibilityService->getEligibilityForProfesseur($professeur);
        $type ??= $eligibility['overall']['recommended_type'];

        if ($type === null) {
            throw ValidationException::withMessages([
                'type' => "Ce professeur n'est pas encore eligible a une promotion.",
            ]);
        }

        $payload = $this->buildPromotionPayload($professeur, $type);
        $promotion = Promotion::create([
            ...$payload,
            'professeur_id' => $professeur->id,
            'requested_by' => $teacher->id,
            'status' => PromotionStatusEnum::PENDING,
            'notes' => $notes,
        ]);

        $this->notificationService->createPromotionSubmittedNotification($promotion->fresh(['professeur.user']));

        return $promotion;
    }

    public function approve(Promotion $promotion, User $approver, array $data = []): Promotion
    {
        if ($promotion->status !== PromotionStatusEnum::PENDING) {
            throw ValidationException::withMessages([
                'promotion' => 'Seules les promotions en attente peuvent etre approuvees.',
            ]);
        }

        $effectiveDate = Carbon::today()->toDateString();
        $professeur = $promotion->professeur;

        if ($promotion->type === PromotionTypeEnum::GRADE) {
            $professeur->grade = $promotion->new_grade;
            $professeur->echelon = 1;
            $professeur->date_last_grade_promotion = $effectiveDate;
            $professeur->date_last_echelon_promotion = $effectiveDate;
        }

        if ($promotion->type === PromotionTypeEnum::ECHELON) {
            $professeur->echelon = $promotion->new_echelon;
            $professeur->date_last_echelon_promotion = $effectiveDate;
        }

        $professeur->date_last_promotion = $effectiveDate;
        $professeur->anciennete_cache = Carbon::parse($professeur->date_recrutement)->diffInYears(Carbon::parse($effectiveDate));
        $professeur->save();

        $promotion->update([
            'status' => PromotionStatusEnum::APPROVED,
            'approved_by' => $approver->id,
            'effective_date' => $effectiveDate,
            'decided_at' => now(),
            'notes' => $data['notes'] ?? $promotion->notes,
        ]);

        $promotion = $promotion->fresh(['professeur.user', 'approver', 'requester']);

        $this->notificationService->createPromotionApprovedNotification($promotion);

        if ($promotion->professeur?->user?->email) {
            Mail::to($promotion->professeur->user->email)->send(new PromotionApprovedMail($promotion));
        }

        return $promotion;
    }

    public function reject(Promotion $promotion, User $approver, array $data): Promotion
    {
        if ($promotion->status !== PromotionStatusEnum::PENDING) {
            throw ValidationException::withMessages([
                'promotion' => 'Seules les promotions en attente peuvent etre rejetees.',
            ]);
        }

        $promotion->update([
            'status' => PromotionStatusEnum::REJECTED,
            'approved_by' => $approver->id,
            'decided_at' => now(),
            'rejection_reason' => $data['rejection_reason'],
            'notes' => $data['notes'] ?? $promotion->notes,
        ]);

        $this->notificationService->createPromotionRejectedNotification($promotion->fresh(['professeur.user']));

        return $promotion->fresh(['professeur', 'approver', 'requester']);
    }

    public function buildPromotionPayload(Professeur $professeur, string $type): array
    {
        $eligibility = $this->eligibilityService->getEligibilityForProfesseur($professeur);

        return match ($type) {
            PromotionTypeEnum::GRADE->value => $this->buildGradePayload($professeur, $eligibility),
            PromotionTypeEnum::ECHELON->value => $this->buildEchelonPayload($professeur, $eligibility),
            default => throw ValidationException::withMessages([
                'type' => 'Type de promotion non supporte.',
            ]),
        };
    }

    protected function buildGradePayload(Professeur $professeur, array $eligibility): array
    {
        if (! $eligibility['overall']['eligible_for_grade']) {
            throw ValidationException::withMessages([
                'type' => "Ce professeur n'est pas encore eligible a une promotion de grade.",
            ]);
        }

        return [
            'type' => PromotionTypeEnum::GRADE,
            'old_grade' => $professeur->grade->value,
            'new_grade' => $eligibility['grade']['next'],
            'old_echelon' => $professeur->echelon,
            'new_echelon' => 1,
        ];
    }

    protected function buildEchelonPayload(Professeur $professeur, array $eligibility): array
    {
        if (! $eligibility['overall']['eligible_for_echelon']) {
            throw ValidationException::withMessages([
                'type' => "Ce professeur n'est pas encore eligible a une promotion d'echelon.",
            ]);
        }

        return [
            'type' => PromotionTypeEnum::ECHELON,
            'old_grade' => $professeur->grade->value,
            'new_grade' => $professeur->grade->value,
            'old_echelon' => $professeur->echelon,
            'new_echelon' => $eligibility['echelon']['next'],
        ];
    }
}
