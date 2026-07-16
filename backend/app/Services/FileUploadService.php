<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    /**
     * Upload an image to the local public disk.
     * Returns the relative public path (e.g. /storage/folder/filename.jpg)
     */
    public static function uploadImage($file, string $folder): string
    {
        // Generate unique name
        $name = Str::uuid() . '.' . $file->getClientOriginalExtension();
        
        // Store on public disk
        $path = $file->storeAs($folder, $name, 'public');
        
        return '/storage/' . $path;
    }

    /**
     * Upload a general document/brochure/PDF to the local public disk.
     */
    public static function uploadDocument($file, string $folder): string
    {
        $name = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs($folder, $name, 'public');
        
        return '/storage/' . $path;
    }

    /**
     * Delete a file by its public path.
     */
    public static function delete(?string $publicPath): bool
    {
        if (!$publicPath) {
            return false;
        }

        // Convert /storage/folder/file.jpg to folder/file.jpg
        $path = str_replace('/storage/', '', $publicPath);

        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }

        return false;
    }
}
