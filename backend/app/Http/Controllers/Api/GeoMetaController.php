<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GeoMeta;
use App\Models\SeoMeta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GeoMetaController extends Controller
{
    /**
     * GET /seo/geo/{type}/{id} — Public: get GEO meta for content.
     */
    public function show(string $type, int $id): JsonResponse
    {
        $modelClass = SeoMeta::resolveModelType($type);

        $geoMeta = GeoMeta::where('metable_type', $modelClass)
            ->where('metable_id', $id)
            ->first();

        if (!$geoMeta) {
            return response()->json(['success' => false, 'message' => 'GEO meta not found.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $geoMeta,
        ]);
    }

    /**
     * GET /seo/geo/page/{pageSeoId} — Public: get GEO meta for static page.
     */
    public function showForPage(int $pageSeoId): JsonResponse
    {
        $geoMeta = GeoMeta::where('page_seo_id', $pageSeoId)->first();

        return response()->json([
            'success' => true,
            'data' => $geoMeta,
        ]);
    }

    /**
     * PUT /admin/seo/geo/page/{pageSeoId} — Admin: update GEO meta for static page.
     */
    public function upsertForPage(Request $request, int $pageSeoId): JsonResponse
    {
        $data = $this->validateGeoData($request);
        $data['page_seo_id'] = $pageSeoId;

        $geoMeta = GeoMeta::updateOrCreate(
            ['page_seo_id' => $pageSeoId, 'metable_type' => null, 'metable_id' => null],
            $data
        );

        return response()->json([
            'success' => true,
            'message' => 'GEO meta updated successfully.',
            'data' => $geoMeta->fresh(),
        ]);
    }

    /**
     * PUT /admin/seo/geo/{type}/{id} — Admin: update GEO meta for content.
     */
    public function upsert(Request $request, string $type, int $id): JsonResponse
    {
        $modelClass = SeoMeta::resolveModelType($type);
        $data = $this->validateGeoData($request);
        $data['metable_type'] = $modelClass;
        $data['metable_id'] = $id;

        $geoMeta = GeoMeta::updateOrCreate(
            ['metable_type' => $modelClass, 'metable_id' => $id],
            $data
        );

        return response()->json([
            'success' => true,
            'message' => 'GEO meta updated successfully.',
            'data' => $geoMeta->fresh(),
        ]);
    }

    private function validateGeoData(Request $request): array
    {
        $validated = $request->validate([
            'author_bio' => 'nullable|string|max:5000',
            'references' => 'nullable',
            'sources' => 'nullable',
            'publication_date' => 'nullable|string',
            'last_updated' => 'nullable|string',
            'reading_time' => 'nullable|integer|min:0',
            'entity_keywords' => 'nullable',
            'structured_headings' => 'nullable',
            'content_score' => 'nullable|integer|min:0|max:100',
            'ai_readability_score' => 'nullable|integer|min:0|max:100',
            'generative_search_score' => 'nullable|integer|min:0|max:100',
            'eeat_score' => 'nullable|integer|min:0|max:100',
            'internal_linking_suggestions' => 'nullable',
        ]);

        // Decode JSON strings
        foreach (['references', 'sources', 'entity_keywords', 'structured_headings', 'internal_linking_suggestions'] as $field) {
            if (isset($validated[$field]) && is_string($validated[$field])) {
                $validated[$field] = json_decode($validated[$field], true);
            }
        }

        return $validated;
    }
}
