<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index']);
    }

    /**
     * Public active settings
     */
    public function index()
    {
        // Return key-value pairs of settings
        $settings = Setting::all()->mapWithKeys(function ($item) {
            // Parse boolean values
            if ($item->type === 'boolean') {
                $val = filter_var($item->value, FILTER_VALIDATE_BOOLEAN);
            } elseif ($item->type === 'number') {
                $val = is_numeric($item->value) ? $item->value + 0 : $item->value;
            } elseif ($item->type === 'json') {
                $val = json_decode($item->value, true);
            } else {
                $val = $item->value;
            }
            return [$item->key => $val];
        });

        return response()->json([
            'status' => 'success',
            'data' => $settings,
        ]);
    }

    /**
     * Admin index (List settings details)
     */
    public function adminIndex()
    {
        $this->authorize('view', Setting::class);

        return response()->json([
            'status' => 'success',
            'data' => Setting::all(),
        ]);
    }

    /**
     * Admin bulk update
     */
    public function update(Request $request)
    {
        $this->authorize('update', Setting::class);

        $request->validate([
            'settings' => 'nullable|array',
            'why_abs_image_file' => 'nullable|image|max:3072',
        ]);

        // Validate any page content image uploads as images under 3MB
        foreach ($request->allFiles() as $key => $file) {
            if (preg_match('/_file$/', $key)) {
                $request->validate([
                    $key => 'image|max:3072'
                ]);
            }
        }

        if ($request->has('settings') && is_array($request->settings)) {
            foreach ($request->settings as $key => $value) {
                $setting = Setting::where('key', $key)->first();
                if ($setting) {
                    // Normalize boolean/json types
                    if (is_array($value)) {
                        $setting->value = json_encode($value);
                    } elseif (is_bool($value) || $value === 'true' || $value === 'false') {
                        $setting->value = ($value === true || $value === 'true') ? 'true' : 'false';
                    } else {
                        $setting->value = (string)$value;
                    }
                    $setting->save();
                }
            }
        }

        if ($request->hasFile('why_abs_image_file')) {
            $path = \App\Services\FileUploadService::uploadImage(
                $request->file('why_abs_image_file'),
                'settings'
            );

            $setting = Setting::where('key', 'why_abs_image')->first();
            if ($setting) {
                if (strpos($setting->value, '/images/') === false) {
                    \App\Services\FileUploadService::delete($setting->value);
                }
                $setting->value = $path;
                $setting->save();
            }
        }

        // Process dynamic page content file uploads
        $jsonSettings = Setting::where('type', 'json')->get()->sortByDesc(function ($s) {
            return strlen($s->key);
        });

        foreach ($request->files as $fileKey => $file) {
            if (!$request->hasFile($fileKey)) {
                continue;
            }

            // We expect the format: {settingKey}_{field}_file
            if (preg_match('/^(.+)_file$/', $fileKey, $suffixMatches)) {
                $keyWithoutFile = $suffixMatches[1];
                
                $setting = null;
                $field = null;

                foreach ($jsonSettings as $s) {
                    $prefix = $s->key . '_';
                    if (strpos($keyWithoutFile, $prefix) === 0) {
                        $setting = $s;
                        $field = substr($keyWithoutFile, strlen($prefix));
                        break;
                    }
                }

                if ($setting) {
                    $path = \App\Services\FileUploadService::uploadImage(
                        $request->file($fileKey),
                        'page_content'
                    );

                    $data = json_decode($setting->value, true) ?: [];
                    
                    // Delete old image if it was uploaded
                    if (!empty($data[$field]) && strpos($data[$field], '/images/') === false) {
                        \App\Services\FileUploadService::delete($data[$field]);
                    }

                    $data[$field] = $path;
                    $setting->value = json_encode($data);
                    $setting->save();
                }
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => Setting::all(),
            'message' => 'Settings updated successfully.',
        ]);
    }
}
