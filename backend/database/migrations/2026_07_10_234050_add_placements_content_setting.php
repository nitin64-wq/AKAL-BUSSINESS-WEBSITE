<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Setting;

return new class extends Migration
{
    public function up(): void
    {
        $students = [
            ['name' => 'Simranpreet Kaur', 'batch' => 'MBA (2023–2025)', 'company' => 'Oracle India Pvt. Ltd.'],
            ['name' => 'Prabhjot Virk', 'batch' => 'MBA (2023–2025)', 'company' => 'Oracle India Pvt. Ltd.'],
            ['name' => 'Sarvjeet Kaur', 'batch' => 'MBA (2023–2025)', 'company' => 'K C Global EdTech Pvt. Ltd.'],
            ['name' => 'Anchal Soni', 'batch' => 'MBA (2023–2025)', 'company' => 'Xenage Solutions Pvt. Ltd.'],
            ['name' => 'Baljeet Kaur', 'batch' => 'MBA (2023–2025)', 'company' => 'K C Global EdTech Pvt. Ltd.'],
            ['name' => 'Gurdev Kaur', 'batch' => 'MBA (2023–2025)', 'company' => 'Greenway Carriers'],
            ['name' => 'Raman Punihani', 'batch' => 'MBA (2022–2024)', 'company' => 'PR Operational Services Pvt. Ltd.'],
            ['name' => 'Satnam Kaur', 'batch' => 'MBA (2022–2024)', 'company' => 'Xenage Solution Pvt. Ltd.'],
            ['name' => 'Arihant Garg', 'batch' => 'MBA (2022–2024)', 'company' => 'BJS Distribution & Storage & Couriers Pvt. Ltd.'],
            ['name' => 'Gagandeep Kaur', 'batch' => 'MBA (2022–2024)', 'company' => 'The Kalgidhar Trust, Baru Sahib'],
            ['name' => 'Ramandeep Kaur', 'batch' => 'MBA (2022–2024)', 'company' => 'Western Refrigeration Pvt. Ltd.'],
            ['name' => 'Loveleen Kaur', 'batch' => 'MBA (2022–2024)', 'company' => 'Jivo Wellness Pvt. Ltd.'],
            ['name' => 'Kiranjot Kaur', 'batch' => 'MBA (2022–2024)', 'company' => 'Xenage Solution Pvt. Ltd.'],
            ['name' => 'Harjeet Kaur', 'batch' => 'MBA (2022–2024)', 'company' => 'BJS Distribution & Storage & Couriers Pvt. Ltd.'],
            ['name' => 'Mohit Seoda', 'batch' => 'MBA (2022–2024)', 'company' => 'BJS Distribution & Storage & Couriers Pvt. Ltd.'],
            ['name' => 'Amandeep Kaur', 'batch' => 'MBA (2021–2023)', 'company' => 'BJS Distribution & Storage & Couriers Pvt. Ltd.'],
            ['name' => 'Harpreet Kaur', 'batch' => 'MBA (2021–2023)', 'company' => 'BJS Distribution & Storage & Couriers Pvt. Ltd.'],
            ['name' => 'Khushdeep Kaur', 'batch' => 'MBA (2021–2023)', 'company' => 'BJS Distribution & Storage & Couriers Pvt. Ltd.'],
            ['name' => 'Muskan Kumari', 'batch' => 'MBA (2021–2023)', 'company' => 'Hamid & Kumar Enterprises LLC'],
            ['name' => 'Paramjeet Kaur', 'batch' => 'MBA (2021–2023)', 'company' => 'Hamid & Kumar Enterprises LLC'],
            ['name' => 'Ruchi Rani', 'batch' => 'MBA (2021–2023)', 'company' => 'BJS Distribution & Storage & Couriers Pvt. Ltd.'],
            ['name' => 'Manjinder Kaur', 'batch' => 'MBA (2021–2023)', 'company' => 'University of North Texas (USA)'],
            ['name' => 'Rasleen Kaur', 'batch' => 'MBA (2021–2023)', 'company' => 'Florida State University (USA)'],
            ['name' => 'Anchal Rani', 'batch' => 'MBA (2021–2023)', 'company' => 'The Kalgidhar Trust, Baru Sahib'],
            ['name' => 'Emanpreet Kaur', 'batch' => 'MBA (2021–2023)', 'company' => 'The Kalgidhar Trust, Baru Sahib'],
            ['name' => 'Rasdeep Kaur', 'batch' => 'MBA (2021–2023)', 'company' => 'The Kalgidhar Trust, Baru Sahib'],
        ];

        Setting::updateOrCreate(
            ['key' => 'page_placements_students'],
            [
                'value' => json_encode(['students' => $students]),
                'type' => 'json',
                'group' => 'page_content',
                'label' => 'Placements Page: Student Records',
            ]
        );
    }

    public function down(): void
    {
        Setting::where('key', 'page_placements_students')->delete();
    }
};
