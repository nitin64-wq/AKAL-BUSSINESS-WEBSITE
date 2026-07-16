<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentAchievement;
use Illuminate\Http\Request;

class StudentAchievementController extends Controller
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
        $achievements = StudentAchievement::active()->ordered()->get();

        return response()->json([
            'status' => 'success',
            'data' => $achievements,
        ]);
    }

    /**
     * Admin index
     */
    public function adminIndex(Request $request)
    {
        $this->authorize('create', StudentAchievement::class);

        $query = StudentAchievement::ordered();

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%")
                  ->orWhere('badge', 'like', "%{$request->search}%");
        }

        $perPage = $request->get('per_page', 15);
        return response()->json($query->paginate($perPage));
    }

    /**
     * Store
     */
    public function store(Request $request)
    {
        $this->authorize('create', StudentAchievement::class);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'badge' => 'nullable|string|max:100',
            'highlight' => 'nullable|string|max:100',
            'icon' => 'required|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if (!isset($data['is_active'])) $data['is_active'] = true;
        if (!isset($data['sort_order'])) $data['sort_order'] = 0;

        $achievement = StudentAchievement::create($data);

        return response()->json([
            'status' => 'success',
            'data' => $achievement,
            'message' => 'Student achievement added successfully.',
        ], 201);
    }

    /**
     * Update
     */
    public function update(Request $request, int $id)
    {
        $achievement = StudentAchievement::findOrFail($id);
        $this->authorize('update', $achievement);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'badge' => 'nullable|string|max:100',
            'highlight' => 'nullable|string|max:100',
            'icon' => 'required|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if (isset($data['is_active'])) {
            $data['is_active'] = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN);
        }

        $achievement->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $achievement,
            'message' => 'Student achievement updated successfully.',
        ]);
    }

    /**
     * Destroy
     */
    public function destroy(int $id)
    {
        $achievement = StudentAchievement::findOrFail($id);
        $this->authorize('delete', $achievement);

        $achievement->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Student achievement deleted successfully.',
        ]);
    }
}
