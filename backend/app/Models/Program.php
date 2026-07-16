<?php

namespace App\Models;

use App\Traits\Auditable;
use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory, HasSlug, Auditable;

    protected $fillable = [
        'title',
        'slug',
        'type',
        'duration',
        'description',
        'highlights',
        'eligibility',
        'fee_per_year',
        'seats',
        'cover_image',
        'brochure_url',
        'is_active',
        'sort_order',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'highlights' => 'array',
        'fee_per_year' => 'decimal:2',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'seats' => 'integer',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    // Relationships
    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    // HasSlug source field
    public function slugSource(): string
    {
        return 'title';
    }
}
