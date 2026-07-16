<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Faculty;
use Illuminate\Auth\Access\HandlesAuthorization;

class FacultyPolicy
{
    use HandlesAuthorization;

    public function viewAny(?User $user): bool
    {
        return true; // Public
    }

    public function view(?User $user, Faculty $faculty): bool
    {
        return true; // Public
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function update(User $user, Faculty $faculty): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function delete(User $user, Faculty $faculty): bool
    {
        return $user->isAdmin();
    }

    public function reorder(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }
}
