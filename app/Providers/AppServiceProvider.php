<?php

namespace App\Providers;

use Carbon\Carbon;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
    }

    public function boot(): void
    {
        app()->setLocale(config('app.locale'));
        Carbon::setLocale(config('app.locale'));
        Date::use(Carbon::class);
    }
}
