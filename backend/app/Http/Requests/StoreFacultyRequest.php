<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFacultyRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Authorized via policy
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'qualification' => 'nullable|string|max:255',
            'experience_years' => 'nullable|integer|min:0',
            'bio' => 'nullable|string|max:2000',
            'photo_file' => 'nullable|image|max:2048', // 2MB max
            'email' => 'nullable|email|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'google_scholar' => 'nullable|url|max:255',
            'publications' => 'nullable|integer|min:0',
            'is_distinguished' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ];
    }
}
