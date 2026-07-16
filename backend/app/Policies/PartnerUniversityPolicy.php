<?php

namespace App\Policies;

use App\Models\User;
use App\Models\PartnerUniversity;
use Illuminate\Auth\Access\HandlesAuthorization;

class PartnerUniversityPolicy
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

    public function update(User $user, PartnerUniversity $uni): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function delete(User $user, PartnerUniversity $uni): bool
    {
        return $user->isAdmin();
    }
}
