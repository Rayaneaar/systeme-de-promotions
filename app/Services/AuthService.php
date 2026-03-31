<?php

namespace App\Services;

use App\Enums\RoleEnum;
use App\Models\Professeur;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function registerTeacher(array $data): array
    {
        $user = User::create([
            'name' => trim($data['first_name'].' '.$data['last_name']),
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => RoleEnum::TEACHER,
        ]);

        $professeur = Professeur::create([
            'user_id' => $user->id,
            'num_dr' => $data['num_dr'],
            'cin' => $data['cin'] ?? null,
            'ppr' => $data['ppr'] ?? null,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'date_of_birth' => $data['date_of_birth'] ?? null,
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
            'specialite' => $data['specialite'] ?? null,
            'grade' => $data['grade'],
            'echelon' => $data['echelon'],
            'date_recrutement' => $data['date_recrutement'],
            'date_last_promotion' => $data['date_recrutement'],
            'date_last_grade_promotion' => $data['date_recrutement'],
            'date_last_echelon_promotion' => $data['date_recrutement'],
            'anciennete_cache' => 0,
        ]);

        $token = $user->createToken('teacher-auth-token')->plainTextToken;

        return [$user->fresh(), $professeur, $token];
    }

    public function authenticate(array $credentials): array
    {
        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants invalides.'],
            ]);
        }

        $user = User::with('professeur')->where('email', $credentials['email'])->firstOrFail();
        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        return [$user, $token];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }
}
