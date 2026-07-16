<?php

namespace Database\Seeders;

use App\Models\Scholarship;
use Illuminate\Database\Seeder;

class ScholarshipSeeder extends Seeder
{
    public function run()
    {
        $scholarships = [
            [
                'title' => 'Merit-Based Scholarships',
                'type' => 'Merit',
                'description' => 'Up to 100% tuition waiver for students with outstanding academic records in qualifying examinations.',
                'eligibility' => 'Students securing above 90% in qualifying board exams or top ranks in national entry exams.',
                'amount_percent' => 100,
                'is_active' => true,
                'sort_order' => 1,
                'icon' => 'Award',
            ],
            [
                'title' => 'Need-Based Financial Aid',
                'type' => 'Need-Based',
                'description' => 'Support for deserving candidates from economically weaker sections to ensure education remains accessible.',
                'eligibility' => 'Annual family income below specified threshold, evaluated by the scholarship committee.',
                'amount_percent' => 50,
                'is_active' => true,
                'sort_order' => 2,
                'icon' => 'Heart',
            ],
            [
                'title' => 'Sports Scholarships',
                'type' => 'Sports',
                'description' => 'Special tuition concessions for state, national, and international level sports achievers.',
                'eligibility' => 'Representation at state, national, or international sports events in recognized athletic categories.',
                'amount_percent' => 75,
                'is_active' => true,
                'sort_order' => 3,
                'icon' => 'Trophy',
            ],
            [
                'title' => 'Research & Startup Grants',
                'type' => 'Research',
                'description' => 'Dedicated financial funding for excellent student research publications and viable business startup ideas.',
                'eligibility' => 'Viable business plan submission or peer-reviewed research journal publication approval.',
                'amount_percent' => 100,
                'is_active' => true,
                'sort_order' => 4,
                'icon' => 'BookOpen',
            ]
        ];

        foreach ($scholarships as $s) {
            Scholarship::create($s);
        }
    }
}
