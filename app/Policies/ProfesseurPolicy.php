<?php

namespace App\Policies;

use App\Models\Professeur;
use App\Models\User;

class ProfesseurPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Professeur $professeur): bool
    {
        return $user->isAdmin() || $user->id === $professeur->user_id;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Professeur $professeur): bool
    {
        return $user->isAdmin() || $user->id === $professeur->user_id;
    }

    public function delete(User $user, Professeur $professeur): bool
    {
        return $user->isAdmin();
    }
}
