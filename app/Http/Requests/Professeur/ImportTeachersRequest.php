<?php

namespace App\Http\Requests\Professeur;

use Illuminate\Foundation\Http\FormRequest;

class ImportTeachersRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimes:xlsx,csv,txt', 'max:10240'],
        ];
    }
}
