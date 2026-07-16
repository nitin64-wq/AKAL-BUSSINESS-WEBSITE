<?php

namespace Database\Seeders;

use App\Models\PartnerUniversity;
use Illuminate\Database\Seeder;

class PartnerUniversitySeeder extends Seeder
{
    public function run(): void
    {
        $unis = [
            [
                'name' => 'University of Nebraska Omaha',
                'description' => 'Collaborative academic efforts and guidance from Prof. Gurpreet Dhillon.',
                'logo_icon' => 'Landmark',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Virginia Commonwealth University',
                'description' => 'Active MoU facilitating research pathways and joint analytics summits.',
                'logo_icon' => 'Landmark',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'University of North Carolina Greensboro',
                'description' => 'Partnership enabling student projects, shared resources and virtual classrooms.',
                'logo_icon' => 'Landmark',
                'sort_order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($unis as $uni) {
            PartnerUniversity::create($uni);
        }
    }
}
