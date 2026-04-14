<?php

namespace App\Services;

use App\Enums\NotificationTypeEnum;
use App\Enums\PromotionTypeEnum;
use App\Models\NotificationLog;
use App\Models\Professeur;
use App\Models\Promotion;
use App\Models\User;
use App\Support\PromotionReferenceHelper;

class NotificationService
{
    public function createPromotionSubmittedNotification(Promotion $promotion): void
    {
        $promotion->loadMissing('professeur.user');
        $teacher = $promotion->professeur?->user;

        User::query()
            ->where('role', 'admin')
            ->get()
            ->each(function (User $admin) use ($promotion, $teacher): void {
                NotificationLog::create([
                    'user_id' => $admin->id,
                    'promotion_id' => $promotion->id,
                    'type' => NotificationTypeEnum::PROMOTION_SUBMITTED,
                    'title' => 'Nouvelle demande de promotion',
                    'message' => $teacher
                        ? "{$teacher->name} a soumis une nouvelle demande de promotion."
                        : 'Une nouvelle demande de promotion a ete soumise.',
                    'data' => [
                        ...$this->buildPayload($promotion),
                        'teacher_name' => $teacher?->name,
                        'teacher_email' => $teacher?->email,
                    ],
                ]);
            });
    }

    public function createPromotionApprovedNotification(Promotion $promotion): ?NotificationLog
    {
        $promotion->loadMissing('professeur.user');
        $teacher = $promotion->professeur?->user;

        if (! $teacher) {
            return null;
        }

        return NotificationLog::create([
            'user_id' => $teacher->id,
            'promotion_id' => $promotion->id,
            'type' => NotificationTypeEnum::PROMOTION_APPROVED,
            'title' => 'Promotion approuvee',
            'message' => $this->buildApprovedMessage($promotion),
            'data' => $this->buildPayload($promotion),
        ]);
    }

    public function createPromotionRejectedNotification(Promotion $promotion): ?NotificationLog
    {
        $promotion->loadMissing('professeur.user');
        $teacher = $promotion->professeur?->user;

        if (! $teacher) {
            return null;
        }

        return NotificationLog::create([
            'user_id' => $teacher->id,
            'promotion_id' => $promotion->id,
            'type' => NotificationTypeEnum::PROMOTION_REJECTED,
            'title' => 'Promotion rejetee',
            'message' => $this->buildRejectedMessage($promotion),
            'data' => $this->buildPayload($promotion),
        ]);
    }

    public function createAdminMessageNotification(Professeur $professeur, string $subject, string $message): ?NotificationLog
    {
        $professeur->loadMissing('user');
        $teacher = $professeur->user;

        if (! $teacher) {
            return null;
        }

        return NotificationLog::create([
            'user_id' => $teacher->id,
            'type' => NotificationTypeEnum::ADMIN_MESSAGE,
            'title' => $subject,
            'message' => $message,
            'data' => [
                'teacher_id' => $professeur->id,
                'teacher_name' => $professeur->full_name,
            ],
        ]);
    }

    protected function buildApprovedMessage(Promotion $promotion): string
    {
        $referenceNumber = PromotionReferenceHelper::resolve($promotion->new_grade, $promotion->new_echelon);
        $referenceSuffix = $referenceNumber ? " Numero de reference : {$referenceNumber}." : '';

        if ($promotion->type === PromotionTypeEnum::GRADE) {
            return "Votre demande de promotion de grade vers le grade {$promotion->new_grade} a ete approuvee.{$referenceSuffix}";
        }

        return "Votre demande de promotion d'echelon vers l'echelon {$promotion->new_echelon} a ete approuvee.{$referenceSuffix}";
    }

    protected function buildRejectedMessage(Promotion $promotion): string
    {
        $suffix = $promotion->rejection_reason
            ? " Motif : {$promotion->rejection_reason}"
            : '';

        if ($promotion->type === PromotionTypeEnum::GRADE) {
            return "Votre demande de promotion de grade vers le grade {$promotion->new_grade} a ete rejetee.{$suffix}";
        }

        return "Votre demande de promotion d'echelon vers l'echelon {$promotion->new_echelon} a ete rejetee.{$suffix}";
    }

    protected function buildPayload(Promotion $promotion): array
    {
        return [
            'status' => $promotion->status?->value,
            'type' => $promotion->type?->value,
            'old_grade' => $promotion->old_grade,
            'new_grade' => $promotion->new_grade,
            'old_echelon' => $promotion->old_echelon,
            'new_echelon' => $promotion->new_echelon,
            'old_reference_number' => PromotionReferenceHelper::resolve($promotion->old_grade, $promotion->old_echelon),
            'new_reference_number' => PromotionReferenceHelper::resolve($promotion->new_grade, $promotion->new_echelon),
            'effective_date' => $promotion->effective_date?->toDateString(),
        ];
    }

    public function createTeacherReportNotification(
        Professeur $professeur,
        string $subject,
        string $message,
        ?Promotion $promotion = null
    ): void {
        $professeur->loadMissing('user');

        User::query()
            ->where('role', 'admin')
            ->get()
            ->each(function (User $admin) use ($professeur, $subject, $message, $promotion): void {
                NotificationLog::create([
                    'user_id' => $admin->id,
                    'promotion_id' => $promotion?->id,
                    'type' => NotificationTypeEnum::TEACHER_REPORT,
                    'title' => $subject,
                    'message' => $message,
                    'data' => [
                        'teacher_id' => $professeur->id,
                        'teacher_name' => $professeur->full_name,
                        'teacher_email' => $professeur->user?->email,
                        'promotion_id' => $promotion?->id,
                        'promotion_type' => $promotion?->type?->value,
                    ],
                ]);
            });
    }
}
