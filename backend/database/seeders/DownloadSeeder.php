<?php

namespace Database\Seeders;

use App\Models\Download;
use Illuminate\Database\Seeder;

class DownloadSeeder extends Seeder
{
    public function run(): void
    {
        // Truncate to prevent duplicates
        Download::truncate();

        $downloads = [
            [
                'title' => 'Entrance Sample Test Paper',
                'file_path' => '/uploads/downloads/entrance_sample_test.pdf',
                'file_size' => '1.2 MB',
                'type' => 'PDF',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'MBA Syllabus',
                'file_path' => '/uploads/downloads/mba_syllabus.pdf',
                'file_size' => '840 KB',
                'type' => 'PDF',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Solved SSC MTS 22nd August 2019 Shift-3 Paper with Solutions',
                'file_path' => '/uploads/downloads/ssc_mts_2019.pdf',
                'file_size' => '3.1 MB',
                'type' => 'PDF',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Solved IBPS PO 2018 Paper with Solutions',
                'file_path' => '/uploads/downloads/ibps_po_2018.pdf',
                'file_size' => '2.5 MB',
                'type' => 'PDF',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'title' => 'Solved IBPS Clerk Prelims 2018 Paper',
                'file_path' => '/uploads/downloads/ibps_clerk_2018.pdf',
                'file_size' => '1.8 MB',
                'type' => 'PDF',
                'sort_order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($downloads as $d) {
            Download::create($d);
        }
    }
}
