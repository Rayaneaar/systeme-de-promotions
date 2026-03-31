<?php

namespace App\Http\Requests\Promotion;

use Illuminate\Foundation\Http\FormRequest;

class ApprovePromotionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'effective_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:1500'],
        ];
    }
}
