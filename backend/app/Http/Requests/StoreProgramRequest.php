<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProgramRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Controlled by Policy
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'type' => 'required|in:MBA,BBA,IMP,Executive,Doctoral,Certificate',
            'duration' => 'required|string|max:100',
            'description' => 'required|string|max:5000',
            'highlights' => 'required|array',
            'highlights.*' => 'required|string|max:255',
            'eligibility' => 'nullable|string|max:1000',
            'fee_per_year' => 'nullable|numeric|min:0',
            'seats' => 'nullable|integer|min:1',
            'cover_image_file' => 'nullable|image|max:2048', // 2MB
            'brochure_file' => 'nullable|file|mimes:pdf|max:10240', // 10MB
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ];
    }
}
