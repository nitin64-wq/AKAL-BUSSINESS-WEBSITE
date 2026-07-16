<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Models\ContactMessage;
use App\Models\Application;
use App\Models\News;
use App\Models\AuditLog;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ContactController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['submitContact', 'submitNewsletter']);
    }

    /**
     * Public contact message submission
     */
    public function submitContact(StoreContactRequest $request)
    {
        $data = $request->validated();
        $contact = ContactMessage::create($data);

        // Send acknowledgement email
        EmailService::sendContactAcknowledgement($contact);

        return response()->json([
            'status' => 'success',
            'message' => 'Thank you! Your message has been sent successfully.',
        ], 201);
    }

    /**
     * Public newsletter subscription
     */
    public function submitNewsletter(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);

        // In a real application, you might save this to a subscribers table.
        // For ABS website, we can log it or create a contact message of source 'Callback'/'Enquiry'
        ContactMessage::create([
            'name' => 'Newsletter Subscriber',
            'email' => $request->email,
            'message' => 'Newsletter subscription request received.',
            'source' => 'Enquiry',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Thank you for subscribing to our newsletter!',
        ]);
    }

    /**
     * Admin message listing
     */
    public function adminIndex(Request $request)
    {
        $this->authorize('viewAny', ContactMessage::class);

        $query = ContactMessage::orderBy('created_at', 'desc');

        if ($request->has('unread')) {
            $query->unread();
        }

        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
                  ->orWhere('subject', 'like', "%{$request->search}%");
        }

        $perPage = $request->get('per_page', 10);
        return response()->json($query->paginate($perPage));
    }

    /**
     * Admin mark message as read
     */
    public function markRead(int $id)
    {
        $message = ContactMessage::findOrFail($id);
        $this->authorize('markRead', $message);

        $message->is_read = true;
        $message->save();

        return response()->json([
            'status' => 'success',
            'data' => $message,
            'message' => 'Message marked as read.',
        ]);
    }

    /**
     * Admin reply to contact message
     */
    public function reply(Request $request, int $id)
    {
        $message = ContactMessage::findOrFail($id);
        $this->authorize('reply', $message);

        $request->validate([
            'reply' => 'required|string|max:2000',
        ]);

        // Mark as read
        $message->is_read = true;
        $message->replied_at = now();
        $message->save();

        // Send email (for simulation, logged inside EmailService or simulated here)
        try {
            \Illuminate\Support\Facades\Mail::raw($request->reply, function ($msg) use ($message) {
                $msg->to($message->email)
                    ->subject("RE: ABS Inquiry - " . ($message->subject ?? 'Inquiry'));
            });
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Failed to send reply email: " . $e->getMessage());
        }

        return response()->json([
            'status' => 'success',
            'data' => $message,
            'message' => 'Reply sent successfully.',
        ]);
    }

    /**
     * Admin delete message
     */
    public function destroy(int $id)
    {
        $message = ContactMessage::findOrFail($id);
        $this->authorize('delete', $message);

        $message->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Message deleted successfully.',
        ]);
    }

    /**
     * Admin dashboard statistics
     */
    public function getDashboardStats()
    {
        // Require auth
        $user = auth()->user();

        $stats = [
            'total_applications' => Application::count(),
            'pending_applications' => Application::where('status', 'Pending')->count(),
            'new_messages' => ContactMessage::where('is_read', false)->count(),
            'published_news' => News::published()->count(),
            'recent_applications' => Application::with('program:id,title')
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    /**
     * Admin audit log history
     */
    public function getAuditLogs(Request $request)
    {
        // Uses global gate for audit logs
        if (!Gate::allows('view-audit-log')) {
            abort(403, 'You do not have permission to view audit logs.');
        }

        $query = AuditLog::with('user:id,name,email')->orderBy('created_at', 'desc');

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        $perPage = $request->get('per_page', 20);
        return response()->json($query->paginate($perPage));
    }
}
