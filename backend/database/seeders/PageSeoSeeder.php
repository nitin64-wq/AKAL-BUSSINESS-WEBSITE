<?php

namespace Database\Seeders;

use App\Models\PageSeo;
use Illuminate\Database\Seeder;

class PageSeoSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'page_identifier' => 'home',
                'page_title' => 'Home',
                'seo_title' => 'Akal Business School (ABS) | Premium Management Education',
                'meta_description' => 'Akal Business School (ABS) offers premium MBA, BBA, and PhD programs in Business Analytics, AI, and Management. Transform your future.',
                'meta_keywords' => 'MBA, BBA, PhD, Akal Business School, ABS, Management, Business Analytics',
                'slug' => '',
                'canonical_url' => 'https://business.auts.ac.in',
                'breadcrumb_title' => 'Home',
                'schema_type' => 'Website',
            ],
            [
                'page_identifier' => 'about',
                'page_title' => 'About Us',
                'seo_title' => 'About Akal Business School | Vision, Mission & Legacy',
                'meta_description' => 'Learn about Akal Business School\'s vision, mission, and legacy of excellence in management education.',
                'meta_keywords' => 'About ABS, Akal Business School History, Vision Mission',
                'slug' => 'about',
                'canonical_url' => 'https://business.auts.ac.in/about',
                'breadcrumb_title' => 'About',
                'schema_type' => 'Organization',
            ],
            [
                'page_identifier' => 'about/founders',
                'page_title' => 'Founders',
                'seo_title' => 'Founders | Akal Business School',
                'meta_description' => 'Meet the visionary founders behind Akal Business School.',
                'slug' => 'about/founders',
                'canonical_url' => 'https://business.auts.ac.in/about/founders',
                'breadcrumb_title' => 'Founders',
            ],
            [
                'page_identifier' => 'about/chancellors-message',
                'page_title' => "Chancellor's Message",
                'seo_title' => "Chancellor's Message | Akal Business School",
                'meta_description' => 'A message from the Chancellor of Akal University and Business School.',
                'slug' => 'about/chancellors-message',
                'canonical_url' => 'https://business.auts.ac.in/about/chancellors-message',
                'breadcrumb_title' => "Chancellor's Message",
            ],
            [
                'page_identifier' => 'about/directors-message',
                'page_title' => "Director's Message",
                'seo_title' => "Director's Message | Akal Business School",
                'meta_description' => 'A message from the Director of Akal Business School.',
                'slug' => 'about/directors-message',
                'canonical_url' => 'https://business.auts.ac.in/about/directors-message',
                'breadcrumb_title' => "Director's Message",
            ],
            [
                'page_identifier' => 'about/vision-mission',
                'page_title' => 'Vision & Mission',
                'seo_title' => 'Vision & Mission | Akal Business School',
                'meta_description' => 'Discover the vision and mission guiding Akal Business School towards academic excellence.',
                'slug' => 'about/vision-mission',
                'canonical_url' => 'https://business.auts.ac.in/about/vision-mission',
                'breadcrumb_title' => 'Vision & Mission',
            ],
            [
                'page_identifier' => 'academics',
                'page_title' => 'Academics',
                'seo_title' => 'Academic Programs | MBA, BBA, PhD | Akal Business School',
                'meta_description' => 'Explore MBA, BBA, and PhD programs at Akal Business School with specializations in Business Analytics, AI, and Management.',
                'meta_keywords' => 'MBA Program, BBA Program, PhD, Business Analytics, AI Management',
                'slug' => 'academics',
                'canonical_url' => 'https://business.auts.ac.in/academics',
                'breadcrumb_title' => 'Academics',
            ],
            [
                'page_identifier' => 'admissions',
                'page_title' => 'Admissions',
                'seo_title' => 'Admissions | Apply Now | Akal Business School',
                'meta_description' => 'Apply for admission to Akal Business School. Learn about eligibility, fees, scholarships, and application process.',
                'meta_keywords' => 'Admissions, Apply, MBA Admission, BBA Admission, Scholarships',
                'slug' => 'admissions',
                'canonical_url' => 'https://business.auts.ac.in/admissions',
                'breadcrumb_title' => 'Admissions',
            ],
            [
                'page_identifier' => 'faculty',
                'page_title' => 'Faculty',
                'seo_title' => 'Distinguished Faculty | Akal Business School',
                'meta_description' => 'Meet our distinguished faculty members with expertise in management, analytics, and business.',
                'slug' => 'faculty',
                'canonical_url' => 'https://business.auts.ac.in/faculty',
                'breadcrumb_title' => 'Faculty',
            ],
            [
                'page_identifier' => 'placements',
                'page_title' => 'Placements',
                'seo_title' => 'Placement Records | Corporate Recruiters | Akal Business School',
                'meta_description' => 'Explore placement records, top recruiters, and career opportunities at Akal Business School.',
                'meta_keywords' => 'Placements, Recruiters, Career, MBA Placements, BBA Placements',
                'slug' => 'placements',
                'canonical_url' => 'https://business.auts.ac.in/placements',
                'breadcrumb_title' => 'Placements',
            ],
            [
                'page_identifier' => 'campus-life',
                'page_title' => 'Campus Life',
                'seo_title' => 'Campus Life | Student Experience | Akal Business School',
                'meta_description' => 'Experience vibrant campus life at Akal Business School with modern facilities and student activities.',
                'slug' => 'campus-life',
                'canonical_url' => 'https://business.auts.ac.in/campus-life',
                'breadcrumb_title' => 'Campus Life',
            ],
            [
                'page_identifier' => 'news',
                'page_title' => 'News & Events',
                'seo_title' => 'Latest News & Events | Akal Business School',
                'meta_description' => 'Stay updated with the latest news, events, and happenings at Akal Business School.',
                'slug' => 'news',
                'canonical_url' => 'https://business.auts.ac.in/news',
                'breadcrumb_title' => 'News',
            ],
            [
                'page_identifier' => 'contact',
                'page_title' => 'Contact Us',
                'seo_title' => 'Contact Us | Akal Business School',
                'meta_description' => 'Get in touch with Akal Business School. Contact us for admissions, queries, or campus visits.',
                'meta_keywords' => 'Contact, Admissions, Phone, Email, Address, Campus Visit',
                'slug' => 'contact',
                'canonical_url' => 'https://business.auts.ac.in/contact',
                'breadcrumb_title' => 'Contact',
            ],
            [
                'page_identifier' => 'downloads',
                'page_title' => 'Downloads',
                'seo_title' => 'Downloads & Resources | Akal Business School',
                'meta_description' => 'Download brochures, forms, and academic resources from Akal Business School.',
                'slug' => 'downloads',
                'canonical_url' => 'https://business.auts.ac.in/downloads',
                'breadcrumb_title' => 'Downloads',
            ],
            [
                'page_identifier' => 'testimonials',
                'page_title' => 'Testimonials',
                'seo_title' => 'Student Testimonials | Akal Business School',
                'meta_description' => 'Read what our students and alumni say about their experience at Akal Business School.',
                'slug' => 'testimonials',
                'canonical_url' => 'https://business.auts.ac.in/testimonials',
                'breadcrumb_title' => 'Testimonials',
            ],
            [
                'page_identifier' => 'facilities',
                'page_title' => 'Facilities',
                'seo_title' => 'World-Class Facilities | Akal Business School',
                'meta_description' => 'Explore world-class facilities including smart classrooms, library, sports complex, and hostels.',
                'slug' => 'facilities',
                'canonical_url' => 'https://business.auts.ac.in/facilities',
                'breadcrumb_title' => 'Facilities',
            ],
        ];

        foreach ($pages as $page) {
            PageSeo::updateOrCreate(
                ['page_identifier' => $page['page_identifier']],
                array_merge($page, [
                    'meta_robots' => 'index, follow',
                    'og_type' => 'website',
                    'twitter_card' => 'summary_large_image',
                    'is_active' => true,
                ])
            );
        }
    }
}
