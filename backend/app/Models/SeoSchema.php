<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeoSchema extends Model
{
    use HasFactory;

    protected $table = 'seo_schemas';

    protected $fillable = [
        'name',
        'schema_type',
        'json_data',
        'page_seo_id',
        'metable_type',
        'metable_id',
        'is_global',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'json_data' => 'array',
        'is_global' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * All supported schema types.
     */
    public const SCHEMA_TYPES = [
        'Organization',
        'Website',
        'Article',
        'BlogPosting',
        'Product',
        'FAQ',
        'HowTo',
        'Breadcrumb',
        'LocalBusiness',
        'Person',
        'VideoObject',
        'Event',
        'SoftwareApplication',
        'SearchAction',
    ];

    // ── Relationships ───────────────────────────────────────

    public function pageSeo()
    {
        return $this->belongsTo(PageSeo::class, 'page_seo_id');
    }

    public function metable()
    {
        return $this->morphTo();
    }

    // ── Scopes ──────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeGlobal($query)
    {
        return $query->where('is_global', true);
    }

    public function scopeForPage($query, int $pageSeoId)
    {
        return $query->where('page_seo_id', $pageSeoId);
    }

    public function scopeForModel($query, string $type, int $id)
    {
        return $query->where('metable_type', $type)->where('metable_id', $id);
    }

    // ── Helpers ─────────────────────────────────────────────

    /**
     * Get the full JSON-LD with @context wrapper.
     */
    public function toJsonLd(): array
    {
        $data = $this->json_data ?? [];
        if (!isset($data['@context'])) {
            $data['@context'] = 'https://schema.org';
        }
        if (!isset($data['@type'])) {
            $data['@type'] = $this->schema_type;
        }
        return $data;
    }
}
