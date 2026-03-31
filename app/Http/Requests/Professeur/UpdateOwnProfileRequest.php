<?php

namespace App\Http\Requests\Professeur;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOwnProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $professeur = $this->user()?->professeur;
        $professeurId = $professeur?->id;
        $userId = $professeur?->user_id;

        return [
            'num_dr' => ['sometimes', 'required', 'string', 'max:30', Rule::unique('professeurs', 'num_dr')->ignore($professeurId)],
            'first_name' => ['sometimes', 'required', 'string', 'max:255'],
            'last_name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'cin' => ['sometimes', 'nullable', 'string', 'max:20', Rule::unique('professeurs', 'cin')->ignore($professeurId)],
            'ppr' => ['sometimes', 'nullable', 'string', 'max:20', Rule::unique('professeurs', 'ppr')->ignore($professeurId)],
            'date_of_birth' => ['sometimes', 'nullable', 'date', 'before:today'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'address' => ['sometimes', 'nullable', 'string'],
            'specialite' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
