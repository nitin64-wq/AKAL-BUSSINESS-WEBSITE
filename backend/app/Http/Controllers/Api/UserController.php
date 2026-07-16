<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum']);
    }

    /**
     * Admin Index
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $query = User::orderBy('created_at', 'desc');

        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
        }

        $perPage = $request->get('per_page', 15);
        return response()->json($query->paginate($perPage));
    }

    /**
     * Admin Create User
     */
    public function store(Request $request)
    {
        $this->authorize('create', User::class);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,editor,viewer',
            'is_active' => 'nullable|boolean',
        ]);

        $data['password'] = Hash::make($data['password']);
        $data['is_active'] = $data['is_active'] ?? true;

        $user = User::create($data);

        return response()->json([
            'status' => 'success',
            'data' => $user,
            'message' => 'User created successfully.',
        ], 201);
    }

    /**
     * Admin Update User
     */
    public function update(Request $request, int $id)
    {
        $user = User::findOrFail($id);
        $this->authorize('update', $user);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id . '|max:255',
            'password' => 'nullable|string|min:6',
            'role' => 'required|in:admin,editor,viewer',
            'is_active' => 'nullable|boolean',
        ]);

        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $user,
            'message' => 'User updated successfully.',
        ]);
    }

    /**
     * Admin Delete User
     */
    public function destroy(int $id)
    {
        $user = User::findOrFail($id);
        $this->authorize('delete', $user);

        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User deleted successfully.',
        ]);
    }

    /**
     * Admin Change Role
     */
    public function changeRole(Request $request, int $id)
    {
        $user = User::findOrFail($id);
        $this->authorize('changeRole', $user);

        $request->validate([
            'role' => 'required|in:admin,editor,viewer',
        ]);

        $user->role = $request->role;
        $user->save();

        return response()->json([
            'status' => 'success',
            'data' => $user,
            'message' => 'User role updated successfully.',
        ]);
    }
}
