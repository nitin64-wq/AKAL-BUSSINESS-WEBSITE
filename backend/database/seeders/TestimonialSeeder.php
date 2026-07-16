<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run()
    {
        $testimonials = [
            [
                'name' => 'Manjinder Kaur',
                'designation' => 'MBA - Business Analytics',
                'company' => 'Placed at KPMG',
                'photo' => '/storage/testimonials/manjinder.jpg',
                'quote' => 'I was impressed by the University’s peaceful and safe environment, which facilitates the student’s growth and is necessary to concentrate on her studies. The Kalgidhar Trust, Baru Sahib, fully funded my studies at Akal University. One of the unique aspects of the University is that it conducts weekly tests every Monday.',
                'rating' => 5,
                'batch_year' => 2024,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Rasleen Kaur',
                'designation' => 'MBA - Business Analytics',
                'company' => 'Placed at Deloitte',
                'photo' => '/storage/testimonials/rasleen.jpg',
                'quote' => 'My experience at Akal University is outstanding. I checked out many universities However, the other universities only offered specializations in Marketing, Finance, and Human Resources, and the fees were also relatively high. On the other hand, Akal University offers an MBA specializing in Business Analytics.',
                'rating' => 5,
                'batch_year' => 2024,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Harjaganjot Kaur',
                'designation' => 'Physics Graduate',
                'company' => 'Center for Competitive Examination',
                'photo' => '/storage/testimonials/harjaganjot.png',
                'quote' => 'After completing my Grade 12th, I was looking for an institution that was highly equipped with the instruction of Physics, and that is when I stumbled upon Akal University. Akal University is highly equipped with advanced labs and faculty with outstanding credentials.',
                'rating' => 5,
                'batch_year' => 2024,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 3,
            ]
        ];

        foreach ($testimonials as $t) {
            Testimonial::create($t);
        }
    }
}
