<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UserSeeder::class,
            ProgramSeeder::class,
            FacultySeeder::class,
            SettingsSeeder::class,
            NewsSeeder::class,
            TestimonialSeeder::class,
            ScholarshipSeeder::class,
            PlacementSeeder::class,
            GallerySeeder::class,
            HeroSlideSeeder::class,
            StudentAchievementSeeder::class,
            PartnerUniversitySeeder::class,
            DownloadSeeder::class,
            SeoSettingSeeder::class,
            PageSeoSeeder::class,
        ]);
    }
}
