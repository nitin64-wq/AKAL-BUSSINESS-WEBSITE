<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PageSeoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'page_identifier' => 'required|string|max:100|unique:page_seo,page_identifier,' . $id,
            'page_title' => 'nullable|string|max:255',
            'seo_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:500',
            'slug' => 'nullable|string|max:255|unique:page_seo,slug,' . $id,
            'canonical_url' => 'nullable|string|max:500',
            'meta_robots' => 'nullable|string|max:100',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string|max:500',
            'og_image' => 'nullable|string|max:500',
            'og_type' => 'nullable|string|max:50',
            'twitter_title' => 'nullable|string|max:255',
            'twitter_description' => 'nullable|string|max:500',
            'twitter_image' => 'nullable|string|max:500',
            'twitter_card' => 'nullable|string|max:50',
            'focus_keyword' => 'nullable|string|max:100',
            'schema_type' => 'nullable|string|max:50',
            'custom_schema_json' => 'nullable|json',
            'publish_date' => 'nullable|date',
            'updated_date' => 'nullable|date',
            'author' => 'nullable|string|max:255',
            'breadcrumb_title' => 'nullable|string|max:255',
            'short_summary' => 'nullable|string|max:1000',
            'ai_summary' => 'nullable|string|max:2000',
            'quick_answer' => 'nullable|string|max:1000',
            'featured_snippet' => 'nullable|string|max:2000',
            'content_score' => 'nullable|integer|min:0|max:100',
            'eeat_score' => 'nullable|integer|min:0|max:100',
            'ai_readability_score' => 'nullable|integer|min:0|max:100',
            'is_active' => 'nullable|boolean',
        ];
    }
}
