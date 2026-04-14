<?php

namespace App\Http\Requests\Professeur;

use Illuminate\Foundation\Http\FormRequest;

class SendTeacherMailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ];
    }
}
