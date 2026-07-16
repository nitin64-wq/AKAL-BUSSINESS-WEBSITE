<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SeoSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeoRobotsController extends Controller
{
    /**
     * GET /seo/robots-data — Public: returns robots.txt configuration for Next.js.
     */
    public function index(): JsonResponse
    {
        $settings = SeoSetting::getAllAsMap();

        $rules = [];

        // Parse allow rules
        $allowRaw = $settings['robots_allow'] ?? '/';
        $allows = array_filter(array_map('trim', explode("\n", $allowRaw)));

        // Parse disallow rules
        $disallowRaw = $settings['robots_disallow'] ?? '/admin/';
        $disallows = array_filter(array_map('trim', explode("\n", $disallowRaw)));

        $rules[] = [
            'userAgent' => $settings['robots_user_agent'] ?? '*',
            'allow' => $allows,
            'disallow' => $disallows,
        ];

        // Crawl delay
        $crawlDelay = $settings['robots_crawl_delay'] ?? null;

        // Sitemap URL
        $sitemapUrl = $settings['robots_sitemap_url']
            ?? ($settings['default_canonical_url'] ?? 'https://business.auts.ac.in') . '/sitemap.xml';

        // Host
        $host = $settings['robots_host'] ?? $settings['default_canonical_url'] ?? null;

        return response()->json([
            'success' => true,
            'data' => [
                'rules' => $rules,
                'sitemap' => $sitemapUrl,
                'host' => $host,
                'crawl_delay' => $crawlDelay,
            ],
        ]);
    }

    /**
     * PUT /admin/seo/robots — Admin: update robots settings.
     */
    public function update(Request $request): JsonResponse
    {
        $fields = [
            'robots_user_agent',
            'robots_allow',
            'robots_disallow',
            'robots_crawl_delay',
            'robots_sitemap_url',
            'robots_host',
        ];

        foreach ($fields as $field) {
            if ($request->has($field)) {
                SeoSetting::setValue($field, $request->input($field));
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Robots settings updated successfully.',
        ]);
    }
}
