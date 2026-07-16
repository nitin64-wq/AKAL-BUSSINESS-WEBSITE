<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Placement extends Model
{
    use HasFactory, Auditable;

    protected $fillable = [
        'company_name',
        'company_logo',
        'role_offered',
        'package_lpa',
        'year',
        'placement_type',
        'is_featured',
        'sort_order',
    ];

    protected $casts = [
        'package_lpa' => 'decimal:2',
        'year' => 'integer',
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
    ];

    // Scopes
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByYear($query, int $year)
    {
        return $query->where('year', $year);
    }
}
