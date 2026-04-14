<?php

namespace App\Services;

use App\Models\Document;
use App\Models\NotificationLog;
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
        return [
            'stats' => [
                'total_teachers' => Professeur::query()->count(),
                'pending_promotions' => Promotion::query()->where('status', 'pending')->count(),
                'processed_promotions' => Promotion::query()->whereIn('status', ['approved', 'rejected'])->count(),
                'total_documents' => Document::query()->count(),
                'teacher_reports' => NotificationLog::query()
                    ->where('type', 'teacher_report')
                    ->count(),
                'unread_notifications' => NotificationLog::query()
                    ->whereHas('user', fn ($query) => $query->where('role', 'admin'))
                    ->where('is_read', false)
                    ->count(),
            ],
            'recent_promotions' => Promotion::query()->latest()->with(['professeur', 'approver'])->limit(5)->get(),
            'recent_documents' => Document::query()->latest()->with(['professeur', 'uploader'])->limit(5)->get(),
            'recent_reports' => NotificationLog::query()
                ->where('type', 'teacher_report')
                ->with('promotion.professeur')
                ->latest()
                ->limit(6)
                ->get()
                ->unique(fn (NotificationLog $notification) => implode(':', [
                    $notification->title,
                    $notification->message,
                    data_get($notification->data, 'teacher_id'),
                    $notification->promotion_id,
                ]))
                ->values(),
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
                'pending_promotions' => $professeur->promotions->where('status', 'pending')->count(),
                'approved_promotions' => $professeur->promotions->where('status', 'approved')->count(),
                'rejected_promotions' => $professeur->promotions->where('status', 'rejected')->count(),
            ],
            'next_promotion' => $eligibility['next_promotion'],
            'folder_statuses' => [
                'submitted' => $professeur->promotions->count(),
                'processing' => $professeur->promotions->where('status', 'pending')->count(),
                'approved' => $professeur->promotions->where('status', 'approved')->count(),
                'rejected' => $professeur->promotions->where('status', 'rejected')->count(),
            ],
            'recent_documents' => $professeur->documents->sortByDesc('created_at')->take(5)->values(),
            'recent_promotions' => $professeur->promotions->sortByDesc('created_at')->take(5)->values(),
        ];
    }
}
