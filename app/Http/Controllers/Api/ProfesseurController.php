<?php

namespace App\Http\Controllers\Api;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Professeur\StoreProfesseurRequest;
use App\Http\Requests\Professeur\UpdateOwnProfileRequest;
use App\Http\Requests\Professeur\UpdateProfesseurRequest;
use App\Http\Resources\ProfesseurResource;
use App\Models\Professeur;
use App\Models\User;
use App\Services\EligibilityService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class ProfesseurController extends Controller
{
    public function __construct(
        protected EligibilityService $eligibilityService
    ) {
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Professeur::class);

        $query = Professeur::query()
            ->with('user')
            ->withCount(['documents', 'promotions'])
            ->when($request->string('search')->toString(), function ($builder, $search) {
                $builder->where(function ($nested) use ($search) {
                    $nested
                        ->where('num_dr', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('cin', 'like', "%{$search}%")
                        ->orWhere('ppr', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($userQuery) => $userQuery->where('email', 'like', "%{$search}%"));
                });
            })
            ->when($request->filled('grade'), fn ($builder) => $builder->where('grade', $request->string('grade')))
            ->when($request->filled('echelon'), fn ($builder) => $builder->where('echelon', $request->integer('echelon')))
            ->latest();

        $professeurs = $query->paginate($request->integer('per_page', 10))->withQueryString();

        $professeurs->getCollection()->transform(function (Professeur $professeur) {
            $professeur->eligibility = $this->eligibilityService->getSummary($professeur);

            return $professeur;
        });

        return ApiResponse::paginated(
            $professeurs,
            ProfesseurResource::collection($professeurs->getCollection())->resolve(),
            'Liste des maitres de conferences recuperee.'
        );
    }

    public function store(StoreProfesseurRequest $request)
    {
        $this->authorize('create', Professeur::class);

        $data = $request->validated();
        $user = User::create([
            'name' => trim($data['first_name'].' '.$data['last_name']),
            'email' => $data['email'],
            'password' => $data['password'] ?? 'password',
            'role' => RoleEnum::TEACHER,
        ]);

        $professeur = Professeur::create([
            ...collect($data)->except(['email', 'password'])->toArray(),
            'user_id' => $user->id,
            'anciennete_cache' => 0,
        ])->load('user');

        return ApiResponse::success(new ProfesseurResource($professeur), 'Maitre de conferences cree avec succes.', 201);
    }

    public function show(Professeur $professeur)
    {
        $this->authorize('view', $professeur);

        $professeur->load(['user', 'documents', 'promotions.approver']);
        $professeur->eligibility = $this->eligibilityService->getEligibilityForProfesseur($professeur);

        return ApiResponse::success(new ProfesseurResource($professeur), 'Dossier enseignant recupere.');
    }

    public function update(UpdateProfesseurRequest $request, Professeur $professeur)
    {
        $this->authorize('update', $professeur);

        $data = $request->validated();

        if (isset($data['email'])) {
            $professeur->user->update(['email' => $data['email']]);
            unset($data['email']);
        }

        if (! empty($data['password'])) {
            $professeur->user->update(['password' => $data['password']]);
            unset($data['password']);
        }

        if (isset($data['first_name']) || isset($data['last_name'])) {
            $professeur->user->update([
                'name' => trim(($data['first_name'] ?? $professeur->first_name).' '.($data['last_name'] ?? $professeur->last_name)),
            ]);
        }

        $professeur->update($data);

        return ApiResponse::success(new ProfesseurResource($professeur->fresh()->load('user')), 'Dossier enseignant mis a jour avec succes.');
    }

    public function destroy(Professeur $professeur)
    {
        $this->authorize('delete', $professeur);
        $professeur->user()->delete();

        return ApiResponse::success(null, 'Enseignant supprime avec succes.');
    }

    public function me(Request $request)
    {
        $professeur = $request->user()->professeur()->with(['user', 'documents', 'promotions.approver'])->firstOrFail();
        $professeur->eligibility = $this->eligibilityService->getEligibilityForProfesseur($professeur);

        return ApiResponse::success(new ProfesseurResource($professeur), 'Mon profil a ete recupere.');
    }

    public function updateMyProfile(UpdateOwnProfileRequest $request)
    {
        $professeur = $request->user()->professeur()->with('user')->firstOrFail();
        $this->authorize('update', $professeur);

        $data = $request->validated();

        if (isset($data['email'])) {
            $professeur->user->update(['email' => $data['email']]);
            unset($data['email']);
        }

        if (isset($data['first_name']) || isset($data['last_name'])) {
            $professeur->user->update([
                'name' => trim(($data['first_name'] ?? $professeur->first_name).' '.($data['last_name'] ?? $professeur->last_name)),
            ]);
        }

        $professeur->update($data);

        return ApiResponse::success(new ProfesseurResource($professeur->fresh()->load('user')), 'Mon profil a ete mis a jour.');
    }

    public function myEligibility(Request $request)
    {
        $professeur = $request->user()->professeur()->firstOrFail();

        return ApiResponse::success(
            $this->eligibilityService->getEligibilityForProfesseur($professeur),
            "Eligibilite recuperee avec succes."
        );
    }

    public function eligibility(Professeur $professeur)
    {
        $this->authorize('view', $professeur);

        return ApiResponse::success(
            $this->eligibilityService->getEligibilityForProfesseur($professeur),
            "Eligibilite du professeur recuperee."
        );
    }
}
