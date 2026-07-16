<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

class GalleryController extends Controller
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
        $query = Gallery::orderBy('sort_order', 'asc');

        if ($request->has('category')) {
            $query->byCategory($request->category);
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
     * Admin index
     */
    public function adminIndex(Request $request)
    {
        $this->authorize('create', Gallery::class);

        $query = Gallery::orderBy('sort_order', 'asc');

        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        $perPage = $request->get('per_page', 12);
        return response()->json($query->paginate($perPage));
    }

    /**
     * Admin store (Upload)
     */
    public function store(Request $request)
    {
        $this->authorize('create', Gallery::class);

        $request->validate([
            'title' => 'required|string|max:255',
            'image_file' => 'required|image|max:3072', // 3MB
            'category' => 'required|string|max:255',
            'alt_text' => 'nullable|string|max:255',
            'is_featured' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $imageUrl = FileUploadService::uploadImage(
            $request->file('image_file'),
            'gallery'
        );

        $gallery = Gallery::create([
            'title' => $request->title,
            'image_url' => $imageUrl,
            'thumbnail_url' => $imageUrl, // Simplification: use same URL or create thumbnail
            'category' => $request->category,
            'alt_text' => $request->alt_text ?? $request->title,
            'is_featured' => filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN),
            'sort_order' => $request->sort_order ?? 0,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $gallery,
            'message' => 'Image added to gallery successfully.',
        ], 201);
    }

    /**
     * Admin delete
     */
    public function destroy(int $id)
    {
        $gallery = Gallery::findOrFail($id);
        $this->authorize('delete', $gallery);

        FileUploadService::delete($gallery->image_url);
        $gallery->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Gallery image deleted successfully.',
        ]);
    }
}
