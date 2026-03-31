import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { professeurApi } from "@/api/professeurApi";
import { promotionApi } from "@/api/promotionApi";
import { extractErrorMessage, formatDateTime } from "@/lib/utils";
function MyPromotionsPage() {
  const queryClient = useQueryClient();
  const promotionsQuery = useQuery({
    queryKey: ["promotions", "me"],
    queryFn: () => promotionApi.getMyPromotions()
  });
  const eligibilityQuery = useQuery({
    queryKey: ["eligibility", "me"],
    queryFn: () => professeurApi.getMyEligibility()
  });
  const requestMutation = useMutation({
    mutationFn: (type) => promotionApi.requestMyPromotion({ type }),
    onSuccess: () => {
      toast.success("Demande envoyee.");
      queryClient.invalidateQueries({ queryKey: ["promotions", "me"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });
  return <div className="space-y-6">
      <section className="glass-panel rounded-[28px] border border-white/60 p-6">
        <h3 className="text-xl font-bold text-slate-950">Nouvelle demande</h3>
        <p className="mt-2 text-sm text-slate-600">
          Type recommande: {eligibilityQuery.data?.data.overall.recommended_type ?? "Aucun"}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
    type="button"
    onClick={() => requestMutation.mutate("grade")}
    className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
  >
            Demander une promotion de grade
          </button>
          <button
    type="button"
    onClick={() => requestMutation.mutate("echelon")}
    className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
  >
            Demander une promotion d'echelon
          </button>
        </div>
      </section>

      <section className="glass-panel rounded-[28px] border border-white/60 p-6">
        <h3 className="text-xl font-bold text-slate-950">Historique des promotions</h3>
        <div className="mt-6 space-y-4">
          {(promotionsQuery.data?.data ?? []).map((promotion) => <article key={promotion.id} className="rounded-[24px] bg-white/80 p-5">
              <p className="font-semibold text-slate-900">{promotion.type_label}</p>
              <p className="text-sm text-slate-600">{promotion.status_label}</p>
              <p className="text-xs text-slate-500">{formatDateTime(promotion.created_at)}</p>
            </article>)}
        </div>
      </section>
    </div>;
}
export {
  MyPromotionsPage as default
};
