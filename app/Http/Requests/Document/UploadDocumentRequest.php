<?php

namespace App\Http\Requests\Document;

use App\Enums\DocumentCategoryEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UploadDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'max:10240'],
            'display_name' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', Rule::in(array_map(fn (DocumentCategoryEnum $category) => $category->value, DocumentCategoryEnum::cases()))],
        ];
    }
}
