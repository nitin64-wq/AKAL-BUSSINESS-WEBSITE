<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SeoSettingRequest;
use App\Models\SeoSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SeoSettingController extends Controller
{
    /**
     * GET /seo/settings — Public: returns all SEO settings as a flat map.
     */
    public function index(): JsonResponse
    {
        $settings = SeoSetting::getAllAsMap();

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    /**
     * GET /admin/seo/settings — Admin: returns all settings with full metadata.
     */
    public function adminIndex(): JsonResponse
    {
        $settings = SeoSetting::orderBy('group')->orderBy('sort_order')->get();

        return response()->json([
            'success' => true,
            'data' => $settings,
            'grouped' => SeoSetting::getAllGrouped(),
        ]);
    }

    /**
     * PUT /admin/seo/settings — Admin: bulk update settings.
     */
    public function update(Request $request): JsonResponse
    {
        $settings = $request->input('settings', []);

        // Handle file uploads
        $fileFields = [
            'website_logo_file' => 'website_logo',
            'favicon_file' => 'favicon',
            'organization_logo_file' => 'organization_logo',
            'default_og_image_file' => 'default_og_image',
        ];

        foreach ($fileFields as $fileKey => $settingKey) {
            if ($request->hasFile($fileKey)) {
                $file = $request->file($fileKey);
                $path = $file->store('seo', 'public');
                $settings[$settingKey] = '/storage/' . $path;
            }
        }

        // Update each setting
        foreach ($settings as $key => $value) {
            $existing = SeoSetting::where('key', $key)->first();
            if ($existing) {
                $existing->update(['value' => is_array($value) ? json_encode($value) : (string) $value]);
            } else {
                // Auto-create if doesn't exist
                SeoSetting::create([
                    'key' => $key,
                    'value' => is_array($value) ? json_encode($value) : (string) $value,
                    'type' => 'text',
                    'group' => 'general',
                    'label' => ucwords(str_replace('_', ' ', $key)),
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'SEO settings updated successfully.',
            'data' => SeoSetting::getAllAsMap(),
        ]);
    }
}
