<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Authed globally or public submit
    }

    public function rules()
    {
        return [
            'program_id' => 'required|exists:programs,id',
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:Male,Female,Other,Prefer not to say',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|max:10',
            'last_qualification' => 'required|string|max:255',
            'marks_percentage' => 'required|numeric|min:0|max:100',
            'entrance_exam' => 'nullable|string|max:100',
            'entrance_score' => 'nullable|string|max:100',
            'work_experience' => 'nullable|integer|min:0',
            'category' => 'required|in:General,SC,ST,OBC,EWS,PWD',
        ];
    }
}
