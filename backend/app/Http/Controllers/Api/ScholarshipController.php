<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Scholarship;
use Illuminate\Http\Request;

class ScholarshipController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index']);
    }

    /**
     * Public list
     */
    public function index(Request $request)
    {
        $query = Scholarship::active()->orderBy('sort_order', 'asc');

        return response()->json([
            'status' => 'success',
            'data' => $query->get(),
        ]);
    }

    /**
     * Admin index
     */
    public function adminIndex(Request $request)
    {
        $this->authorize('create', Scholarship::class);

        $query = Scholarship::orderBy('sort_order', 'asc');

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%")
                  ->orWhere('type', 'like', "%{$request->search}%");
        }

        $perPage = $request->get('per_page', 10);
        return response()->json($query->paginate($perPage));
    }

    /**
     * Admin store
     */
    public function store(Request $request)
    {
        $this->authorize('create', Scholarship::class);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:Merit,Need-Based,Sports,Research,International',
            'description' => 'required|string|max:2000',
            'eligibility' => 'nullable|string|max:1000',
            'amount_percent' => 'nullable|integer|min:1|max:100',
            'max_amount' => 'nullable|numeric|min:0',
            'application_deadline' => 'nullable|date',
            'icon' => 'nullable|string|max:50',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $scholarship = Scholarship::create($data);

        return response()->json([
            'status' => 'success',
            'data' => $scholarship,
            'message' => 'Scholarship record added successfully.',
        ], 201);
    }

    /**
     * Admin update
     */
    public function update(Request $request, int $id)
    {
        $scholarship = Scholarship::findOrFail($id);
        $this->authorize('update', $scholarship);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:Merit,Need-Based,Sports,Research,International',
            'description' => 'required|string|max:2000',
            'eligibility' => 'nullable|string|max:1000',
            'amount_percent' => 'nullable|integer|min:1|max:100',
            'max_amount' => 'nullable|numeric|min:0',
            'application_deadline' => 'nullable|date',
            'icon' => 'nullable|string|max:50',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $scholarship->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $scholarship,
            'message' => 'Scholarship record updated successfully.',
        ]);
    }

    /**
     * Admin delete
     */
    public function destroy(int $id)
    {
        $scholarship = Scholarship::findOrFail($id);
        $this->authorize('delete', $scholarship);

        $scholarship->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Scholarship record deleted successfully.',
        ]);
    }
}
