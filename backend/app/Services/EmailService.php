<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailService
{
    /**
     * Send email notification for a new application submission
     */
    public static function sendApplicationConfirmation($application)
    {
        $to = $application->email;
        $subject = "Application Submitted Successfully - ABS";
        
        $body = "Dear {$application->full_name},\n\n" .
                "Thank you for applying to Akal Business School. Your application has been successfully received.\n\n" .
                "Application Number: {$application->application_no}\n" .
                "Program: " . ($application->program ? $application->program->title : 'Selected Program') . "\n" .
                "Status: Pending Review\n\n" .
                "You can track your application status on our portal using your application number.\n\n" .
                "Best regards,\n" .
                "Admissions Team\n" .
                "Akal Business School\n" .
                "Email: director_abs@auts.ac.in";

        try {
            Mail::raw($body, function ($message) use ($to, $subject) {
                $message->to($to)
                        ->subject($subject);
            });
            Log::info("Application confirmation email sent to: {$to}");
        } catch (\Exception $e) {
            Log::error("Failed to send application confirmation email: " . $e->getMessage());
            Log::info("EMAILED BODY:\n{$body}");
        }
    }

    /**
     * Send email notification for a new contact form submission
     */
    public static function sendContactAcknowledgement($contact)
    {
        $to = $contact->email;
        $subject = "Acknowledgement: Inquiry Received - ABS";
        
        $body = "Dear {$contact->name},\n\n" .
                "Thank you for contacting Akal Business School. We have received your inquiry and our desk team will get back to you shortly.\n\n" .
                "Your Message:\n\"{$contact->message}\"\n\n" .
                "Best regards,\n" .
                "Information Desk\n" .
                "Akal Business School\n" .
                "Email: director_abs@auts.ac.in";

        try {
            Mail::raw($body, function ($message) use ($to, $subject) {
                $message->to($to)
                        ->subject($subject);
            });
            Log::info("Contact acknowledgement email sent to: {$to}");
        } catch (\Exception $e) {
            Log::error("Failed to send contact acknowledgment email: " . $e->getMessage());
            Log::info("EMAILED BODY:\n{$body}");
        }
    }
}
