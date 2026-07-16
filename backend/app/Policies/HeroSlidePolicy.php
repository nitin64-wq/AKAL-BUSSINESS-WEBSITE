<?php

namespace App\Policies;

use App\Models\User;
use App\Models\HeroSlide;
use Illuminate\Auth\Access\HandlesAuthorization;

class HeroSlidePolicy
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

    public function update(User $user, HeroSlide $heroSlide): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function delete(User $user, HeroSlide $heroSlide): bool
    {
        return $user->isAdmin();
    }
}
