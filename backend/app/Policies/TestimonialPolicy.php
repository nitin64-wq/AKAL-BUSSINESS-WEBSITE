<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Testimonial;
use Illuminate\Auth\Access\HandlesAuthorization;

class TestimonialPolicy
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

    public function update(User $user, Testimonial $testimonial): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function delete(User $user, Testimonial $testimonial): bool
    {
        return $user->isAdmin();
    }
}
