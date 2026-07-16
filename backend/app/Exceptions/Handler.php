<?php

namespace App\Exceptions;

use Illuminate\Database\QueryException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Log;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * Catches database-related exceptions and returns a sanitized JSON
     * response so that no SQL error details, table names, or credentials
     * are ever exposed to the browser.
     */
    public function render($request, Throwable $e)
    {
        // Catch any database query or PDO connection failure
        if ($e instanceof QueryException || $e instanceof \PDOException) {
            Log::error('[DB Exception] A database error occurred during request processing.', [
                'exception' => get_class($e),
                'message'   => $e->getMessage(),
                'url'       => $request->fullUrl(),
                'method'    => $request->method(),
                'ip'        => $request->ip(),
                'trace'     => $e->getTraceAsString(),
            ]);

            // Return a clean, user-safe JSON response
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Database is temporarily unavailable. Please try again later.',
                    'code'    => 'DB_UNAVAILABLE',
                ], 503);
            }
        }

        return parent::render($request, $e);
    }
}
