<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageSeo extends Model
{
    use HasFactory;

    protected $table = 'page_seo';

    protected $fillable = [
        'page_identifier',
        'page_title',
        'seo_title',
        'meta_description',
        'meta_keywords',
        'slug',
        'canonical_url',
        'meta_robots',
        'og_title',
        'og_description',
        'og_image',
        'og_type',
        'twitter_title',
        'twitter_description',
        'twitter_image',
        'twitter_card',
        'focus_keyword',
        'schema_type',
        'custom_schema_json',
        'publish_date',
        'updated_date',
        'author',
        'breadcrumb_title',
        'short_summary',
        'ai_summary',
        'quick_answer',
        'featured_snippet',
        'content_score',
        'eeat_score',
        'ai_readability_score',
        'is_active',
    ];

    protected $casts = [
        'custom_schema_json' => 'array',
        'is_active' => 'boolean',
        'publish_date' => 'datetime',
        'updated_date' => 'datetime',
        'content_score' => 'integer',
        'eeat_score' => 'integer',
        'ai_readability_score' => 'integer',
    ];

    // ── Relationships ───────────────────────────────────────

    public function schemas()
    {
        return $this->hasMany(SeoSchema::class, 'page_seo_id');
    }

    public function faqs()
    {
        return $this->hasMany(Faq::class, 'page_seo_id')->orderBy('sort_order');
    }

    public function geoMeta()
    {
        return $this->hasOne(GeoMeta::class, 'page_seo_id');
    }

    // ── Scopes ──────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByIdentifier($query, string $identifier)
    {
        return $query->where('page_identifier', $identifier);
    }
}
