<?php

namespace Database\Seeders;

use App\Models\HeroSlide;
use Illuminate\Database\Seeder;

class HeroSlideSeeder extends Seeder
{
    public function run(): void
    {
        $slides = [
            [
                'title' => 'Transforming Future Leaders Through ',
                'title_highlight' => 'Innovation & Analytics',
                'description' => 'Akal Business School (ABS) delivers premium business education. Equip yourself with advanced AI and Business Analytics skills, distinguished faculty support, and global academic opportunities.',
                'badge' => '🎓 Admissions Open 2026-2028',
                'image' => '/images/hero-students.png',
                'primary_btn_text' => 'Apply Now',
                'primary_btn_link' => '/admissions/apply',
                'secondary_btn_text' => 'Explore Programs',
                'secondary_btn_link' => '/academics',
                'float_card_num' => '95%',
                'float_card_label' => 'Placement Rate',
                'float_card_icon' => 'Award',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Launch Your Career with Top ',
                'title_highlight' => 'Global Recruiter MoUs',
                'description' => 'ABS students gain direct pathways to Fortune 500 companies. Our corporate partnerships ensure robust internship opportunities, live industry projects, and premium package tracks.',
                'badge' => '💼 World-Class Placements',
                'image' => '/images/hero-placements.png',
                'primary_btn_text' => 'Placement Records',
                'primary_btn_link' => '/placements',
                'secondary_btn_text' => 'View Curriculums',
                'secondary_btn_link' => '/academics',
                'float_card_num' => '₹12 LPA',
                'float_card_label' => 'Highest Package',
                'float_card_icon' => 'Target',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Master Data-Driven Strategic ',
                'title_highlight' => 'Business Decision Making',
                'description' => 'Bridge the gap between analytics and executive leadership. Work in state-of-the-art computational finance labs on quantitative models and neural network simulations.',
                'badge' => '🔬 Advanced Analytics Lab',
                'image' => '/images/hero-research.png',
                'primary_btn_text' => 'Research at ABS',
                'primary_btn_link' => '/research',
                'secondary_btn_text' => 'Faculty Profiles',
                'secondary_btn_link' => '/faculty',
                'float_card_num' => '15+',
                'float_card_label' => 'Industry Partners',
                'float_card_icon' => 'Award',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'A Vibrant Academic Ecosystem for ',
                'title_highlight' => 'Holistic Growth',
                'description' => 'Experience a rich student life with advanced lecture theatres, fully equipped seminar complexes, active sports clubs, and cultural communities designed for development.',
                'badge' => '🏛️ Modern Campus Infrastructure',
                'image' => '/images/hero-campus.png',
                'primary_btn_text' => 'Schedule Visit',
                'primary_btn_link' => '/contact',
                'secondary_btn_text' => 'Campus Life Details',
                'secondary_btn_link' => '/campus-life',
                'float_card_num' => '100%',
                'float_card_label' => 'Digital Campus',
                'float_card_icon' => 'Target',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'title' => 'A Beacon of Quality & Value-Based ',
                'title_highlight' => 'Higher Education',
                'description' => 'Akal University, established in 2015, is dedicated to academic excellence, value-based learning, and holistic character building.',
                'badge' => '🏛️ Journey of Akal University',
                'image' => '/images/hero-journey.png',
                'primary_btn_text' => 'University Journey',
                'primary_btn_link' => '/about',
                'secondary_btn_text' => 'Explore Campus',
                'secondary_btn_link' => '/campus-life',
                'float_card_num' => 'Est. 2015',
                'float_card_label' => 'State University',
                'float_card_icon' => 'Award',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'title' => 'Nurturing Scientific Curiosity & ',
                'title_highlight' => 'Academic Innovation',
                'description' => 'Department of Botany, in collaboration with national scientific societies, organizes national seminars and hands-on laboratory workshops.',
                'badge' => '🔬 Research & Workshops',
                'image' => '/images/hero-botany.png',
                'primary_btn_text' => 'Research at ABS',
                'primary_btn_link' => '/research',
                'secondary_btn_text' => 'View News & Events',
                'secondary_btn_link' => '/news',
                'float_card_num' => '100%',
                'float_card_label' => 'Hands-on Training',
                'float_card_icon' => 'Target',
                'sort_order' => 6,
                'is_active' => true,
            ],
            [
                'title' => 'Commemorating Milestones at the ',
                'title_highlight' => '1st Convocation Ceremony',
                'description' => 'Celebrating the achievements and graduation of our scholars, stepping forward to lead with wisdom, integrity, and management expertise.',
                'badge' => '🎓 Celebrating Academic Excellence',
                'image' => '/images/hero-convocation.png',
                'primary_btn_text' => 'Our Programs',
                'primary_btn_link' => '/academics',
                'secondary_btn_text' => 'Placement Records',
                'secondary_btn_link' => '/placements',
                'float_card_num' => '1st',
                'float_card_label' => 'Convocation Milestone',
                'float_card_icon' => 'Award',
                'sort_order' => 7,
                'is_active' => true,
            ]
        ];

        foreach ($slides as $slide) {
            HeroSlide::create($slide);
        }
    }
}
