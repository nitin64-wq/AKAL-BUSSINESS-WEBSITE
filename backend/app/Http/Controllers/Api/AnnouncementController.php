<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index']);
    }

    /**
     * Display a listing of the active announcements.
     */
    public function index()
    {
        $announcements = Announcement::active()
            ->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $announcements,
        ]);
    }

    /**
     * Display a listing of all announcements for admin panel.
     */
    public function adminIndex()
    {
        $this->authorize('viewAny', Announcement::class);

        $announcements = Announcement::orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $announcements,
        ]);
    }

    /**
     * Store a newly created announcement.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Announcement::class);

        $validated = $request->validate([
            'text' => 'required|string|max:255',
            'type' => 'required|string|in:General,Admission,Event,Placement,News',
            'link' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'show_as_card' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $announcement = Announcement::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Announcement created successfully.',
            'data' => $announcement,
        ], 211);
    }

    /**
     * Update the specified announcement.
     */
    public function update(Request $request, int $id)
    {
        $announcement = Announcement::findOrFail($id);
        $this->authorize('update', $announcement);

        $validated = $request->validate([
            'text' => 'required|string|max:255',
            'type' => 'required|string|in:General,Admission,Event,Placement,News',
            'link' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'show_as_card' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $announcement->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Announcement updated successfully.',
            'data' => $announcement,
        ]);
    }

    /**
     * Remove the specified announcement.
     */
    public function destroy(int $id)
    {
        $announcement = Announcement::findOrFail($id);
        $this->authorize('delete', $announcement);

        $announcement->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Announcement deleted successfully.',
        ]);
    }
}
