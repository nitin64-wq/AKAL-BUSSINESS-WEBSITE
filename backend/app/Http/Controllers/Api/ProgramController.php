<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProgramRequest;
use App\Models\Program;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function __construct()
    {
        // Require auth and policy validation on modifying endpoints
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    /**
     * Public listing of active programs
     */
    public function index(Request $request)
    {
        $query = Program::active()->orderBy('sort_order', 'asc');

        if ($request->has('type')) {
            $query->byType($request->type);
        }

        return response()->json([
            'status' => 'success',
            'data' => $query->get(),
        ]);
    }

    /**
     * Public detail view of a single program
     */
    public function show(string $slug)
    {
        $program = Program::where('slug', $slug)->active()->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $program,
        ]);
    }

    /**
     * Admin paginated listing
     */
    public function adminIndex(Request $request)
    {
        $this->authorize('create', Program::class);

        $query = Program::orderBy('sort_order', 'asc');

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $perPage = $request->get('per_page', 10);
        return response()->json($query->paginate($perPage));
    }

    /**
     * Admin create program
     */
    public function store(StoreProgramRequest $request)
    {
        $this->authorize('create', Program::class);

        $data = $request->validated();

        // Handle file uploads
        if ($request->hasFile('cover_image_file')) {
            $data['cover_image'] = FileUploadService::uploadImage(
                $request->file('cover_image_file'),
                'programs'
            );
        }

        if ($request->hasFile('brochure_file')) {
            $data['brochure_url'] = FileUploadService::uploadDocument(
                $request->file('brochure_file'),
                'brochures'
            );
        }

        $program = Program::create($data);

        return response()->json([
            'status' => 'success',
            'data' => $program,
            'message' => 'Program created successfully.',
        ], 201);
    }

    /**
     * Admin update program
     * Laravel sometimes has trouble parsing PUT requests with multipart form data.
     * We support POST with _method=PUT, or standard PUT requests.
     */
    public function update(StoreProgramRequest $request, int $id)
    {
        $program = Program::findOrFail($id);
        $this->authorize('update', $program);

        $data = $request->validated();

        // Handle cover image replacement
        if ($request->hasFile('cover_image_file')) {
            FileUploadService::delete($program->cover_image);
            $data['cover_image'] = FileUploadService::uploadImage(
                $request->file('cover_image_file'),
                'programs'
            );
        }

        // Handle brochure replacement
        if ($request->hasFile('brochure_file')) {
            FileUploadService::delete($program->brochure_url);
            $data['brochure_url'] = FileUploadService::uploadDocument(
                $request->file('brochure_file'),
                'brochures'
            );
        }

        $program->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $program,
            'message' => 'Program updated successfully.',
        ]);
    }

    /**
     * Admin delete program
     */
    public function destroy(int $id)
    {
        $program = Program::findOrFail($id);
        $this->authorize('delete', $program);

        // Delete associated files
        FileUploadService::delete($program->cover_image);
        FileUploadService::delete($program->brochure_url);

        $program->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Program deleted successfully.',
        ]);
    }

    /**
     * Admin toggle active status
     */
    public function toggleActive(int $id)
    {
        $program = Program::findOrFail($id);
        $this->authorize('toggleActive', $program);

        $program->is_active = !$program->is_active;
        $program->save();

        return response()->json([
            'status' => 'success',
            'data' => $program,
            'message' => 'Program status updated successfully.',
        ]);
    }
}
