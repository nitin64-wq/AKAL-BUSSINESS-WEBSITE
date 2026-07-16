<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Download;
use Illuminate\Auth\Access\HandlesAuthorization;

class DownloadPolicy
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

    public function update(User $user, Download $download): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function delete(User $user, Download $download): bool
    {
        return $user->isAdmin();
    }
}
