<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Program;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProgramPolicy
{
    use HandlesAuthorization;

    public function viewAny(?User $user): bool
    {
        return true; // Public
    }

    public function view(?User $user, Program $program): bool
    {
        return true; // Public
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function update(User $user, Program $program): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function delete(User $user, Program $program): bool
    {
        return $user->isAdmin();
    }

    public function toggleActive(User $user, Program $program): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }
}
