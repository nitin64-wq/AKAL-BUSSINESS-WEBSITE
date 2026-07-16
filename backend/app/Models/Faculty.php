<?php

namespace App\Models;

use App\Traits\Auditable;
use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory, HasSlug, Auditable;

    protected $table = 'faculty'; // Override because plural of faculty is faculties, but we named it faculty

    protected $fillable = [
        'name',
        'slug',
        'designation',
        'department',
        'specialization',
        'qualification',
        'experience_years',
        'bio',
        'photo',
        'email',
        'linkedin_url',
        'google_scholar',
        'publications',
        'is_distinguished',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'experience_years' => 'integer',
        'publications' => 'integer',
        'is_distinguished' => 'boolean',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeDistinguished($query)
    {
        return $query->where('is_distinguished', true);
    }

    public function scopeByDepartment($query, string $department)
    {
        return $query->where('department', $department);
    }

    // HasSlug source field
    public function slugSource(): string
    {
        return 'name';
    }
}
