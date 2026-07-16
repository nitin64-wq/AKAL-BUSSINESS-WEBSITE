<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Scholarship;
use Illuminate\Auth\Access\HandlesAuthorization;

class ScholarshipPolicy
{
    use HandlesAuthorization;

    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function update(User $user, Scholarship $scholarship): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function delete(User $user, Scholarship $scholarship): bool
    {
        return $user->isAdmin();
    }
}
