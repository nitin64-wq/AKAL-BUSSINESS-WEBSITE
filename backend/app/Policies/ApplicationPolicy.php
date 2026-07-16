<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Application;
use Illuminate\Auth\Access\HandlesAuthorization;

class ApplicationPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor() || $user->isViewer();
    }

    public function view(User $user, Application $application): bool
    {
        return $user->isAdmin() || $user->isEditor() || $user->isViewer();
    }

    public function create(?User $user): bool
    {
        return true; // Anyone can submit an application from the frontend
    }

    public function update(User $user, Application $application): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function delete(User $user, Application $application): bool
    {
        return $user->isAdmin();
    }

    public function updateStatus(User $user, Application $application): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function addRemarks(User $user, Application $application): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function export(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }
}
