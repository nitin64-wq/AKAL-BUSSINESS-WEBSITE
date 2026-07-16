<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SeoMetaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'metable_type' => 'required|string|max:100',
            'metable_id' => 'required|integer',
            'seo_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:500',
            'canonical_url' => 'nullable|string|max:500',
            'meta_robots' => 'nullable|string|max:100',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string|max:500',
            'og_image' => 'nullable|string|max:500',
            'twitter_title' => 'nullable|string|max:255',
            'twitter_description' => 'nullable|string|max:500',
            'twitter_image' => 'nullable|string|max:500',
            'focus_keyword' => 'nullable|string|max:100',
            'schema_type' => 'nullable|string|max:50',
            'custom_schema_json' => 'nullable|json',
            'short_summary' => 'nullable|string|max:1000',
            'ai_summary' => 'nullable|string|max:2000',
            'quick_answer' => 'nullable|string|max:1000',
            'featured_snippet' => 'nullable|string|max:2000',
            'excerpt' => 'nullable|string|max:1000',
            'reading_time' => 'nullable|integer|min:0',
            'content_score' => 'nullable|integer|min:0|max:100',
            'eeat_score' => 'nullable|integer|min:0|max:100',
            'ai_readability_score' => 'nullable|integer|min:0|max:100',
            'generative_search_score' => 'nullable|integer|min:0|max:100',
        ];
    }
}
