<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SeoSchema;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeoSchemaController extends Controller
{
    /**
     * GET /seo/schemas — Public: get all active global schemas.
     */
    public function index(): JsonResponse
    {
        $schemas = SeoSchema::active()->global()->orderBy('sort_order')->get();

        return response()->json([
            'success' => true,
            'data' => $schemas->map(fn($s) => $s->toJsonLd()),
        ]);
    }

    /**
     * GET /admin/seo/schemas — Admin: list all schemas.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = SeoSchema::query()->orderBy('sort_order');

        if ($request->has('type')) {
            $query->where('schema_type', $request->input('type'));
        }

        if ($request->has('global_only') && $request->boolean('global_only')) {
            $query->where('is_global', true);
        }

        $schemas = $query->get();

        return response()->json([
            'success' => true,
            'data' => $schemas,
            'schema_types' => SeoSchema::SCHEMA_TYPES,
        ]);
    }

    /**
     * POST /admin/seo/schemas — Admin: create schema.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'schema_type' => 'required|string|max:50',
            'json_data' => 'required',
            'page_seo_id' => 'nullable|integer|exists:page_seo,id',
            'metable_type' => 'nullable|string|max:100',
            'metable_id' => 'nullable|integer',
            'is_global' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (is_string($validated['json_data'])) {
            $validated['json_data'] = json_decode($validated['json_data'], true);
        }

        $schema = SeoSchema::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Schema created successfully.',
            'data' => $schema,
        ], 201);
    }

    /**
     * PUT /admin/seo/schemas/{id} — Admin: update schema.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $schema = SeoSchema::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'schema_type' => 'sometimes|string|max:50',
            'json_data' => 'sometimes',
            'page_seo_id' => 'nullable|integer|exists:page_seo,id',
            'metable_type' => 'nullable|string|max:100',
            'metable_id' => 'nullable|integer',
            'is_global' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (isset($validated['json_data']) && is_string($validated['json_data'])) {
            $validated['json_data'] = json_decode($validated['json_data'], true);
        }

        $schema->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Schema updated successfully.',
            'data' => $schema->fresh(),
        ]);
    }

    /**
     * DELETE /admin/seo/schemas/{id} — Admin: delete schema.
     */
    public function destroy(int $id): JsonResponse
    {
        $schema = SeoSchema::findOrFail($id);
        $schema->delete();

        return response()->json([
            'success' => true,
            'message' => 'Schema deleted successfully.',
        ]);
    }
}
