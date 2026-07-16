<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeoMeta extends Model
{
    use HasFactory;

    protected $table = 'geo_meta';

    protected $fillable = [
        'page_seo_id',
        'metable_type',
        'metable_id',
        'author_bio',
        'references',
        'sources',
        'publication_date',
        'last_updated',
        'reading_time',
        'entity_keywords',
        'structured_headings',
        'content_score',
        'ai_readability_score',
        'generative_search_score',
        'eeat_score',
        'internal_linking_suggestions',
    ];

    protected $casts = [
        'references' => 'array',
        'sources' => 'array',
        'entity_keywords' => 'array',
        'structured_headings' => 'array',
        'internal_linking_suggestions' => 'array',
        'reading_time' => 'integer',
        'content_score' => 'integer',
        'ai_readability_score' => 'integer',
        'generative_search_score' => 'integer',
        'eeat_score' => 'integer',
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

    public function scopeForPage($query, int $pageSeoId)
    {
        return $query->where('page_seo_id', $pageSeoId);
    }

    public function scopeForModel($query, string $type, int $id)
    {
        return $query->where('metable_type', $type)->where('metable_id', $id);
    }
}
