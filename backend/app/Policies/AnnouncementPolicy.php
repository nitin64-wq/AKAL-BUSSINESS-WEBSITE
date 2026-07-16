<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Announcement;
use Illuminate\Auth\Access\HandlesAuthorization;

class AnnouncementPolicy
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

    public function update(User $user, Announcement $announcement): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function delete(User $user, Announcement $announcement): bool
    {
        return $user->isAdmin();
    }
}
