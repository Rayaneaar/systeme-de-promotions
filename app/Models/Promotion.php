<?php

namespace App\Models;

use App\Enums\PromotionStatusEnum;
use App\Enums\PromotionTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    protected $table = 'promotions';

    protected $fillable = [
        'professeur_id',
        'requested_by',
        'approved_by',
        'type',
        'old_grade',
        'new_grade',
        'old_echelon',
        'new_echelon',
        'status',
        'effective_date',
        'decided_at',
        'notes',
        'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'type' => PromotionTypeEnum::class,
            'status' => PromotionStatusEnum::class,
            'effective_date' => 'date',
            'decided_at' => 'datetime',
            'old_echelon' => 'integer',
            'new_echelon' => 'integer',
        ];
    }

    public function professeur()
    {
        return $this->belongsTo(Professeur::class);
    }

    public function requester()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function notificationLogs()
    {
        return $this->hasMany(NotificationLog::class);
    }
}
