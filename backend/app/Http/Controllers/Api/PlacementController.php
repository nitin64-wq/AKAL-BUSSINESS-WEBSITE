<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Placement;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

class PlacementController extends Controller
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
        $query = Placement::orderBy('sort_order', 'asc');

        if ($request->has('featured')) {
            $query->featured();
        }

        if ($request->has('year')) {
            $query->byYear($request->year);
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
        $this->authorize('create', Placement::class);

        $query = Placement::orderBy('sort_order', 'asc');

        if ($request->has('search')) {
            $query->where('company_name', 'like', "%{$request->search}%")
                  ->orWhere('role_offered', 'like', "%{$request->search}%");
        }

        $perPage = $request->get('per_page', 15);
        return response()->json($query->paginate($perPage));
    }

    /**
     * Admin store
     */
    public function store(Request $request)
    {
        $this->authorize('create', Placement::class);

        $data = $request->validate([
            'company_name' => 'required|string|max:255',
            'logo_file' => 'nullable|image|max:2048',
            'role_offered' => 'nullable|string|max:255',
            'package_lpa' => 'nullable|numeric|min:0',
            'year' => 'required|integer|min:2000|max:2100',
            'placement_type' => 'required|in:Campus,Internship,PPO',
            'is_featured' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if ($request->hasFile('logo_file')) {
            $data['company_logo'] = FileUploadService::uploadImage(
                $request->file('logo_file'),
                'placements'
            );
        }

        $placement = Placement::create($data);

        return response()->json([
            'status' => 'success',
            'data' => $placement,
            'message' => 'Placement record added successfully.',
        ], 201);
    }

    /**
     * Admin update
     */
    public function update(Request $request, int $id)
    {
        $placement = Placement::findOrFail($id);
        $this->authorize('update', $placement);

        $data = $request->validate([
            'company_name' => 'required|string|max:255',
            'logo_file' => 'nullable|image|max:2048',
            'role_offered' => 'nullable|string|max:255',
            'package_lpa' => 'nullable|numeric|min:0',
            'year' => 'required|integer|min:2000|max:2100',
            'placement_type' => 'required|in:Campus,Internship,PPO',
            'is_featured' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if ($request->hasFile('logo_file')) {
            FileUploadService::delete($placement->company_logo);
            $data['company_logo'] = FileUploadService::uploadImage(
                $request->file('logo_file'),
                'placements'
            );
        }

        $placement->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $placement,
            'message' => 'Placement record updated successfully.',
        ]);
    }

    /**
     * Admin delete
     */
    public function destroy(int $id)
    {
        $placement = Placement::findOrFail($id);
        $this->authorize('delete', $placement);

        FileUploadService::delete($placement->company_logo);
        $placement->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Placement record deleted successfully.',
        ]);
    }
}
