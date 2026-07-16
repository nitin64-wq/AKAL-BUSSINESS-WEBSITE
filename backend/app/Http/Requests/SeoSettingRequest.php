<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SeoSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Auth handled by middleware
    }

    public function rules(): array
    {
        return [
            'settings' => 'required|array',
            'settings.*' => 'nullable|string|max:10000',
            // File uploads for logos/images
            'website_logo_file' => 'nullable|image|mimes:png,jpg,jpeg,svg,webp|max:3072',
            'favicon_file' => 'nullable|image|mimes:png,ico,svg|max:1024',
            'organization_logo_file' => 'nullable|image|mimes:png,jpg,jpeg,svg,webp|max:3072',
            'default_og_image_file' => 'nullable|image|mimes:png,jpg,jpeg,webp|max:3072',
        ];
    }
}
