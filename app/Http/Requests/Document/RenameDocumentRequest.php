<?php

namespace App\Http\Requests\Document;

use Illuminate\Foundation\Http\FormRequest;

class RenameDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'display_name' => ['required', 'string', 'max:255'],
        ];
    }
}
