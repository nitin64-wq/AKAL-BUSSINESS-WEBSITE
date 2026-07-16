<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ContactMessage;
use Illuminate\Auth\Access\HandlesAuthorization;

class ContactMessagePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor() || $user->isViewer();
    }

    public function view(User $user, ContactMessage $contactMessage): bool
    {
        return $user->isAdmin() || $user->isEditor() || $user->isViewer();
    }

    public function create(?User $user): bool
    {
        return true; // Public contact form submission
    }

    public function markRead(User $user, ContactMessage $contactMessage): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function reply(User $user, ContactMessage $contactMessage): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function delete(User $user, ContactMessage $contactMessage): bool
    {
        return $user->isAdmin();
    }
}
