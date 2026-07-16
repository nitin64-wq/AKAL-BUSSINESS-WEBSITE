<?php

namespace App\Policies;

use App\Models\User;
use App\Models\StudentAchievement;
use Illuminate\Auth\Access\HandlesAuthorization;

class StudentAchievementPolicy
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

    public function update(User $user, StudentAchievement $achievement): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function delete(User $user, StudentAchievement $achievement): bool
    {
        return $user->isAdmin();
    }
}
