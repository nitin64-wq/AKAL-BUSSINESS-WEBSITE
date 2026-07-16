<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || !in_array($user->role, ['admin', 'editor'])) {
            return response()->json([
                'error' => 'Forbidden',
                'message' => 'You do not have administrative privileges to perform this action.',
            ], 403);
        }

        return $next($request);
    }
}
