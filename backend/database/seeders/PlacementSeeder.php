<?php

namespace Database\Seeders;

use App\Models\Placement;
use Illuminate\Database\Seeder;

class PlacementSeeder extends Seeder
{
    public function run()
    {
        // Truncate to prevent duplicates
        Placement::truncate();

        $placements = [
            [
                'company_name' => 'Amazon',
                'company_logo' => '/images/placements/amazon.png',
                'role_offered' => 'Operations Analyst',
                'package_lpa' => 12.00,
                'year' => 2026,
                'placement_type' => 'Campus',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'company_name' => 'TCS',
                'company_logo' => '/images/placements/tcs.png',
                'role_offered' => 'Systems Consultant - Business Intelligence',
                'package_lpa' => 7.50,
                'year' => 2026,
                'placement_type' => 'Campus',
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'company_name' => 'Wipro',
                'company_logo' => '/images/placements/wipro.png',
                'role_offered' => 'Business Analyst',
                'package_lpa' => 6.80,
                'year' => 2026,
                'placement_type' => 'Campus',
                'is_featured' => true,
                'sort_order' => 3,
            ],
            [
                'company_name' => 'Tech Mahindra',
                'company_logo' => '/images/placements/tech_mahindra.png',
                'role_offered' => 'Data Analyst',
                'package_lpa' => 6.20,
                'year' => 2026,
                'placement_type' => 'Campus',
                'is_featured' => true,
                'sort_order' => 4,
            ],
            [
                'company_name' => 'Reliance Jio',
                'company_logo' => '/images/placements/reliance_jio.png',
                'role_offered' => 'Management Trainee - Retail Analytics',
                'package_lpa' => 5.50,
                'year' => 2026,
                'placement_type' => 'Campus',
                'is_featured' => true,
                'sort_order' => 5,
            ],
            [
                'company_name' => 'Eagle Inbrit',
                'company_logo' => null,
                'role_offered' => 'Operations Officer',
                'package_lpa' => 8.50,
                'year' => 2026,
                'placement_type' => 'Campus',
                'is_featured' => true,
                'sort_order' => 6,
            ],
            [
                'company_name' => 'Jiwo Wellness',
                'company_logo' => null,
                'role_offered' => 'Health Systems Analyst',
                'package_lpa' => 7.80,
                'year' => 2026,
                'placement_type' => 'Campus',
                'is_featured' => true,
                'sort_order' => 7,
            ],
            [
                'company_name' => 'Verka',
                'company_logo' => null,
                'role_offered' => 'Operations & Supply Chain Analyst',
                'package_lpa' => 6.00,
                'year' => 2026,
                'placement_type' => 'Campus',
                'is_featured' => true,
                'sort_order' => 8,
            ],
            [
                'company_name' => 'Airtel',
                'company_logo' => null,
                'role_offered' => 'Network Business Analyst',
                'package_lpa' => 8.20,
                'year' => 2026,
                'placement_type' => 'Campus',
                'is_featured' => true,
                'sort_order' => 9,
            ],
            [
                'company_name' => 'Escorts Kubota',
                'company_logo' => null,
                'role_offered' => 'Data Analytics Consultant',
                'package_lpa' => 9.00,
                'year' => 2026,
                'placement_type' => 'Campus',
                'is_featured' => true,
                'sort_order' => 10,
            ],
            [
                'company_name' => 'Accenture',
                'company_logo' => null,
                'role_offered' => 'Management Consulting Analyst',
                'package_lpa' => 10.50,
                'year' => 2026,
                'placement_type' => 'Campus',
                'is_featured' => true,
                'sort_order' => 11,
            ],
            [
                'company_name' => 'BJS',
                'company_logo' => null,
                'role_offered' => 'Operations Consultant',
                'package_lpa' => 7.50,
                'year' => 2026,
                'placement_type' => 'Campus',
                'is_featured' => true,
                'sort_order' => 12,
            ],
            [
                'company_name' => 'GMAT PYQs',
                'company_logo' => null,
                'role_offered' => 'Analytical Reasoning Trainer',
                'package_lpa' => 6.50,
                'year' => 2026,
                'placement_type' => 'Campus',
                'is_featured' => true,
                'sort_order' => 13,
            ],
            [
                'company_name' => 'UGC NET PYQs',
                'company_logo' => null,
                'role_offered' => 'Academic Research Associate',
                'package_lpa' => 6.00,
                'year' => 2026,
                'placement_type' => 'Campus',
                'is_featured' => true,
                'sort_order' => 14,
            ]
        ];

        foreach ($placements as $p) {
            Placement::create($p);
        }
    }
}
