<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {
    }

    public function register(RegisterRequest $request)
    {
        [$user, $professeur, $token] = $this->authService->registerTeacher($request->validated());
        $user->setRelation('professeur', $professeur);

        return ApiResponse::success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Compte enseignant cree avec succes.', 201);
    }

    public function login(LoginRequest $request)
    {
        [$user, $token] = $this->authService->authenticate($request->validated());

        return ApiResponse::success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Connexion reussie.');
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return ApiResponse::success(null, 'Deconnexion reussie.');
    }

    public function me(Request $request)
    {
        return ApiResponse::success(
            new UserResource($request->user()->load('professeur')),
            'Utilisateur courant recupere.'
        );
    }
}
