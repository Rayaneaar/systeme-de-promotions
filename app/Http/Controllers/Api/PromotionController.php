<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Promotion\ApprovePromotionRequest;
use App\Http\Requests\Promotion\RejectPromotionRequest;
use App\Http\Requests\Promotion\StorePromotionRequest;
use App\Http\Requests\Promotion\UpdatePromotionRequest;
use App\Http\Resources\PromotionResource;
use App\Models\Promotion;
use App\Services\PromotionService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function __construct(
        protected PromotionService $promotionService
    ) {
    }

    public function index(Request $request)
    {
        $query = Promotion::query()
            ->with(['professeur.user', 'approver', 'requester'])
            ->when(! $request->user()->isAdmin(), fn ($builder) => $builder->whereHas('professeur', fn ($nested) => $nested->where('user_id', $request->user()->id)))
            ->when($request->filled('status'), fn ($builder) => $builder->where('status', $request->string('status')))
            ->when($request->filled('type'), fn ($builder) => $builder->where('type', $request->string('type')))
            ->when($request->filled('professeur_id'), fn ($builder) => $builder->where('professeur_id', $request->integer('professeur_id')))
            ->latest();

        $promotions = $query->paginate($request->integer('per_page', 10))->withQueryString();

        return ApiResponse::paginated(
            $promotions,
            PromotionResource::collection($promotions->getCollection())->resolve(),
            'Liste des promotions recuperee.'
        );
    }

    public function store(StorePromotionRequest $request)
    {
        $this->authorize('create', Promotion::class);

        $promotion = $this->promotionService
            ->createPromotion($request->validated(), $request->user())
            ->load(['professeur.user', 'approver', 'requester']);

        return ApiResponse::success(new PromotionResource($promotion), 'Promotion creee avec succes.', 201);
    }

    public function show(Promotion $promotion)
    {
        $this->authorize('view', $promotion);

        return ApiResponse::success(
            new PromotionResource($promotion->load(['professeur.user', 'approver', 'requester'])),
            'Promotion recuperee.'
        );
    }

    public function update(UpdatePromotionRequest $request, Promotion $promotion)
    {
        $this->authorize('update', $promotion);

        $promotion->update($request->validated());

        return ApiResponse::success(
            new PromotionResource($promotion->fresh()->load(['professeur.user', 'approver', 'requester'])),
            'Promotion mise a jour.'
        );
    }

    public function destroy(Promotion $promotion)
    {
        $this->authorize('update', $promotion);
        $promotion->delete();

        return ApiResponse::success(null, 'Promotion supprimee avec succes.');
    }

    public function approve(ApprovePromotionRequest $request, Promotion $promotion)
    {
        $this->authorize('approve', Promotion::class);

        $promotion = $this->promotionService
            ->approve($promotion, $request->user(), $request->validated());

        return ApiResponse::success(new PromotionResource($promotion), 'Promotion approuvee avec succes.');
    }

    public function reject(RejectPromotionRequest $request, Promotion $promotion)
    {
        $this->authorize('reject', Promotion::class);

        $promotion = $this->promotionService
            ->reject($promotion, $request->user(), $request->validated());

        return ApiResponse::success(new PromotionResource($promotion), 'Promotion rejetee avec succes.');
    }

    public function submitMyRequest(Request $request)
    {
        $request->validate([
            'type' => ['nullable', 'in:grade,echelon'],
            'notes' => ['nullable', 'string', 'max:1500'],
        ]);

        $professeur = $request->user()->professeur()->firstOrFail();
        $promotion = $this->promotionService
            ->submitTeacherRequest($professeur, $request->user(), $request->input('type'), $request->input('notes'))
            ->load(['professeur.user', 'approver', 'requester']);

        return ApiResponse::success(new PromotionResource($promotion), 'Demande de promotion soumise avec succes.', 201);
    }
}
