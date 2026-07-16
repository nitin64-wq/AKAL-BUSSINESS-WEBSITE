<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Event;
use Illuminate\Auth\Access\HandlesAuthorization;

class EventPolicy
{
    use HandlesAuthorization;

    public function viewAny(?User $user): bool
    {
        return true; // Public
    }

    public function view(?User $user, Event $event): bool
    {
        return true; // Public
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function update(User $user, Event $event): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function delete(User $user, Event $event): bool
    {
        return $user->isAdmin();
    }
}
