<?php

namespace App\Services;

use App\Enums\NotificationTypeEnum;
use App\Enums\PromotionTypeEnum;
use App\Models\NotificationLog;
use App\Models\Promotion;

class NotificationService
{
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

    protected function buildApprovedMessage(Promotion $promotion): string
    {
        if ($promotion->type === PromotionTypeEnum::GRADE) {
            return "Votre demande de promotion de grade vers le grade {$promotion->new_grade} a ete approuvee.";
        }

        return "Votre demande de promotion d'echelon vers l'echelon {$promotion->new_echelon} a ete approuvee.";
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
            'effective_date' => $promotion->effective_date?->toDateString(),
        ];
    }
}
