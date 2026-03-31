<?php

namespace App\Policies;

use App\Models\Promotion;
use App\Models\User;

class PromotionPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Promotion $promotion): bool
    {
        return $user->isAdmin() || $promotion->professeur->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Promotion $promotion): bool
    {
        return $user->isAdmin() && $promotion->status->value === 'pending';
    }

    public function approve(User $user): bool
    {
        return $user->isAdmin();
    }

    public function reject(User $user): bool
    {
        return $user->isAdmin();
    }
}
