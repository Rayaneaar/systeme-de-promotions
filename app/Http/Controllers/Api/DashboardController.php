<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DocumentResource;
use App\Http\Resources\NotificationLogResource;
use App\Http\Resources\ProfesseurResource;
use App\Http\Resources\PromotionResource;
use App\Services\DashboardService;
use App\Support\ApiResponse;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {
    }

    public function admin()
    {
        $data = $this->dashboardService->admin();

        return ApiResponse::success([
            'stats' => $data['stats'],
            'recent_promotions' => PromotionResource::collection($data['recent_promotions'])->resolve(),
            'recent_documents' => DocumentResource::collection($data['recent_documents'])->resolve(),
            'recent_reports' => NotificationLogResource::collection($data['recent_reports'])->resolve(),
        ], 'Tableau de bord administrateur recupere.');
    }

    public function teacher()
    {
        $data = $this->dashboardService->teacher(auth()->user());

        return ApiResponse::success([
            'profile' => new ProfesseurResource($data['profile']),
            'eligibility' => $data['eligibility'],
            'stats' => $data['stats'],
            'next_promotion' => $data['next_promotion'],
            'folder_statuses' => $data['folder_statuses'],
            'recent_promotions' => PromotionResource::collection($data['recent_promotions'])->resolve(),
            'recent_documents' => DocumentResource::collection($data['recent_documents'])->resolve(),
        ], 'Tableau de bord enseignant recupere.');
    }
}
