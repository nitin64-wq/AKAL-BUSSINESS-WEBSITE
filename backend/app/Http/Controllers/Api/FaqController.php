<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FaqRequest;
use App\Models\Faq;
use App\Models\SeoMeta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    /**
     * GET /seo/faqs — Public: get FAQs with optional filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Faq::active()->ordered();

        // Filter by static page
        if ($request->has('page_seo_id')) {
            $query->where('page_seo_id', $request->input('page_seo_id'));
        }

        // Filter by page identifier (convenience)
        if ($request->has('page')) {
            $query->whereHas('pageSeo', function ($q) use ($request) {
                $q->where('page_identifier', $request->input('page'));
            });
        }

        // Filter by content type + id
        if ($request->has('type') && $request->has('id')) {
            $modelClass = SeoMeta::resolveModelType($request->input('type'));
            $query->where('faqable_type', $modelClass)
                  ->where('faqable_id', $request->input('id'));
        }

        $faqs = $query->get();
        $faqSchema = $faqs->isNotEmpty() ? Faq::toFaqSchema($faqs) : null;

        return response()->json([
            'success' => true,
            'data' => $faqs,
            'schema' => $faqSchema,
        ]);
    }

    /**
     * GET /admin/seo/faqs — Admin: list all FAQs.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Faq::query()->orderBy('sort_order');

        if ($request->has('page_seo_id')) {
            $query->where('page_seo_id', $request->input('page_seo_id'));
        }

        if ($request->has('type') && $request->has('id')) {
            $modelClass = SeoMeta::resolveModelType($request->input('type'));
            $query->where('faqable_type', $modelClass)
                  ->where('faqable_id', $request->input('id'));
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('question', 'like', "%{$search}%")
                  ->orWhere('answer', 'like', "%{$search}%");
            });
        }

        $faqs = $query->get();

        return response()->json([
            'success' => true,
            'data' => $faqs,
        ]);
    }

    /**
     * POST /admin/seo/faqs — Admin: create FAQ.
     */
    public function store(FaqRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Resolve model type if provided
        if (isset($data['faqable_type']) && !str_contains($data['faqable_type'], '\\')) {
            $data['faqable_type'] = SeoMeta::resolveModelType($data['faqable_type']);
        }

        // Auto-set sort order
        if (!isset($data['sort_order'])) {
            $maxOrder = Faq::query();
            if (isset($data['page_seo_id'])) {
                $maxOrder->where('page_seo_id', $data['page_seo_id']);
            } elseif (isset($data['faqable_type'], $data['faqable_id'])) {
                $maxOrder->where('faqable_type', $data['faqable_type'])
                         ->where('faqable_id', $data['faqable_id']);
            }
            $data['sort_order'] = ($maxOrder->max('sort_order') ?? 0) + 1;
        }

        $faq = Faq::create($data);

        return response()->json([
            'success' => true,
            'message' => 'FAQ created successfully.',
            'data' => $faq,
        ], 201);
    }

    /**
     * PUT /admin/seo/faqs/{id} — Admin: update FAQ.
     */
    public function update(FaqRequest $request, int $id): JsonResponse
    {
        $faq = Faq::findOrFail($id);
        $data = $request->validated();

        if (isset($data['faqable_type']) && !str_contains($data['faqable_type'], '\\')) {
            $data['faqable_type'] = SeoMeta::resolveModelType($data['faqable_type']);
        }

        $faq->update($data);

        return response()->json([
            'success' => true,
            'message' => 'FAQ updated successfully.',
            'data' => $faq->fresh(),
        ]);
    }

    /**
     * DELETE /admin/seo/faqs/{id} — Admin: delete FAQ.
     */
    public function destroy(int $id): JsonResponse
    {
        $faq = Faq::findOrFail($id);
        $faq->delete();

        return response()->json([
            'success' => true,
            'message' => 'FAQ deleted successfully.',
        ]);
    }

    /**
     * POST /admin/seo/faqs/reorder — Admin: reorder FAQs.
     */
    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'order' => 'required|array',
            'order.*.id' => 'required|integer|exists:faqs,id',
            'order.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($request->input('order') as $item) {
            Faq::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'FAQs reordered successfully.',
        ]);
    }
}
