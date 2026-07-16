<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFacultyRequest;
use App\Models\Faculty;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    /**
     * Public active listing
     */
    public function index(Request $request)
    {
        $query = Faculty::active()->orderBy('sort_order', 'asc');

        if ($request->has('department')) {
            $query->byDepartment($request->department);
        }

        if ($request->has('distinguished')) {
            $query->distinguished();
        }

        return response()->json([
            'status' => 'success',
            'data' => $query->get(),
        ]);
    }

    /**
     * Public single view
     */
    public function show(string $slug)
    {
        $faculty = Faculty::where('slug', $slug)->active()->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $faculty,
        ]);
    }

    /**
     * Admin listing
     */
    public function adminIndex(Request $request)
    {
        $this->authorize('create', Faculty::class);

        $query = Faculty::orderBy('sort_order', 'asc');

        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('designation', 'like', "%{$request->search}%")
                  ->orWhere('department', 'like', "%{$request->search}%");
        }

        $perPage = $request->get('per_page', 10);
        return response()->json($query->paginate($perPage));
    }

    /**
     * Admin create
     */
    public function store(StoreFacultyRequest $request)
    {
        $this->authorize('create', Faculty::class);

        $data = $request->validated();

        if ($request->hasFile('photo_file')) {
            $data['photo'] = FileUploadService::uploadImage(
                $request->file('photo_file'),
                'faculty'
            );
        }

        $faculty = Faculty::create($data);

        return response()->json([
            'status' => 'success',
            'data' => $faculty,
            'message' => 'Faculty member added successfully.',
        ], 201);
    }

    /**
     * Admin update
     */
    public function update(StoreFacultyRequest $request, int $id)
    {
        $faculty = Faculty::findOrFail($id);
        $this->authorize('update', $faculty);

        $data = $request->validated();

        if ($request->hasFile('photo_file')) {
            FileUploadService::delete($faculty->photo);
            $data['photo'] = FileUploadService::uploadImage(
                $request->file('photo_file'),
                'faculty'
            );
        }

        $faculty->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $faculty,
            'message' => 'Faculty details updated successfully.',
        ]);
    }

    /**
     * Admin delete
     */
    public function destroy(int $id)
    {
        $faculty = Faculty::findOrFail($id);
        $this->authorize('delete', $faculty);

        FileUploadService::delete($faculty->photo);
        $faculty->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Faculty member removed successfully.',
        ]);
    }

    /**
     * Admin reorder sort order
     */
    public function reorder(Request $request)
    {
        $this->authorize('reorder', Faculty::class);

        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:faculty,id',
            'orders.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->orders as $item) {
            Faculty::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Faculty sorting updated successfully.',
        ]);
    }
}
