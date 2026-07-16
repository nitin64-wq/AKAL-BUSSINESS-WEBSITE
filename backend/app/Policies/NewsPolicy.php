<?php

namespace App\Policies;

use App\Models\User;
use App\Models\News;
use Illuminate\Auth\Access\HandlesAuthorization;

class NewsPolicy
{
    use HandlesAuthorization;

    public function viewAny(?User $user): bool
    {
        return true; // Public
    }

    public function view(?User $user, News $news): bool
    {
        return true; // Public
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function update(User $user, News $news): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isEditor()) {
            return $news->author_id === $user->id; // Can only edit own news
        }

        return false;
    }

    public function delete(User $user, News $news): bool
    {
        return $user->isAdmin(); // Only admin can delete news
    }

    public function publish(User $user, News $news): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function feature(User $user, News $news): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }
}
