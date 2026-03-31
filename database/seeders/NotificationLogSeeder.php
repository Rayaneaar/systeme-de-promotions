<?php

namespace Database\Seeders;

use App\Enums\NotificationTypeEnum;
use App\Enums\PromotionStatusEnum;
use App\Models\NotificationLog;
use App\Models\Promotion;
use Illuminate\Database\Seeder;

class NotificationLogSeeder extends Seeder
{
    public function run(): void
    {
        Promotion::query()
            ->with('professeur.user')
            ->whereIn('status', [PromotionStatusEnum::APPROVED, PromotionStatusEnum::REJECTED])
            ->get()
            ->each(function (Promotion $promotion) {
                $teacher = $promotion->professeur?->user;

                if (! $teacher) {
                    return;
                }

                NotificationLog::firstOrCreate(
                    [
                        'user_id' => $teacher->id,
                        'promotion_id' => $promotion->id,
                        'type' => $promotion->status === PromotionStatusEnum::APPROVED
                            ? NotificationTypeEnum::PROMOTION_APPROVED
                            : NotificationTypeEnum::PROMOTION_REJECTED,
                    ],
                    [
                        'title' => $promotion->status === PromotionStatusEnum::APPROVED
                            ? 'Promotion approuvee'
                            : 'Promotion rejetee',
                        'message' => $promotion->status === PromotionStatusEnum::APPROVED
                            ? "Une decision favorable a ete enregistree pour votre promotion {$promotion->type?->value}."
                            : "Une decision defavorable a ete enregistree pour votre promotion {$promotion->type?->value}.",
                        'data' => [
                            'status' => $promotion->status?->value,
                            'type' => $promotion->type?->value,
                        ],
                        'is_read' => false,
                    ]
                );
            });
    }
}
