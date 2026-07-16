<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scholarship extends Model
{
    use HasFactory, Auditable;

    protected $fillable = [
        'title',
        'type',
        'description',
        'eligibility',
        'amount_percent',
        'max_amount',
        'application_deadline',
        'icon',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'amount_percent' => 'integer',
        'max_amount' => 'decimal:2',
        'application_deadline' => 'date',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
