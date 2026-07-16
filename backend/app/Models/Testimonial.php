<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory, Auditable;

    protected $fillable = [
        'name',
        'designation',
        'company',
        'photo',
        'quote',
        'rating',
        'batch_year',
        'is_featured',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'rating' => 'integer',
        'batch_year' => 'integer',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
