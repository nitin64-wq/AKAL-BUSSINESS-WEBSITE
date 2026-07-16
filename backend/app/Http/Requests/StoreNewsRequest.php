<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNewsRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Controlled by Policy
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:1000',
            'body' => 'required|string|max:20000',
            'cover_image_file' => 'nullable|image|max:2048', // 2MB
            'category' => 'required|in:Industry Talk,International Conference,Placement Drive,Scholarship,Research,Campus News',
            'is_featured' => 'nullable|boolean',
            'is_published' => 'nullable|boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ];
    }
}
