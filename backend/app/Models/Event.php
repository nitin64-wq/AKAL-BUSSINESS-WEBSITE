<?php

namespace App\Models;

use App\Traits\Auditable;
use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory, HasSlug, Auditable;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'event_date',
        'event_time',
        'venue',
        'cover_image',
        'registration_url',
        'is_upcoming',
        'is_featured',
        'is_published',
    ];

    protected $casts = [
        'event_date' => 'date',
        'is_upcoming' => 'boolean',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('is_upcoming', true)->where('event_date', '>=', now()->toDateString());
    }

    // HasSlug source field
    public function slugSource(): string
    {
        return 'title';
    }
}
