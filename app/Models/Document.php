<?php

namespace App\Models;

use App\Enums\DocumentCategoryEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'professeur_id',
        'original_name',
        'display_name',
        'stored_name',
        'file_path',
        'category',
        'file_type',
        'mime_type',
        'file_size',
        'uploaded_by',
    ];

    protected function casts(): array
    {
        return [
            'category' => DocumentCategoryEnum::class,
            'file_size' => 'integer',
        ];
    }

    public function professeur()
    {
        return $this->belongsTo(Professeur::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
