<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SeoMetaRequest;
use App\Models\SeoMeta;
use App\Models\Faq;
use App\Models\GeoMeta;
use App\Models\SeoSchema;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeoMetaController extends Controller
{
    /**
     * GET /seo/content/{type}/{id} — Public: get SEO meta for a content item.
     */
    public function show(string $type, int $id): JsonResponse
    {
        $modelClass = SeoMeta::resolveModelType($type);

        $seoMeta = SeoMeta::where('metable_type', $modelClass)
            ->where('metable_id', $id)
            ->first();

        $faqs = Faq::where('faqable_type', $modelClass)
            ->where('faqable_id', $id)
            ->active()->ordered()->get();

        $geoMeta = GeoMeta::where('metable_type', $modelClass)
            ->where('metable_id', $id)
            ->first();

        $schemas = SeoSchema::where('metable_type', $modelClass)
            ->where('metable_id', $id)
            ->where('is_active', true)
            ->get();

        $faqSchema = $faqs->isNotEmpty() ? Faq::toFaqSchema($faqs) : null;

        return response()->json([
            'success' => true,
            'data' => $seoMeta,
            'faqs' => $faqs,
            'faq_schema' => $faqSchema,
            'geo_meta' => $geoMeta,
            'schemas' => $schemas->map(fn($s) => $s->toJsonLd()),
        ]);
    }

    /**
     * GET /admin/seo/content-types — Admin: list all supported content types.
     */
    public function contentTypes(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => SeoMeta::supportedTypes(),
        ]);
    }

    /**
     * GET /admin/seo/content/{type} — Admin: list all items of a content type with their SEO status.
     */
    public function adminIndex(Request $request, string $type): JsonResponse
    {
        $modelClass = SeoMeta::resolveModelType($type);

        if (!class_exists($modelClass)) {
            return response()->json(['success' => false, 'message' => 'Invalid content type.'], 400);
        }

        // Get all items of this content type
        $items = $modelClass::query()
            ->select('id', $this->getTitleColumn($type), $this->getIdentifierColumn($type))
            ->orderBy('id', 'desc')
            ->get();

        // Get existing SEO meta for these items
        $seoMetaMap = SeoMeta::where('metable_type', $modelClass)
            ->pluck('seo_title', 'metable_id')
            ->toArray();

        // Count FAQs per item
        $faqCounts = Faq::where('faqable_type', $modelClass)
            ->selectRaw('faqable_id, COUNT(*) as count')
            ->groupBy('faqable_id')
            ->pluck('count', 'faqable_id')
            ->toArray();

        // Annotate items with SEO status
        $data = $items->map(function ($item) use ($seoMetaMap, $faqCounts, $type) {
            $titleCol = $this->getTitleColumn($type);
            $identCol = $this->getIdentifierColumn($type);

            return [
                'id' => $item->id,
                'title' => $item->$titleCol ?? "Item #{$item->id}",
                'identifier' => $item->$identCol ?? null,
                'has_seo' => isset($seoMetaMap[$item->id]),
                'seo_title' => $seoMetaMap[$item->id] ?? null,
                'faq_count' => $faqCounts[$item->id] ?? 0,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
            'type' => $type,
            'model' => $modelClass,
        ]);
    }

    /**
     * PUT /admin/seo/content/{type}/{id} — Admin: create/update SEO meta for a content item.
     */
    public function upsert(SeoMetaRequest $request, string $type, int $id): JsonResponse
    {
        $modelClass = SeoMeta::resolveModelType($type);
        $data = $request->validated();
        $data['metable_type'] = $modelClass;
        $data['metable_id'] = $id;

        if (isset($data['custom_schema_json']) && is_string($data['custom_schema_json'])) {
            $data['custom_schema_json'] = json_decode($data['custom_schema_json'], true);
        }

        $seoMeta = SeoMeta::updateOrCreate(
            ['metable_type' => $modelClass, 'metable_id' => $id],
            $data
        );

        // Handle GEO meta if provided
        $geoFields = ['author_bio', 'references', 'sources', 'entity_keywords', 'structured_headings',
            'ai_readability_score', 'generative_search_score', 'eeat_score', 'content_score',
            'internal_linking_suggestions', 'publication_date', 'last_updated', 'reading_time'];

        $geoData = array_filter($request->only($geoFields), fn($v) => $v !== null);
        if (!empty($geoData)) {
            $geoData['metable_type'] = $modelClass;
            $geoData['metable_id'] = $id;

            // Decode JSON strings
            foreach (['references', 'sources', 'entity_keywords', 'structured_headings', 'internal_linking_suggestions'] as $jsonField) {
                if (isset($geoData[$jsonField]) && is_string($geoData[$jsonField])) {
                    $geoData[$jsonField] = json_decode($geoData[$jsonField], true);
                }
            }

            GeoMeta::updateOrCreate(
                ['metable_type' => $modelClass, 'metable_id' => $id],
                $geoData
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Content SEO updated successfully.',
            'data' => $seoMeta->fresh(),
        ]);
    }

    /**
     * GET /admin/seo/content/{type}/{id} — Admin: get full SEO/AEO/GEO data for a content item.
     */
    public function adminShow(string $type, int $id): JsonResponse
    {
        $modelClass = SeoMeta::resolveModelType($type);

        // Get the content item title
        $model = $modelClass::find($id);
        $titleCol = $this->getTitleColumn($type);
        $title = $model ? ($model->$titleCol ?? "Item #{$id}") : "Item #{$id}";

        $seoMeta = SeoMeta::where('metable_type', $modelClass)
            ->where('metable_id', $id)
            ->first();

        $faqs = Faq::where('faqable_type', $modelClass)
            ->where('faqable_id', $id)
            ->orderBy('sort_order')
            ->get();

        $geoMeta = GeoMeta::where('metable_type', $modelClass)
            ->where('metable_id', $id)
            ->first();

        $schemas = SeoSchema::where('metable_type', $modelClass)
            ->where('metable_id', $id)
            ->get();

        return response()->json([
            'success' => true,
            'item_title' => $title,
            'seo_meta' => $seoMeta,
            'faqs' => $faqs,
            'geo_meta' => $geoMeta,
            'schemas' => $schemas,
        ]);
    }

    // ── Private helpers ─────────────────────────────────────

    private function getTitleColumn(string $type): string
    {
        $map = [
            'news' => 'title',
            'program' => 'title',
            'event' => 'title',
            'announcement' => 'title',
            'faculty' => 'name',
            'testimonial' => 'name',
            'placement' => 'company_name',
            'scholarship' => 'title',
            'gallery' => 'title',
            'hero_slide' => 'title',
            'student_achievement' => 'title',
            'partner_university' => 'name',
            'download' => 'title',
        ];

        return $map[$type] ?? 'title';
    }

    private function getIdentifierColumn(string $type): string
    {
        $map = [
            'news' => 'slug',
            'program' => 'slug',
            'event' => 'slug',
            'faculty' => 'slug',
        ];

        return $map[$type] ?? 'id';
    }
}
