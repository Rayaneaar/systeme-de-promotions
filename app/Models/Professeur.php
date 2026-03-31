<?php

namespace App\Models;

use App\Enums\GradeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Professeur extends Model
{
    use HasFactory;

    protected $table = 'professeurs';

    protected $fillable = [
        'user_id',
        'num_dr',
        'cin',
        'ppr',
        'first_name',
        'last_name',
        'date_of_birth',
        'phone',
        'address',
        'specialite',
        'grade',
        'echelon',
        'date_recrutement',
        'date_last_promotion',
        'date_last_grade_promotion',
        'date_last_echelon_promotion',
        'anciennete_cache',
    ];

    protected $appends = ['full_name'];

    protected function casts(): array
    {
        return [
            'grade' => GradeEnum::class,
            'date_of_birth' => 'date',
            'date_recrutement' => 'date',
            'date_last_promotion' => 'date',
            'date_last_grade_promotion' => 'date',
            'date_last_echelon_promotion' => 'date',
            'echelon' => 'integer',
            'anciennete_cache' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function promotions()
    {
        return $this->hasMany(Promotion::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function getFullNameAttribute(): string
    {
        return trim($this->first_name.' '.$this->last_name);
    }
}
