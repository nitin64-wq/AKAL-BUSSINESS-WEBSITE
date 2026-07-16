<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroSlide;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

class HeroSlideController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index']);
    }

    /**
     * Public list of active slides
     */
    public function index()
    {
        $slides = HeroSlide::active()->ordered()->get();

        return response()->json([
            'status' => 'success',
            'data' => $slides,
        ]);
    }

    /**
     * Admin index (Paginated list of all slides)
     */
    public function adminIndex(Request $request)
    {
        $this->authorize('create', HeroSlide::class);

        $query = HeroSlide::ordered();

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%")
                  ->orWhere('title_highlight', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
        }

        $perPage = $request->get('per_page', 15);
        return response()->json($query->paginate($perPage));
    }

    /**
     * Store a new hero slide
     */
    public function store(Request $request)
    {
        $this->authorize('create', HeroSlide::class);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'title_highlight' => 'required|string|max:255',
            'description' => 'required|string',
            'badge' => 'nullable|string|max:255',
            'slide_image' => 'nullable|image|max:3072',
            'primary_btn_text' => 'nullable|string|max:100',
            'primary_btn_link' => 'nullable|string|max:500',
            'secondary_btn_text' => 'nullable|string|max:100',
            'secondary_btn_link' => 'nullable|string|max:500',
            'float_card_num' => 'nullable|string|max:50',
            'float_card_label' => 'nullable|string|max:100',
            'float_card_icon' => 'nullable|in:Award,Target',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        // Default buttons if empty
        if (empty($data['primary_btn_text'])) $data['primary_btn_text'] = 'Apply Now';
        if (empty($data['primary_btn_link'])) $data['primary_btn_link'] = '/admissions/apply';
        if (empty($data['secondary_btn_text'])) $data['secondary_btn_text'] = 'Explore Programs';
        if (empty($data['secondary_btn_link'])) $data['secondary_btn_link'] = '/academics';
        if (!isset($data['is_active'])) $data['is_active'] = true;
        if (!isset($data['sort_order'])) $data['sort_order'] = 0;

        if ($request->hasFile('slide_image')) {
            $data['image'] = FileUploadService::uploadImage(
                $request->file('slide_image'),
                'hero'
            );
        }

        $slide = HeroSlide::create($data);

        return response()->json([
            'status' => 'success',
            'data' => $slide,
            'message' => 'Hero slide created successfully.',
        ], 201);
    }

    /**
     * Update an existing hero slide
     */
    public function update(Request $request, int $id)
    {
        $slide = HeroSlide::findOrFail($id);
        $this->authorize('update', $slide);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'title_highlight' => 'required|string|max:255',
            'description' => 'required|string',
            'badge' => 'nullable|string|max:255',
            'slide_image' => 'nullable|image|max:3072',
            'primary_btn_text' => 'nullable|string|max:100',
            'primary_btn_link' => 'nullable|string|max:500',
            'secondary_btn_text' => 'nullable|string|max:100',
            'secondary_btn_link' => 'nullable|string|max:500',
            'float_card_num' => 'nullable|string|max:50',
            'float_card_label' => 'nullable|string|max:100',
            'float_card_icon' => 'nullable|in:Award,Target',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        // Normalize is_active since form data might send it as string '0' or '1'
        if (isset($data['is_active'])) {
            $data['is_active'] = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('slide_image')) {
            FileUploadService::delete($slide->image);
            $data['image'] = FileUploadService::uploadImage(
                $request->file('slide_image'),
                'hero'
            );
        }

        $slide->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $slide,
            'message' => 'Hero slide updated successfully.',
        ]);
    }

    /**
     * Delete a hero slide
     */
    public function destroy(int $id)
    {
        $slide = HeroSlide::findOrFail($id);
        $this->authorize('delete', $slide);

        // Delete associated image file
        FileUploadService::delete($slide->image);
        $slide->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Hero slide deleted successfully.',
        ]);
    }
}
