<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FaqRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'page_seo_id' => 'nullable|integer|exists:page_seo,id',
            'faqable_type' => 'nullable|string|max:100',
            'faqable_id' => 'nullable|integer',
            'question' => 'required|string|max:1000',
            'answer' => 'required|string|max:10000',
            'short_summary' => 'nullable|string|max:500',
            'ai_summary' => 'nullable|string|max:1000',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ];
    }
}
