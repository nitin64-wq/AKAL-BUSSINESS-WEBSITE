<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PageSeoRequest;
use App\Models\PageSeo;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageSeoController extends Controller
{
    /**
     * GET /seo/pages/{identifier} — Public: get page SEO by identifier/slug.
     */
    public function show(string $identifier): JsonResponse
    {
        $page = PageSeo::with(['schemas' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order');
            }, 'geoMeta'])
            ->where('page_identifier', $identifier)
            ->orWhere('slug', $identifier)
            ->first();

        if (!$page) {
            return response()->json(['success' => false, 'message' => 'Page SEO not found.'], 404);
        }

        // Attach FAQs
        $faqs = Faq::where('page_seo_id', $page->id)->active()->ordered()->get();

        // Build FAQ schema if FAQs exist
        $faqSchema = $faqs->isNotEmpty() ? Faq::toFaqSchema($faqs) : null;

        return response()->json([
            'success' => true,
            'data' => $page,
            'faqs' => $faqs,
            'faq_schema' => $faqSchema,
        ]);
    }

    /**
     * GET /admin/seo/pages — Admin: list all page SEO entries.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = PageSeo::query()->orderBy('page_identifier');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('page_identifier', 'like', "%{$search}%")
                  ->orWhere('seo_title', 'like', "%{$search}%")
                  ->orWhere('page_title', 'like', "%{$search}%");
            });
        }

        $pages = $query->get();

        return response()->json([
            'success' => true,
            'data' => $pages,
        ]);
    }

    /**
     * POST /admin/seo/pages — Admin: create page SEO.
     */
    public function store(PageSeoRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (isset($data['custom_schema_json']) && is_string($data['custom_schema_json'])) {
            $data['custom_schema_json'] = json_decode($data['custom_schema_json'], true);
        }

        $page = PageSeo::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Page SEO created successfully.',
            'data' => $page,
        ], 201);
    }

    /**
     * PUT /admin/seo/pages/{id} — Admin: update page SEO.
     */
    public function update(PageSeoRequest $request, int $id): JsonResponse
    {
        $page = PageSeo::findOrFail($id);
        $data = $request->validated();

        if (isset($data['custom_schema_json']) && is_string($data['custom_schema_json'])) {
            $data['custom_schema_json'] = json_decode($data['custom_schema_json'], true);
        }

        $page->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Page SEO updated successfully.',
            'data' => $page->fresh(),
        ]);
    }

    /**
     * DELETE /admin/seo/pages/{id} — Admin: delete page SEO.
     */
    public function destroy(int $id): JsonResponse
    {
        $page = PageSeo::findOrFail($id);
        $page->delete();

        return response()->json([
            'success' => true,
            'message' => 'Page SEO deleted successfully.',
        ]);
    }
}
