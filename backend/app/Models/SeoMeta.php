<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeoMeta extends Model
{
    use HasFactory;

    protected $table = 'seo_meta';

    protected $fillable = [
        'metable_type',
        'metable_id',
        'seo_title',
        'meta_description',
        'meta_keywords',
        'canonical_url',
        'meta_robots',
        'og_title',
        'og_description',
        'og_image',
        'twitter_title',
        'twitter_description',
        'twitter_image',
        'focus_keyword',
        'schema_type',
        'custom_schema_json',
        'short_summary',
        'ai_summary',
        'quick_answer',
        'featured_snippet',
        'excerpt',
        'reading_time',
        'content_score',
        'eeat_score',
        'ai_readability_score',
        'generative_search_score',
    ];

    protected $casts = [
        'custom_schema_json' => 'array',
        'reading_time' => 'integer',
        'content_score' => 'integer',
        'eeat_score' => 'integer',
        'ai_readability_score' => 'integer',
        'generative_search_score' => 'integer',
    ];

    // ── Relationships ───────────────────────────────────────

    /**
     * Polymorphic parent: News, Program, Event, Announcement, Faculty, etc.
     */
    public function metable()
    {
        return $this->morphTo();
    }

    /**
     * FAQs attached to this content item.
     */
    public function faqs()
    {
        return Faq::where('faqable_type', $this->metable_type)
            ->where('faqable_id', $this->metable_id)
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * GEO metadata attached to this content item.
     */
    public function geoMeta()
    {
        return GeoMeta::where('metable_type', $this->metable_type)
            ->where('metable_id', $this->metable_id)
            ->first();
    }

    /**
     * Schemas attached to this content item.
     */
    public function schemas()
    {
        return SeoSchema::where('metable_type', $this->metable_type)
            ->where('metable_id', $this->metable_id)
            ->where('is_active', true)
            ->get();
    }

    // ── Scopes ──────────────────────────────────────────────

    public function scopeForModel($query, string $type, int $id)
    {
        return $query->where('metable_type', $type)->where('metable_id', $id);
    }

    // ── Helpers ─────────────────────────────────────────────

    /**
     * Resolve the short model name from the full class path.
     * e.g. App\Models\News => news
     */
    public static function resolveModelType(string $shortType): string
    {
        $map = [
            'news'                  => 'App\\Models\\News',
            'program'               => 'App\\Models\\Program',
            'event'                 => 'App\\Models\\Event',
            'announcement'          => 'App\\Models\\Announcement',
            'faculty'               => 'App\\Models\\Faculty',
            'testimonial'           => 'App\\Models\\Testimonial',
            'placement'             => 'App\\Models\\Placement',
            'scholarship'           => 'App\\Models\\Scholarship',
            'gallery'               => 'App\\Models\\Gallery',
            'hero_slide'            => 'App\\Models\\HeroSlide',
            'student_achievement'   => 'App\\Models\\StudentAchievement',
            'partner_university'    => 'App\\Models\\PartnerUniversity',
            'download'              => 'App\\Models\\Download',
        ];

        return $map[strtolower($shortType)] ?? $shortType;
    }

    /**
     * Get the short type name from a full class path.
     */
    public static function shortModelType(string $fullType): string
    {
        $map = [
            'App\\Models\\News'                 => 'news',
            'App\\Models\\Program'              => 'program',
            'App\\Models\\Event'                => 'event',
            'App\\Models\\Announcement'         => 'announcement',
            'App\\Models\\Faculty'              => 'faculty',
            'App\\Models\\Testimonial'          => 'testimonial',
            'App\\Models\\Placement'            => 'placement',
            'App\\Models\\Scholarship'          => 'scholarship',
            'App\\Models\\Gallery'              => 'gallery',
            'App\\Models\\HeroSlide'            => 'hero_slide',
            'App\\Models\\StudentAchievement'   => 'student_achievement',
            'App\\Models\\PartnerUniversity'    => 'partner_university',
            'App\\Models\\Download'             => 'download',
        ];

        return $map[$fullType] ?? $fullType;
    }

    /**
     * Get all supported content types as a list.
     */
    public static function supportedTypes(): array
    {
        return [
            ['key' => 'news', 'label' => 'News', 'model' => 'App\\Models\\News'],
            ['key' => 'program', 'label' => 'Programs', 'model' => 'App\\Models\\Program'],
            ['key' => 'event', 'label' => 'Events', 'model' => 'App\\Models\\Event'],
            ['key' => 'announcement', 'label' => 'Announcements', 'model' => 'App\\Models\\Announcement'],
            ['key' => 'faculty', 'label' => 'Faculty', 'model' => 'App\\Models\\Faculty'],
            ['key' => 'testimonial', 'label' => 'Testimonials', 'model' => 'App\\Models\\Testimonial'],
            ['key' => 'placement', 'label' => 'Placements', 'model' => 'App\\Models\\Placement'],
            ['key' => 'scholarship', 'label' => 'Scholarships', 'model' => 'App\\Models\\Scholarship'],
            ['key' => 'gallery', 'label' => 'Gallery', 'model' => 'App\\Models\\Gallery'],
            ['key' => 'hero_slide', 'label' => 'Hero Slides', 'model' => 'App\\Models\\HeroSlide'],
            ['key' => 'student_achievement', 'label' => 'Student Achievements', 'model' => 'App\\Models\\StudentAchievement'],
            ['key' => 'partner_university', 'label' => 'Partner Universities', 'model' => 'App\\Models\\PartnerUniversity'],
            ['key' => 'download', 'label' => 'Downloads', 'model' => 'App\\Models\\Download'],
        ];
    }
}
