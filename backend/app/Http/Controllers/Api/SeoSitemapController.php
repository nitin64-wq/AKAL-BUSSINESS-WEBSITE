<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageSeo;
use App\Models\SeoSetting;
use Illuminate\Http\JsonResponse;

class SeoSitemapController extends Controller
{
    /**
     * GET /seo/sitemap-data — Public: full sitemap data for Next.js.
     */
    public function index(): JsonResponse
    {
        $baseUrl = SeoSetting::getValue('default_canonical_url', 'https://business.auts.ac.in');
        $apiUrl = config('app.url', 'http://localhost:8000');

        $entries = [];

        // 1. Static pages from page_seo table
        $pages = PageSeo::active()->get();
        foreach ($pages as $page) {
            $entries[] = [
                'url' => $baseUrl . '/' . ltrim($page->slug ?? $page->page_identifier, '/'),
                'lastModified' => $page->updated_at?->toIso8601String() ?? now()->toIso8601String(),
                'changeFrequency' => $page->page_identifier === 'home' ? 'daily' : 'weekly',
                'priority' => $page->page_identifier === 'home' ? 1.0 : 0.8,
            ];
        }

        // 2. Dynamic content: News
        try {
            $news = \App\Models\News::published()->select('slug', 'updated_at')->get();
            foreach ($news as $item) {
                $entries[] = [
                    'url' => $baseUrl . '/news/' . $item->slug,
                    'lastModified' => $item->updated_at?->toIso8601String(),
                    'changeFrequency' => 'weekly',
                    'priority' => 0.7,
                ];
            }
        } catch (\Throwable $e) {
            // Model may not be available
        }

        // 3. Dynamic content: Programs
        try {
            $programs = \App\Models\Program::where('is_active', true)->select('slug', 'updated_at')->get();
            foreach ($programs as $item) {
                $entries[] = [
                    'url' => $baseUrl . '/academics/' . $item->slug,
                    'lastModified' => $item->updated_at?->toIso8601String(),
                    'changeFrequency' => 'monthly',
                    'priority' => 0.7,
                ];
            }
        } catch (\Throwable $e) {}

        // 4. Dynamic content: Events
        try {
            $events = \App\Models\Event::select('slug', 'updated_at')->get();
            foreach ($events as $item) {
                $entries[] = [
                    'url' => $baseUrl . '/news/' . $item->slug,
                    'lastModified' => $item->updated_at?->toIso8601String(),
                    'changeFrequency' => 'weekly',
                    'priority' => 0.6,
                ];
            }
        } catch (\Throwable $e) {}

        // 5. Dynamic content: Faculty
        try {
            $faculty = \App\Models\Faculty::select('slug', 'updated_at')->get();
            foreach ($faculty as $item) {
                $entries[] = [
                    'url' => $baseUrl . '/faculty/' . $item->slug,
                    'lastModified' => $item->updated_at?->toIso8601String(),
                    'changeFrequency' => 'monthly',
                    'priority' => 0.6,
                ];
            }
        } catch (\Throwable $e) {}

        return response()->json([
            'success' => true,
            'data' => $entries,
            'total' => count($entries),
        ]);
    }
}
