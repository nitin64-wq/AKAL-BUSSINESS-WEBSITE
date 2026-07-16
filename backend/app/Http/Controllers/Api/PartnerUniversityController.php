<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PartnerUniversity;
use Illuminate\Http\Request;

class PartnerUniversityController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index']);
    }

    /**
     * Public list
     */
    public function index()
    {
        $universities = PartnerUniversity::active()->ordered()->get();

        return response()->json([
            'status' => 'success',
            'data' => $universities,
        ]);
    }

    /**
     * Admin index
     */
    public function adminIndex(Request $request)
    {
        $this->authorize('create', PartnerUniversity::class);

        $query = PartnerUniversity::ordered();

        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
        }

        $perPage = $request->get('per_page', 15);
        return response()->json($query->paginate($perPage));
    }

    /**
     * Store
     */
    public function store(Request $request)
    {
        $this->authorize('create', PartnerUniversity::class);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'logo_icon' => 'required|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if (!isset($data['is_active'])) $data['is_active'] = true;
        if (!isset($data['sort_order'])) $data['sort_order'] = 0;

        $uni = PartnerUniversity::create($data);

        return response()->json([
            'status' => 'success',
            'data' => $uni,
            'message' => 'Partner university added successfully.',
        ], 201);
    }

    /**
     * Update
     */
    public function update(Request $request, int $id)
    {
        $uni = PartnerUniversity::findOrFail($id);
        $this->authorize('update', $uni);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'logo_icon' => 'required|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if (isset($data['is_active'])) {
            $data['is_active'] = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN);
        }

        $uni->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $uni,
            'message' => 'Partner university updated successfully.',
        ]);
    }

    /**
     * Destroy
     */
    public function destroy(int $id)
    {
        $uni = PartnerUniversity::findOrFail($id);
        $this->authorize('delete', $uni);

        $uni->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Partner university deleted successfully.',
        ]);
    }
}
