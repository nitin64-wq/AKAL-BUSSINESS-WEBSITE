<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

class TestimonialController extends Controller
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
        $query = Testimonial::active()->orderBy('sort_order', 'asc');

        if ($request->has('featured')) {
            $query->featured();
        }

        return response()->json([
            'status' => 'success',
            'data' => $query->get(),
        ]);
    }

    /**
     * Admin Index
     */
    public function adminIndex(Request $request)
    {
        $this->authorize('create', Testimonial::class);

        $query = Testimonial::orderBy('sort_order', 'asc');

        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('company', 'like', "%{$request->search}%");
        }

        $perPage = $request->get('per_page', 10);
        return response()->json($query->paginate($perPage));
    }

    /**
     * Admin Create
     */
    public function store(Request $request)
    {
        $this->authorize('create', Testimonial::class);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'quote' => 'required|string|max:1000',
            'rating' => 'required|integer|min:1|max:5',
            'batch_year' => 'nullable|integer|min:2000|max:2099',
            'photo_file' => 'nullable|image|max:2048',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if ($request->hasFile('photo_file')) {
            $data['photo'] = FileUploadService::uploadImage(
                $request->file('photo_file'),
                'testimonials'
            );
        }

        $testimonial = Testimonial::create($data);

        return response()->json([
            'status' => 'success',
            'data' => $testimonial,
            'message' => 'Testimonial created successfully.',
        ], 201);
    }

    /**
     * Admin Update
     */
    public function update(Request $request, int $id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $this->authorize('update', $testimonial);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'quote' => 'required|string|max:1000',
            'rating' => 'required|integer|min:1|max:5',
            'batch_year' => 'nullable|integer|min:2000|max:2099',
            'photo_file' => 'nullable|image|max:2048',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if ($request->hasFile('photo_file')) {
            FileUploadService::delete($testimonial->photo);
            $data['photo'] = FileUploadService::uploadImage(
                $request->file('photo_file'),
                'testimonials'
            );
        }

        $testimonial->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $testimonial,
            'message' => 'Testimonial updated successfully.',
        ]);
    }

    /**
     * Admin Delete
     */
    public function destroy(int $id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $this->authorize('delete', $testimonial);

        FileUploadService::delete($testimonial->photo);
        $testimonial->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Testimonial deleted successfully.',
        ]);
    }
}
