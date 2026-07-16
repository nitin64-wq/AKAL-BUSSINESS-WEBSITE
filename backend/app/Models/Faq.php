<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    use HasFactory;

    protected $table = 'faqs';

    protected $fillable = [
        'page_seo_id',
        'faqable_type',
        'faqable_id',
        'question',
        'answer',
        'short_summary',
        'ai_summary',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    // ── Relationships ───────────────────────────────────────

    public function pageSeo()
    {
        return $this->belongsTo(PageSeo::class, 'page_seo_id');
    }

    public function faqable()
    {
        return $this->morphTo();
    }

    // ── Scopes ──────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForPage($query, int $pageSeoId)
    {
        return $query->where('page_seo_id', $pageSeoId);
    }

    public function scopeForModel($query, string $type, int $id)
    {
        return $query->where('faqable_type', $type)->where('faqable_id', $id);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    // ── Helpers ─────────────────────────────────────────────

    /**
     * Generate FAQ Schema JSON-LD for a collection of FAQs.
     */
    public static function toFaqSchema($faqs): array
    {
        $items = [];
        foreach ($faqs as $faq) {
            $items[] = [
                '@type' => 'Question',
                'name' => $faq->question,
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => strip_tags($faq->answer),
                ],
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => $items,
        ];
    }
}
