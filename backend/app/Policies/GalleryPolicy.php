<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Gallery;
use Illuminate\Auth\Access\HandlesAuthorization;

class GalleryPolicy
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

    public function delete(User $user, Gallery $gallery): bool
    {
        return $user->isAdmin();
    }
}
