<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\PlacementController;
use App\Http\Controllers\Api\ScholarshipController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\HeroSlideController;
use App\Http\Controllers\Api\StudentAchievementController;
use App\Http\Controllers\Api\PartnerUniversityController;
use App\Http\Controllers\Api\DownloadController;
use App\Http\Controllers\Api\SeoSettingController;
use App\Http\Controllers\Api\PageSeoController;
use App\Http\Controllers\Api\SeoMetaController;
use App\Http\Controllers\Api\SeoSchemaController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\GeoMetaController;
use App\Http\Controllers\Api\SeoSitemapController;
use App\Http\Controllers\Api\SeoRobotsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

$routesDefinition = function () {
    // Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });
    });

    // Public Routes
    Route::get('/db-status', function () {
        try {
            \Illuminate\Support\Facades\DB::connection()->getPdo();
            return response()->json(['connected' => true]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('[DB Status Check] Database unreachable.', [
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'connected' => false,
                'message' => 'Database is temporarily unavailable.',
            ], 503);
        }
    });

    Route::get('/programs', [ProgramController::class, 'index']);
    Route::get('/programs/{slug}', [ProgramController::class, 'show']);
    
    Route::get('/faculty', [FacultyController::class, 'index']);
    Route::get('/faculty/{slug}', [FacultyController::class, 'show']);
    
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/{slug}', [NewsController::class, 'show']);
    
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{slug}', [EventController::class, 'show']);
    
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::get('/placements', [PlacementController::class, 'index']);
    Route::get('/scholarships', [ScholarshipController::class, 'index']);
    Route::get('/gallery', [GalleryController::class, 'index']);
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::get('/announcements', [AnnouncementController::class, 'index']);
    Route::get('/hero-slides', [HeroSlideController::class, 'index']);
    Route::get('/student-achievements', [StudentAchievementController::class, 'index']);
    Route::get('/partner-universities', [PartnerUniversityController::class, 'index']);
    Route::get('/downloads', [DownloadController::class, 'index']);
    
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::get('/applications/track/{application_no}', [ApplicationController::class, 'track']);
    
    Route::post('/contact', [ContactController::class, 'submitContact']);
    Route::post('/newsletter/subscribe', [ContactController::class, 'submitNewsletter']);

    // ── SEO / AEO / GEO Public Routes ───────────────────────────────────
    Route::prefix('seo')->group(function () {
        Route::get('/settings', [SeoSettingController::class, 'index']);
        Route::get('/pages/{identifier}', [PageSeoController::class, 'show']);
        Route::get('/schemas', [SeoSchemaController::class, 'index']);
        Route::get('/faqs', [FaqController::class, 'index']);
        Route::get('/content/{type}/{id}', [SeoMetaController::class, 'show']);
        Route::get('/geo/{type}/{id}', [GeoMetaController::class, 'show']);
        Route::get('/geo/page/{pageSeoId}', [GeoMetaController::class, 'showForPage']);
        Route::get('/sitemap-data', [SeoSitemapController::class, 'index']);
        Route::get('/robots-data', [SeoRobotsController::class, 'index']);
    });

    // Admin Protected Routes (Require Sanctum Auth + Admin Role Middleware)
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        // Dashboard & Auditing
        Route::get('/admin/dashboard/stats', [ContactController::class, 'getDashboardStats']);
        Route::get('/admin/audit-logs', [ContactController::class, 'getAuditLogs']);

        // Programs
        Route::get('/admin/programs', [ProgramController::class, 'adminIndex']);
        Route::post('/admin/programs', [ProgramController::class, 'store']);
        Route::post('/admin/programs/{id}', [ProgramController::class, 'update']);
        Route::delete('/admin/programs/{id}', [ProgramController::class, 'destroy']);
        Route::patch('/admin/programs/{id}/toggle-active', [ProgramController::class, 'toggleActive']);

        // Faculty
        Route::get('/admin/faculty', [FacultyController::class, 'adminIndex']);
        Route::post('/admin/faculty', [FacultyController::class, 'store']);
        Route::post('/admin/faculty/{id}', [FacultyController::class, 'update']);
        Route::delete('/admin/faculty/{id}', [FacultyController::class, 'destroy']);
        Route::post('/admin/faculty/reorder', [FacultyController::class, 'reorder']);

        // News
        Route::get('/admin/news', [NewsController::class, 'adminIndex']);
        Route::post('/admin/news', [NewsController::class, 'store']);
        Route::post('/admin/news/{id}', [NewsController::class, 'update']);
        Route::delete('/admin/news/{id}', [NewsController::class, 'destroy']);
        Route::patch('/admin/news/{id}/publish', [NewsController::class, 'publish']);
        Route::patch('/admin/news/{id}/feature', [NewsController::class, 'feature']);

        // Events
        Route::get('/admin/events', [EventController::class, 'adminIndex']);
        Route::post('/admin/events', [EventController::class, 'store']);
        Route::post('/admin/events/{id}', [EventController::class, 'update']);
        Route::delete('/admin/events/{id}', [EventController::class, 'destroy']);

        // Testimonials
        Route::get('/admin/testimonials', [TestimonialController::class, 'adminIndex']);
        Route::post('/admin/testimonials', [TestimonialController::class, 'store']);
        Route::post('/admin/testimonials/{id}', [TestimonialController::class, 'update']);
        Route::delete('/admin/testimonials/{id}', [TestimonialController::class, 'destroy']);

        // Applications
        Route::get('/admin/applications', [ApplicationController::class, 'index']);
        Route::get('/admin/applications/{id}', [ApplicationController::class, 'show']);
        Route::patch('/admin/applications/{id}/status', [ApplicationController::class, 'updateStatus']);
        Route::delete('/admin/applications/{id}', [ApplicationController::class, 'destroy']);
        Route::get('/admin/applications/export/csv', [ApplicationController::class, 'exportCsv']);
        Route::get('/admin/applications/{id}/export/pdf', [ApplicationController::class, 'exportPdf']);

        // Contact Messages
        Route::get('/admin/messages', [ContactController::class, 'adminIndex']);
        Route::patch('/admin/messages/{id}/read', [ContactController::class, 'markRead']);
        Route::post('/admin/messages/{id}/reply', [ContactController::class, 'reply']);
        Route::delete('/admin/messages/{id}', [ContactController::class, 'destroy']);

        // Placements
        Route::get('/admin/placements', [PlacementController::class, 'adminIndex']);
        Route::post('/admin/placements', [PlacementController::class, 'store']);
        Route::post('/admin/placements/{id}', [PlacementController::class, 'update']);
        Route::delete('/admin/placements/{id}', [PlacementController::class, 'destroy']);

        // Hero Slides
        Route::get('/admin/hero-slides', [HeroSlideController::class, 'adminIndex']);
        Route::post('/admin/hero-slides', [HeroSlideController::class, 'store']);
        Route::post('/admin/hero-slides/{id}', [HeroSlideController::class, 'update']);
        Route::delete('/admin/hero-slides/{id}', [HeroSlideController::class, 'destroy']);

        // Student Achievements
        Route::get('/admin/student-achievements', [StudentAchievementController::class, 'adminIndex']);
        Route::post('/admin/student-achievements', [StudentAchievementController::class, 'store']);
        Route::post('/admin/student-achievements/{id}', [StudentAchievementController::class, 'update']);
        Route::delete('/admin/student-achievements/{id}', [StudentAchievementController::class, 'destroy']);

        // Partner Universities
        Route::get('/admin/partner-universities', [PartnerUniversityController::class, 'adminIndex']);
        Route::post('/admin/partner-universities', [PartnerUniversityController::class, 'store']);
        Route::post('/admin/partner-universities/{id}', [PartnerUniversityController::class, 'update']);
        Route::delete('/admin/partner-universities/{id}', [PartnerUniversityController::class, 'destroy']);

        // Scholarships
        Route::get('/admin/scholarships', [ScholarshipController::class, 'adminIndex']);
        Route::post('/admin/scholarships', [ScholarshipController::class, 'store']);
        Route::put('/admin/scholarships/{id}', [ScholarshipController::class, 'update']);
        Route::delete('/admin/scholarships/{id}', [ScholarshipController::class, 'destroy']);

        // Gallery
        Route::get('/admin/gallery', [GalleryController::class, 'adminIndex']);
        Route::post('/admin/gallery', [GalleryController::class, 'store']);
        Route::delete('/admin/gallery/{id}', [GalleryController::class, 'destroy']);

        // Downloads
        Route::get('/admin/downloads', [DownloadController::class, 'adminIndex']);
        Route::post('/admin/downloads', [DownloadController::class, 'store']);
        Route::post('/admin/downloads/{id}', [DownloadController::class, 'update']);
        Route::delete('/admin/downloads/{id}', [DownloadController::class, 'destroy']);

        // Settings
        Route::get('/admin/settings', [SettingsController::class, 'adminIndex']);
        Route::put('/admin/settings', [SettingsController::class, 'update']);

        // Announcements
        Route::get('/admin/announcements', [AnnouncementController::class, 'adminIndex']);
        Route::post('/admin/announcements', [AnnouncementController::class, 'store']);
        Route::post('/admin/announcements/{id}', [AnnouncementController::class, 'update']);
        Route::delete('/admin/announcements/{id}', [AnnouncementController::class, 'destroy']);

        // Users Management
        Route::get('/admin/users', [UserController::class, 'index']);
        Route::post('/admin/users', [UserController::class, 'store']);
        Route::put('/admin/users/{id}', [UserController::class, 'update']);
        Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
        Route::patch('/admin/users/{id}/role', [UserController::class, 'changeRole']);

        // ── SEO / AEO / GEO Admin Routes ────────────────────────────────
        Route::prefix('admin/seo')->group(function () {
            // Global SEO Settings
            Route::get('/settings', [SeoSettingController::class, 'adminIndex']);
            Route::put('/settings', [SeoSettingController::class, 'update']);
            Route::post('/settings', [SeoSettingController::class, 'update']); // For multipart/form-data

            // Page SEO
            Route::get('/pages', [PageSeoController::class, 'adminIndex']);
            Route::post('/pages', [PageSeoController::class, 'store']);
            Route::put('/pages/{id}', [PageSeoController::class, 'update']);
            Route::delete('/pages/{id}', [PageSeoController::class, 'destroy']);

            // Content SEO (polymorphic)
            Route::get('/content-types', [SeoMetaController::class, 'contentTypes']);
            Route::get('/content/{type}', [SeoMetaController::class, 'adminIndex']);
            Route::get('/content/{type}/{id}', [SeoMetaController::class, 'adminShow']);
            Route::put('/content/{type}/{id}', [SeoMetaController::class, 'upsert']);

            // Schemas
            Route::get('/schemas', [SeoSchemaController::class, 'adminIndex']);
            Route::post('/schemas', [SeoSchemaController::class, 'store']);
            Route::put('/schemas/{id}', [SeoSchemaController::class, 'update']);
            Route::delete('/schemas/{id}', [SeoSchemaController::class, 'destroy']);

            // FAQs (AEO)
            Route::get('/faqs', [FaqController::class, 'adminIndex']);
            Route::post('/faqs', [FaqController::class, 'store']);
            Route::put('/faqs/{id}', [FaqController::class, 'update']);
            Route::delete('/faqs/{id}', [FaqController::class, 'destroy']);
            Route::post('/faqs/reorder', [FaqController::class, 'reorder']);

            // GEO Meta
            Route::put('/geo/page/{pageSeoId}', [GeoMetaController::class, 'upsertForPage']);
            Route::put('/geo/{type}/{id}', [GeoMetaController::class, 'upsert']);

            // Robots
            Route::put('/robots', [SeoRobotsController::class, 'update']);
        });
    });
};

// Register directly under /api/...
$routesDefinition();

// Also register under /api/v1/... for complete backward-compatibility
Route::prefix('v1')->group($routesDefinition);
