<?php

namespace App\Policies;

use App\Models\Document;
use App\Models\Professeur;
use App\Models\User;

class DocumentPolicy
{
    public function viewAny(User $user, ?Professeur $professeur = null): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $professeur !== null && $professeur->user_id === $user->id;
    }

    public function view(User $user, Document $document): bool
    {
        return $user->isAdmin() || $document->professeur->user_id === $user->id;
    }

    public function create(User $user, ?Professeur $professeur = null): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $professeur !== null && $professeur->user_id === $user->id;
    }

    public function update(User $user, Document $document): bool
    {
        return $user->isAdmin() || $document->professeur->user_id === $user->id;
    }

    public function delete(User $user, Document $document): bool
    {
        return $user->isAdmin() || $document->professeur->user_id === $user->id;
    }

    public function deleteAll(User $user, Professeur $professeur): bool
    {
        return $user->isAdmin() || $professeur->user_id === $user->id;
    }
}
