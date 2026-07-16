<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * CheckDatabaseConnection Middleware
 *
 * Runs before every API request to verify MySQL is reachable.
 * If the connection fails, returns a clean 503 JSON response
 * and logs the real error for developers. This prevents controllers
 * from ever attempting queries against a dead database.
 */
class CheckDatabaseConnection
{
    /**
     * Endpoints that should bypass this check.
     * The db-status health endpoint must remain accessible
     * so the frontend can poll for recovery.
     */
    protected array $except = [
        'api/db-status',
        'api/v1/db-status',
    ];

    public function handle(Request $request, Closure $next)
    {
        // Skip check for whitelisted endpoints
        if ($this->shouldSkip($request)) {
            return $next($request);
        }

        try {
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            Log::error('[DB Connection Check] Database is unreachable.', [
                'error'   => $e->getMessage(),
                'url'     => $request->fullUrl(),
                'method'  => $request->method(),
                'ip'      => $request->ip(),
            ]);

            return response()->json([
                'status'  => 'error',
                'message' => 'Database is temporarily unavailable. Please try again later.',
                'code'    => 'DB_UNAVAILABLE',
            ], 503);
        }

        return $next($request);
    }

    /**
     * Check if the current request path matches any exception.
     */
    protected function shouldSkip(Request $request): bool
    {
        $path = trim($request->path(), '/');

        foreach ($this->except as $except) {
            if ($path === $except) {
                return true;
            }
        }

        return false;
    }
}
