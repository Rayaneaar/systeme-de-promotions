<?php

namespace App\Http\Requests\Professeur;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProfesseurRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'num_dr' => ['required', 'string', 'max:30', 'unique:professeurs,num_dr'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['nullable', 'string', 'min:8'],
            'cin' => ['nullable', 'string', 'max:20', 'unique:professeurs,cin'],
            'ppr' => ['nullable', 'string', 'max:20', 'unique:professeurs,ppr'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
            'specialite' => ['nullable', 'string', 'max:255'],
            'grade' => ['required', Rule::in(['A', 'B', 'C'])],
            'echelon' => ['required', 'integer', 'min:1', 'max:4'],
            'date_recrutement' => ['required', 'date', 'before_or_equal:today'],
            'date_last_promotion' => ['nullable', 'date', 'before_or_equal:today'],
            'date_last_grade_promotion' => ['nullable', 'date', 'before_or_equal:today'],
            'date_last_echelon_promotion' => ['nullable', 'date', 'before_or_equal:today'],
        ];
    }
}
