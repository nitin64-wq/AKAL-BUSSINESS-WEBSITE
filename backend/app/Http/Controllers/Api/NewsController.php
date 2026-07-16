<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNewsRequest;
use App\Models\News;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NewsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    /**
     * Public published news list
     */
    public function index(Request $request)
    {
        $query = News::published()->with('author:id,name,avatar')->orderBy('published_at', 'desc');

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
     * Public show article
     */
    public function show(string $slug)
    {
        $news = News::where('slug', $slug)->published()->firstOrFail();
        
        // Increment view counter
        $news->increment('views');

        return response()->json([
            'status' => 'success',
            'data' => $news,
        ]);
    }

    /**
     * Admin index
     */
    public function adminIndex(Request $request)
    {
        $this->authorize('create', News::class);

        $query = News::with('author:id,name')->orderBy('created_at', 'desc');

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        $perPage = $request->get('per_page', 10);
        return response()->json($query->paginate($perPage));
    }

    /**
     * Admin create news
     */
    public function store(StoreNewsRequest $request)
    {
        $this->authorize('create', News::class);

        $data = $request->validated();
        $data['author_id'] = Auth::id();

        if ($request->hasFile('cover_image_file')) {
            $data['cover_image'] = FileUploadService::uploadImage(
                $request->file('cover_image_file'),
                'news'
            );
        }

        if (isset($data['is_published']) && $data['is_published'] && !isset($data['published_at'])) {
            $data['published_at'] = now();
        }

        $news = News::create($data);

        return response()->json([
            'status' => 'success',
            'data' => $news,
            'message' => 'News article created successfully.',
        ], 201);
    }

    /**
     * Admin update news
     */
    public function update(StoreNewsRequest $request, int $id)
    {
        $news = News::findOrFail($id);
        $this->authorize('update', $news);

        $data = $request->validated();

        if ($request->hasFile('cover_image_file')) {
            FileUploadService::delete($news->cover_image);
            $data['cover_image'] = FileUploadService::uploadImage(
                $request->file('cover_image_file'),
                'news'
            );
        }

        // Manage published timestamp
        if (isset($data['is_published'])) {
            if ($data['is_published'] && !$news->is_published) {
                $data['published_at'] = now();
            } elseif (!$data['is_published']) {
                $data['published_at'] = null;
            }
        }

        $news->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $news,
            'message' => 'News article updated successfully.',
        ]);
    }

    /**
     * Admin delete news
     */
    public function destroy(int $id)
    {
        $news = News::findOrFail($id);
        $this->authorize('delete', $news);

        FileUploadService::delete($news->cover_image);
        $news->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'News article deleted successfully.',
        ]);
    }

    /**
     * Publish toggle
     */
    public function publish(Request $request, int $id)
    {
        $news = News::findOrFail($id);
        $this->authorize('publish', $news);

        $request->validate(['is_published' => 'required|boolean']);

        $news->is_published = $request->is_published;
        $news->published_at = $request->is_published ? now() : null;
        $news->save();

        return response()->json([
            'status' => 'success',
            'data' => $news,
            'message' => 'Publication status updated.',
        ]);
    }

    /**
     * Feature toggle
     */
    public function feature(Request $request, int $id)
    {
        $news = News::findOrFail($id);
        $this->authorize('feature', $news);

        $request->validate(['is_featured' => 'required|boolean']);

        $news->is_featured = $request->is_featured;
        $news->save();

        return response()->json([
            'status' => 'success',
            'data' => $news,
            'message' => 'Featured status updated.',
        ]);
    }
}
