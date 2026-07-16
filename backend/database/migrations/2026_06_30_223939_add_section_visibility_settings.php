<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Setting;

return new class extends Migration
{
    public function up(): void
    {
        $settings = [
            [
                'key' => 'section_hero',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'visibility',
                'label' => 'Hero Banner Carousel',
            ],
            [
                'key' => 'section_stats',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'visibility',
                'label' => 'Statistics Bar',
            ],
            [
                'key' => 'section_announcements',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'visibility',
                'label' => 'Announcements Section',
            ],
            [
                'key' => 'section_why_abs',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'visibility',
                'label' => 'Why ABS Section',
            ],
            [
                'key' => 'section_programs',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'visibility',
                'label' => 'Programs Section',
            ],
            [
                'key' => 'section_impact_numbers',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'visibility',
                'label' => 'Impact Numbers (ABS by Numbers)',
            ],
            [
                'key' => 'section_global_learning',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'visibility',
                'label' => 'Global Learning (MoUs)',
            ],
            [
                'key' => 'section_placements',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'visibility',
                'label' => 'Placements Section (Recruiters Ticker)',
            ],
            [
                'key' => 'section_faculty',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'visibility',
                'label' => 'Faculty Section',
            ],
            [
                'key' => 'section_scholarships',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'visibility',
                'label' => 'Scholarships Section',
            ],
            [
                'key' => 'section_campus_life',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'visibility',
                'label' => 'Vibrant Campus Life Grid',
            ],
            [
                'key' => 'section_testimonials',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'visibility',
                'label' => 'Testimonials Section',
            ],
            [
                'key' => 'section_news',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'visibility',
                'label' => 'News Section',
            ],
            [
                'key' => 'section_achievements',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'visibility',
                'label' => 'Student Achievements Section',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }

    public function down(): void
    {
        $keys = [
            'section_hero',
            'section_stats',
            'section_announcements',
            'section_why_abs',
            'section_programs',
            'section_impact_numbers',
            'section_global_learning',
            'section_placements',
            'section_faculty',
            'section_scholarships',
            'section_campus_life',
            'section_testimonials',
            'section_news',
            'section_achievements',
        ];

        Setting::whereIn('key', $keys)->delete();
    }
};
