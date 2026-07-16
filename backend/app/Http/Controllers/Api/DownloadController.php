<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Download;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

class DownloadController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index']);
    }

    /**
     * Public index
     */
    public function index()
    {
        $downloads = Download::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $downloads,
        ]);
    }

    /**
     * Admin index
     */
    public function adminIndex(Request $request)
    {
        $this->authorize('create', Download::class);

        $query = Download::orderBy('sort_order', 'asc');

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%")
                  ->orWhere('type', 'like', "%{$request->search}%");
        }

        $perPage = $request->get('per_page', 15);
        return response()->json($query->paginate($perPage));
    }

    /**
     * Admin store
     */
    public function store(Request $request)
    {
        $this->authorize('create', Download::class);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'required|file|max:10240', // Max 10MB
            'type' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('file')) {
            $uploadedFile = $request->file('file');
            
            // Auto compute file size
            $bytes = $uploadedFile->getSize();
            if ($bytes >= 1048576) {
                $fileSize = number_format($bytes / 1048576, 1) . ' MB';
            } elseif ($bytes >= 1024) {
                $fileSize = number_format($bytes / 1024, 0) . ' KB';
            } else {
                $fileSize = $bytes . ' B';
            }
            $data['file_size'] = $fileSize;

            // Auto compute file extension
            if (!isset($data['type']) || empty($data['type'])) {
                $data['type'] = strtoupper($uploadedFile->getClientOriginalExtension());
            }

            // Upload
            $data['file_path'] = FileUploadService::uploadDocument($uploadedFile, 'downloads');
        }

        if (isset($data['is_active'])) {
            $data['is_active'] = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN);
        } else {
            $data['is_active'] = true;
        }

        if (!isset($data['sort_order'])) {
            $data['sort_order'] = 0;
        }

        $download = Download::create($data);

        return response()->json([
            'status' => 'success',
            'data' => $download,
            'message' => 'Download resource added successfully.',
        ], 201);
    }

    /**
     * Admin update
     */
    public function update(Request $request, int $id)
    {
        $download = Download::findOrFail($id);
        $this->authorize('update', $download);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'nullable|file|max:10240', // Max 10MB
            'type' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('file')) {
            // Delete old file
            FileUploadService::delete($download->file_path);

            $uploadedFile = $request->file('file');
            
            // Auto compute file size
            $bytes = $uploadedFile->getSize();
            if ($bytes >= 1048576) {
                $fileSize = number_format($bytes / 1048576, 1) . ' MB';
            } elseif ($bytes >= 1024) {
                $fileSize = number_format($bytes / 1024, 0) . ' KB';
            } else {
                $fileSize = $bytes . ' B';
            }
            $data['file_size'] = $fileSize;

            // Auto compute file extension
            if (!isset($data['type']) || empty($data['type'])) {
                $data['type'] = strtoupper($uploadedFile->getClientOriginalExtension());
            }

            // Upload new file
            $data['file_path'] = FileUploadService::uploadDocument($uploadedFile, 'downloads');
        }

        if (isset($data['is_active'])) {
            $data['is_active'] = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN);
        }

        $download->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $download,
            'message' => 'Download resource updated successfully.',
        ]);
    }

    /**
     * Admin delete
     */
    public function destroy(int $id)
    {
        $download = Download::findOrFail($id);
        $this->authorize('delete', $download);

        FileUploadService::delete($download->file_path);
        $download->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Download resource deleted successfully.',
        ]);
    }
}
