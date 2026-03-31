<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProfesseurController;
use App\Http\Controllers\Api\PromotionController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    Route::prefix('dashboard')->group(function () {
        Route::get('/teacher', [DashboardController::class, 'teacher']);
        Route::middleware('role:admin')->get('/admin', [DashboardController::class, 'admin']);
    });

    Route::prefix('me')->group(function () {
        Route::get('/profile', [ProfesseurController::class, 'me']);
        Route::patch('/profile', [ProfesseurController::class, 'updateMyProfile']);
        Route::get('/eligibility', [ProfesseurController::class, 'myEligibility']);
        Route::get('/documents', [DocumentController::class, 'myDocuments']);
        Route::post('/documents', [DocumentController::class, 'uploadMyDocument']);
        Route::get('/promotions', [PromotionController::class, 'index']);
        Route::post('/promotions/request', [PromotionController::class, 'submitMyRequest']);
    });

    Route::get('/documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');
    Route::patch('/documents/{document}/rename', [DocumentController::class, 'rename']);
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::patch('/notifications/{notificationLog}/read', [NotificationController::class, 'markAsRead']);

    Route::middleware('role:admin')->group(function () {
        Route::apiResource('professeurs', ProfesseurController::class);
        Route::get('/professeurs/{professeur}/eligibility', [ProfesseurController::class, 'eligibility']);
        Route::get('/professeurs/{professeur}/documents', [DocumentController::class, 'listForProfesseur']);
        Route::post('/professeurs/{professeur}/documents', [DocumentController::class, 'uploadForProfesseur']);
        Route::delete('/professeurs/{professeur}/documents', [DocumentController::class, 'destroyAllForProfesseur']);

        Route::get('/documents', [DocumentController::class, 'index']);

        Route::apiResource('promotions', PromotionController::class);
        Route::post('/promotions/{promotion}/approve', [PromotionController::class, 'approve']);
        Route::post('/promotions/{promotion}/reject', [PromotionController::class, 'reject']);
    });
});
