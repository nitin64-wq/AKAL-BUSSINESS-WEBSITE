<?php

namespace Database\Seeders;

use App\Models\Gallery;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    public function run()
    {
        $galleryItems = [
            [
                'title' => 'Akal Business School Campus Building',
                'image_url' => '/storage/programs/about_img.png',
                'thumbnail_url' => '/storage/programs/about_img.png',
                'category' => 'Campus',
                'alt_text' => 'Akal Business School Campus Building',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Student Study and Discussion Area',
                'image_url' => '/storage/programs/webpage-auts-aboutus-3jun23.png',
                'thumbnail_url' => '/storage/programs/webpage-auts-aboutus-3jun23.png',
                'category' => 'Campus',
                'alt_text' => 'Student Study and Discussion Area',
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Value Based Education Seminars',
                'image_url' => '/storage/gallery/sve-icon6.png',
                'thumbnail_url' => '/storage/gallery/sve-icon6.png',
                'category' => 'Events',
                'alt_text' => 'Value Based Education Seminars',
                'is_featured' => true,
                'sort_order' => 3,
            ]
        ];

        foreach ($galleryItems as $item) {
            Gallery::create($item);
        }
    }
}
