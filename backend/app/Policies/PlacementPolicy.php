<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Placement;
use Illuminate\Auth\Access\HandlesAuthorization;

class PlacementPolicy
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

    public function update(User $user, Placement $placement): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function delete(User $user, Placement $placement): bool
    {
        return $user->isAdmin();
    }
}
