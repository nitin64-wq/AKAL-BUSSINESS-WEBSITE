<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run()
    {
        // General Group
        Setting::create([
            'key' => 'contact_email',
            'value' => 'director_abs@auts.ac.in',
            'type' => 'text',
            'group' => 'general',
            'label' => 'Director Contact Email',
        ]);

        Setting::create([
            'key' => 'contact_phone',
            'value' => '+91-175-2391234',
            'type' => 'text',
            'group' => 'general',
            'label' => 'Admissions Desk Phone',
        ]);

        Setting::create([
            'key' => 'current_session',
            'value' => '2026-2028',
            'type' => 'text',
            'group' => 'general',
            'label' => 'Active Admission Session',
        ]);

        Setting::create([
            'key' => 'admissions_open',
            'value' => 'true',
            'type' => 'boolean',
            'group' => 'general',
            'label' => 'Admissions Banner Status',
        ]);

        // Stats Group
        Setting::create([
            'key' => 'placement_rate',
            'value' => '95',
            'type' => 'number',
            'group' => 'stats',
            'label' => 'Placement Success Rate (%)',
        ]);

        Setting::create([
            'key' => 'highest_package',
            'value' => '12.0',
            'type' => 'number',
            'group' => 'stats',
            'label' => 'Highest Package LPA (Lakhs Per Annum)',
        ]);

        Setting::create([
            'key' => 'average_package',
            'value' => '7.2',
            'type' => 'number',
            'group' => 'stats',
            'label' => 'Average Package LPA (Lakhs Per Annum)',
        ]);

        Setting::create([
            'key' => 'alumni_count',
            'value' => '5000',
            'type' => 'number',
            'group' => 'stats',
            'label' => 'Total Alumni Count',
        ]);

        Setting::create([
            'key' => 'corporate_recruiters',
            'value' => '150',
            'type' => 'number',
            'group' => 'stats',
            'label' => 'Corporate Recruiters',
        ]);

        Setting::create([
            'key' => 'international_partners',
            'value' => '20',
            'type' => 'number',
            'group' => 'stats',
            'label' => 'International Partners / Collaborations',
        ]);

        Setting::create([
            'key' => 'faculty_count',
            'value' => '50',
            'type' => 'number',
            'group' => 'stats',
            'label' => 'Total Faculty Count',
        ]);
        
        Setting::create([
            'key' => 'google_form_link',
            'value' => 'https://forms.gle/VjWqKM1j4cMrG2kt8',
            'type' => 'text',
            'group' => 'general',
            'label' => 'Admissions Google Form URL',
        ]);

        Setting::create([
            'key' => 'marquee_text',
            'value' => 'Registration open for MBA Business Analytics 2026-2028 batch',
            'type' => 'text',
            'group' => 'general',
            'label' => 'Top Marquee Announcement Text',
        ]);

        Setting::create([
            'key' => 'marquee_link',
            'value' => 'https://forms.gle/VjWqKM1j4cMrG2kt8',
            'type' => 'text',
            'group' => 'general',
            'label' => 'Top Marquee Announcement Link',
        ]);

        Setting::create([
            'key' => 'why_abs_image',
            'value' => '/images/campus/classroom.jpg',
            'type' => 'text',
            'group' => 'general',
            'label' => 'Why Choose ABS Section Image',
        ]);

        $visibilitySections = [
            'section_hero' => 'Hero Banner Carousel',
            'section_stats' => 'Statistics Bar',
            'section_announcements' => 'Announcements Section',
            'section_why_abs' => 'Why ABS Section',
            'section_programs' => 'Programs Section',
            'section_impact_numbers' => 'Impact Numbers (ABS by Numbers)',
            'section_global_learning' => 'Global Learning (MoUs)',
            'section_placements' => 'Placements Section (Recruiters Ticker)',
            'section_faculty' => 'Faculty Section',
            'section_scholarships' => 'Scholarships Section',
            'section_campus_life' => 'Vibrant Campus Life Grid',
            'section_testimonials' => 'Testimonials Section',
            'section_news' => 'News Section',
            'section_achievements' => 'Student Achievements Section',
        ];

        foreach ($visibilitySections as $key => $label) {
            Setting::create([
                'key' => $key,
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'visibility',
                'label' => $label,
            ]);
        }
    }
}
