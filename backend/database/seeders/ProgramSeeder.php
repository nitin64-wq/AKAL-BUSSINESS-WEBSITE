<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    public function run()
    {
        // 1. MBA in Business Analytics
        Program::create([
            'title' => 'MBA in Business Analytics',
            'type' => 'MBA',
            'duration' => '2 Years (4 Semesters)',
            'description' => 'A premier flagship program designed to bridge the gap between business management and advanced analytical technologies. Features a 1+1 study abroad option with foreign university MoUs.',
            'highlights' => [
                'Hands-on training in Python, SQL, and data visualization tools',
                'Advanced Data Visualization with Power BI and Tableau',
                'Statistical modeling and forecasting techniques',
                'Real-world business applications of Machine Learning and Analytics',
                'Paid corporate internships with leading data intelligence firms',
                'MoUs with foreign universities (like UNCG) for global exchange programs'
            ],
            'eligibility' => 'Bachelor\'s degree in any discipline from a recognized university with minimum 50% marks (45% for SC/ST candidates) and a valid management entrance score (CAT/MAT/CMAT/GMAT).',
            'fee_per_year' => 100000.00, // ₹50,000 per semester
            'seats' => 60,
            'cover_image' => '/storage/programs/about_img.png',
            'brochure_url' => '/downloads/brochures/mba-analytics-2026.pdf',
            'is_active' => true,
            'sort_order' => 1,
            'meta_title' => 'MBA in Business Analytics Program | Akal Business School',
            'meta_description' => 'Join the MBA in Business Analytics at ABS. Master Power BI, Tableau, Python, SQL, and Machine Learning. Admissions open for session 2026-2028.',
        ]);

        // 2. Bachelor of Business Administration (BBA)
        Program::create([
            'title' => 'Bachelor of Business Administration (BBA)',
            'type' => 'BBA',
            'duration' => '3 Years (6 Semesters)',
            'description' => 'A comprehensive undergraduate program that integrates core business administration concepts with management principles. Prepares students for early careers in business intelligence, marketing intelligence, and corporate strategy.',
            'highlights' => [
                'Foundation in economics, accounting, and organizational behavior',
                'Hands-on database management and business reporting',
                'Introduction to analytical tools and digital dashboard models',
                'Soft-skills development and public speaking training',
                'Comprehensive internships and placement training modules'
            ],
            'eligibility' => '10+2 from a recognized educational board in any stream with a minimum of 50% aggregate marks (45% for SC/ST candidates).',
            'fee_per_year' => 60000.00,
            'seats' => 60,
            'cover_image' => '/storage/programs/webpage-auts-aboutus-3jun23.png',
            'brochure_url' => '/downloads/brochures/bba-brochure.pdf',
            'is_active' => true,
            'sort_order' => 2,
            'meta_title' => 'Bachelor of Business Administration (BBA) | Akal Business School',
            'meta_description' => 'Admissions open for BBA. 3-year professional undergraduate course blending core business concepts with management principles.',
        ]);
    }
}
