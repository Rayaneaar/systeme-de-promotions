<?php

namespace App\Http\Requests\Promotion;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePromotionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'professeur_id' => ['required', 'integer', 'exists:professeurs,id'],
            'type' => ['required', Rule::in(['grade', 'echelon'])],
            'notes' => ['nullable', 'string', 'max:1500'],
        ];
    }
}
