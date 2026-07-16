<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory, \App\Traits\Auditable;

    protected $fillable = [
        'text',
        'type',
        'link',
        'is_active',
        'show_as_card',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'show_as_card' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
