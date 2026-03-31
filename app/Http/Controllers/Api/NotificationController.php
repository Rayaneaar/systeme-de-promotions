<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationLogResource;
use App\Models\NotificationLog;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->integer('limit', 8);
        $notifications = $request->user()
            ->notificationLogs()
            ->with('promotion.professeur')
            ->latest()
            ->limit($limit)
            ->get();

        return ApiResponse::success([
            'items' => NotificationLogResource::collection($notifications)->resolve(),
            'unread_count' => $request->user()->notificationLogs()->where('is_read', false)->count(),
        ], 'Notifications recuperees.');
    }

    public function markAsRead(Request $request, NotificationLog $notificationLog)
    {
        abort_unless($notificationLog->user_id === $request->user()->id, 403, 'Acces refuse.');

        if (! $notificationLog->is_read) {
            $notificationLog->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        }

        return ApiResponse::success(
            new NotificationLogResource($notificationLog->fresh()->load('promotion.professeur')),
            'Notification marquee comme lue.'
        );
    }

    public function markAllAsRead(Request $request)
    {
        $updated = $request->user()
            ->notificationLogs()
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return ApiResponse::success(['updated_count' => $updated], 'Toutes les notifications ont ete marquees comme lues.');
    }
}
