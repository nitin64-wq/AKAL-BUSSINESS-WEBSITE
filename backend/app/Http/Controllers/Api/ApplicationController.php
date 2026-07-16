<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationRequest;
use App\Models\Application;
use App\Services\ApplicationService;
use App\Services\EmailService;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['store', 'track']);
    }

    /**
     * Public application submission
     */
    public function store(StoreApplicationRequest $request)
    {
        $data = $request->validated();

        // Generate unique application number
        $data['application_no'] = ApplicationService::generateApplicationNumber();
        $data['status'] = 'Pending';

        // Document uploading (if any submitted via multipart form)
        // Usually, multi-step forms post JSON first, then upload documents,
        // or submit them together. We support multiple files.
        $uploadedDocs = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $key => $file) {
                $uploadedDocs[$key] = FileUploadService::uploadDocument($file, 'applications');
            }
        }
        $data['documents'] = !empty($uploadedDocs) ? $uploadedDocs : null;

        $application = Application::create($data);

        // Send confirmation email
        EmailService::sendApplicationConfirmation($application);

        return response()->json([
            'status' => 'success',
            'data' => [
                'application_no' => $application->application_no,
                'full_name' => $application->full_name,
            ],
            'message' => 'Your application has been submitted successfully. Code: ' . $application->application_no,
        ], 201);
    }

    /**
     * Public tracking endpoint
     */
    public function track(string $applicationNo)
    {
        $application = Application::where('application_no', $applicationNo)
            ->with('program:id,title')
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => [
                'application_no' => $application->application_no,
                'full_name' => $application->full_name,
                'program_title' => $application->program ? $application->program->title : 'Selected Program',
                'status' => $application->status,
                'remarks' => $application->remarks,
                'submitted_at' => $application->created_at->toDateString(),
            ],
        ]);
    }

    /**
     * Admin index grid
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Application::class);

        $query = Application::with('program:id,title')->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        if ($request->filled('program_id')) {
            $query->byProgram((int) $request->program_id);
        }

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('application_no', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 15);
        return response()->json($query->paginate($perPage));
    }

    /**
     * Admin show detail
     */
    public function show(int $id)
    {
        $application = Application::with('program')->findOrFail($id);
        $this->authorize('view', $application);

        return response()->json([
            'status' => 'success',
            'data' => $application,
        ]);
    }

    /**
     * Admin update status
     */
    public function updateStatus(Request $request, int $id)
    {
        $application = Application::findOrFail($id);
        $this->authorize('updateStatus', $application);

        $request->validate([
            'status' => 'required|in:Pending,Under Review,Shortlisted,Accepted,Rejected,Waitlist',
            'remarks' => 'nullable|string|max:1000',
        ]);

        $application->status = $request->status;
        if ($request->has('remarks')) {
            $application->remarks = $request->remarks;
        }
        $application->save();

        return response()->json([
            'status' => 'success',
            'data' => $application,
            'message' => 'Application status updated successfully.',
        ]);
    }

    /**
     * Admin delete application
     */
    public function destroy(int $id)
    {
        $application = Application::findOrFail($id);
        $this->authorize('delete', $application);

        // Delete uploaded files
        if ($application->documents) {
            foreach ($application->documents as $path) {
                FileUploadService::delete($path);
            }
        }

        $application->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Application deleted successfully.',
        ]);
    }

    /**
     * Admin CSV Export
     */
    public function exportCsv(Request $request)
    {
        $this->authorize('viewAny', Application::class);

        $query = Application::with('program')->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        $applications = $query->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="applications_' . date('Ymd_His') . '.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($applications) {
            $file = fopen('php://output', 'w');
            
            // CSV Header
            fputcsv($file, [
                'Application No', 'Full Name', 'Email', 'Phone', 'Date of Birth', 
                'Gender', 'Program', 'Qualification', 'Marks (%)', 'Category', 
                'Work Exp (Months)', 'Status', 'Submitted At'
            ]);

            foreach ($applications as $app) {
                fputcsv($file, [
                    $app->application_no,
                    $app->full_name,
                    $app->email,
                    $app->phone,
                    $app->date_of_birth ? $app->date_of_birth->toDateString() : '',
                    $app->gender,
                    $app->program ? $app->program->title : '',
                    $app->last_qualification,
                    $app->marks_percentage,
                    $app->category,
                    $app->work_experience,
                    $app->status,
                    $app->created_at->toDateTimeString(),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Admin PDF Export (using HTML print view template)
     */
    public function exportPdf(int $id)
    {
        $application = Application::with('program')->findOrFail($id);
        $this->authorize('view', $application);

        // Return a clean HTML template optimized for print/PDF conversion
        $html = view('reports.application', compact('application'))->render();

        return response($html, 200)
            ->header('Content-Type', 'text/html')
            ->header('Content-Disposition', 'inline; filename="application_' . $application->application_no . '.html"');
    }
}
