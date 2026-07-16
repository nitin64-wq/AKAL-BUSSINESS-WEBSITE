<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    /**
     * Public list
     */
    public function index(Request $request)
    {
        $query = Event::published()->orderBy('event_date', 'asc');

        if ($request->has('upcoming')) {
            $query->upcoming();
        }

        if ($request->has('featured')) {
            $query->featured();
        }

        return response()->json([
            'status' => 'success',
            'data' => $query->get(),
        ]);
    }

    /**
     * Public show detail
     */
    public function show(string $slug)
    {
        $event = Event::where('slug', $slug)->published()->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $event,
        ]);
    }

    /**
     * Admin index
     */
    public function adminIndex(Request $request)
    {
        $this->authorize('create', Event::class);

        $query = Event::orderBy('event_date', 'desc');

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $perPage = $request->get('per_page', 10);
        return response()->json($query->paginate($perPage));
    }

    /**
     * Admin create
     */
    public function store(Request $request)
    {
        $this->authorize('create', Event::class);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'event_date' => 'required|date',
            'event_time' => 'nullable|string',
            'venue' => 'nullable|string|max:255',
            'cover_image_file' => 'nullable|image|max:2048',
            'registration_url' => 'nullable|url|max:255',
            'is_upcoming' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'is_published' => 'nullable|boolean',
        ]);

        if ($request->hasFile('cover_image_file')) {
            $data['cover_image'] = FileUploadService::uploadImage(
                $request->file('cover_image_file'),
                'events'
            );
        }

        $event = Event::create($data);

        return response()->json([
            'status' => 'success',
            'data' => $event,
            'message' => 'Event created successfully.',
        ], 201);
    }

    /**
     * Admin update
     */
    public function update(Request $request, int $id)
    {
        $event = Event::findOrFail($id);
        $this->authorize('update', $event);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'event_date' => 'required|date',
            'event_time' => 'nullable|string',
            'venue' => 'nullable|string|max:255',
            'cover_image_file' => 'nullable|image|max:2048',
            'registration_url' => 'nullable|url|max:255',
            'is_upcoming' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'is_published' => 'nullable|boolean',
        ]);

        if ($request->hasFile('cover_image_file')) {
            FileUploadService::delete($event->cover_image);
            $data['cover_image'] = FileUploadService::uploadImage(
                $request->file('cover_image_file'),
                'events'
            );
        }

        $event->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $event,
            'message' => 'Event updated successfully.',
        ]);
    }

    /**
     * Admin delete
     */
    public function destroy(int $id)
    {
        $event = Event::findOrFail($id);
        $this->authorize('delete', $event);

        FileUploadService::delete($event->cover_image);
        $event->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Event deleted successfully.',
        ]);
    }
}
