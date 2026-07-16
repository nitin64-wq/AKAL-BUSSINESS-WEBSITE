<?php

namespace App\Services;

use App\Models\Application;

class ApplicationService
{
    /**
     * Generate a unique application number in the format ABS-YYYY-XXXXX
     */
    public static function generateApplicationNumber(): string
    {
        $year = date('Y');
        $prefix = "ABS-{$year}-";

        // Query the database for the highest application number for the current year
        $latest = Application::where('application_no', 'like', "{$prefix}%")
            ->orderBy('application_no', 'desc')
            ->first();

        if ($latest) {
            // Extract the numeric part (e.g., from ABS-2026-00042 extract 42)
            $parts = explode('-', $latest->application_no);
            $sequence = intval(end($parts)) + 1;
        } else {
            $sequence = 1;
        }

        // Pad sequence to 5 digits, e.g., 00001, 00042
        $paddedSequence = str_pad((string)$sequence, 5, '0', STR_PAD_LEFT);

        return "{$prefix}{$paddedSequence}";
    }
}
