import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { promotionApi } from "@/api/promotionApi";
import { extractErrorMessage, formatDateTime } from "@/lib/utils";
function PromotionManagementPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["promotions", "admin"],
    queryFn: () => promotionApi.getPromotions({ per_page: 50 })
  });
  const approveMutation = useMutation({
    mutationFn: ({ id, effective_date }) => promotionApi.approvePromotion(id, { effective_date }),
    onSuccess: () => {
      toast.success("Promotion approuvee.");
      queryClient.invalidateQueries({ queryKey: ["promotions", "admin"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });
  const rejectMutation = useMutation({
    mutationFn: ({ id, rejection_reason }) => promotionApi.rejectPromotion(id, { rejection_reason }),
    onSuccess: () => {
      toast.success("Promotion rejetee.");
      queryClient.invalidateQueries({ queryKey: ["promotions", "admin"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });
  return <section className="glass-panel rounded-[28px] border border-white/60 p-6">
      <h3 className="text-xl font-bold text-slate-950">Gestion des promotions</h3>
      <div className="mt-6 space-y-4">
        {(data?.data ?? []).map((promotion) => <article key={promotion.id} className="rounded-[24px] bg-white/80 p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900">{promotion.professeur?.full_name}</p>
                <p className="text-sm text-slate-600">
                  {promotion.type_label} • {promotion.status_label}
                </p>
                <p className="text-xs text-slate-500">{formatDateTime(promotion.created_at)}</p>
              </div>
              {promotion.status === "pending" && <div className="flex gap-2">
                  <button
    type="button"
    onClick={() => {
      const effectiveDate = window.prompt("Date d'effet (YYYY-MM-DD)", "");
      approveMutation.mutate({ id: promotion.id, effective_date: effectiveDate || void 0 });
    }}
    className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
  >
                    Approuver
                  </button>
                  <button
    type="button"
    onClick={() => {
      const reason = window.prompt("Motif du rejet");
      if (reason) rejectMutation.mutate({ id: promotion.id, rejection_reason: reason });
    }}
    className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
  >
                    Rejeter
                  </button>
                </div>}
            </div>
          </article>)}
      </div>
    </section>;
}
export {
  PromotionManagementPage as default
};
