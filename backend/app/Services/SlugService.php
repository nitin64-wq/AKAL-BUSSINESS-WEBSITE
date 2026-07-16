<?php

namespace App\Services;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class SlugService
{
    /**
     * Generate a unique slug for a given database table and column
     */
    public static function generateUniqueSlug(string $title, string $table, string $column = 'slug'): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;

        $count = 1;
        while (DB::table($table)->where($column, $slug)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }
}
