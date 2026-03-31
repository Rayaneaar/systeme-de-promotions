<?php

namespace App\Providers;

use App\Models\Document;
use App\Models\Professeur;
use App\Models\Promotion;
use App\Policies\DocumentPolicy;
use App\Policies\ProfesseurPolicy;
use App\Policies\PromotionPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Gate::policy(Professeur::class, ProfesseurPolicy::class);
        Gate::policy(Promotion::class, PromotionPolicy::class);
        Gate::policy(Document::class, DocumentPolicy::class);
    }
}
