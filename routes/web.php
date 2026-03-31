<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $frontendUrl = collect(explode(',', env('FRONTEND_URLS', 'http://127.0.0.1:5173')))
        ->map(fn ($url) => trim($url))
        ->filter()
        ->first() ?? 'http://127.0.0.1:5173';

    return redirect()->away($frontendUrl.'/connexion');
});
