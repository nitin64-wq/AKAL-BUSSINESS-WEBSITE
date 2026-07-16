<?php

namespace Database\Seeders;

use App\Models\StudentAchievement;
use Illuminate\Database\Seeder;

class StudentAchievementSeeder extends Seeder
{
    public function run(): void
    {
        $achievements = [
            [
                'title' => 'GMAT Qualification',
                'description' => 'Ms. Manjinder Kaur successfully qualified GMAT, paving a direct path to elite global business schools.',
                'badge' => 'Exam Excellence',
                'icon' => 'Trophy',
                'highlight' => 'GMAT Qualified',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Fully Funded PhD — USA',
                'description' => 'Ms. Manjinder Kaur secured a fully funded Ph.D. position at University of North Texas, USA. Ms. Rasleen Kaur secured a fully funded Ph.D. at Florida State University, USA.',
                'badge' => 'Research Fellows',
                'icon' => 'GraduationCap',
                'highlight' => 'USA Placements',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Snug-Sakhi Business Incubation',
                'description' => 'Successfully incubated Snug-Sakhi Business Idea by two BBA students (Puneet Singla & Rajveer Kaur) through Akal Incubation Centre.',
                'badge' => 'Entrepreneurship',
                'icon' => 'Lightbulb',
                'highlight' => 'Incubated & Funded',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'title' => '18 Research Papers at Conferences',
                'description' => '18 MBA students presented research papers in International Conferences, showcasing strong research capabilities and scholarly contributions.',
                'badge' => 'Academic Writing',
                'icon' => 'BookOpen',
                'highlight' => 'International Conferences',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'title' => 'Best Paper Award — Ms. Harleen Kaur',
                'description' => 'Ms. Harleen Kaur received the Best Paper Award at the International Conference on Strengthening the Industry-Academia Interface (2025) at Eternal University, Baru Sahib.',
                'badge' => 'Global Recognition',
                'icon' => 'Award',
                'highlight' => 'Best Paper',
                'sort_order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($achievements as $ach) {
            StudentAchievement::create($ach);
        }
    }
}
