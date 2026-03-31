<?php

use App\Http\Middleware\EnsureUserHasRole;
use App\Support\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->redirectGuestsTo(fn () => null);

        $middleware->alias([
            'role' => EnsureUserHasRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ValidationException $exception) {
            return ApiResponse::error('Erreur de validation.', 422, $exception->errors());
        });

        $exceptions->render(function (AuthenticationException $exception) {
            return ApiResponse::error('Authentification requise.', 401);
        });

        $exceptions->render(function (AuthorizationException $exception) {
            return ApiResponse::error('Acces refuse.', 403);
        });

        $exceptions->render(function (ModelNotFoundException $exception) {
            return ApiResponse::error('Ressource introuvable.', 404);
        });

        $exceptions->render(function (\Throwable $exception) {
            if ($exception instanceof HttpExceptionInterface) {
                return ApiResponse::error($exception->getMessage() ?: 'Erreur HTTP.', $exception->getStatusCode());
            }

            report($exception);

            return ApiResponse::error('Une erreur interne est survenue. Merci de reessayer.', 500);
        });
    })->create();
