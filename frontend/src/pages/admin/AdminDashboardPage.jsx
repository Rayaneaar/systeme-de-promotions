import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/api/dashboardApi";
import { formatDateTime } from "@/lib/utils";
function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: () => dashboardApi.getAdminDashboard()
  });
  const dashboard = data?.data;
  return <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
    ["Enseignants", dashboard?.stats.total_teachers ?? 0],
    ["Eligibles grade", dashboard?.stats.eligible_grade_promotions ?? 0],
    ["Eligibles echelon", dashboard?.stats.eligible_echelon_promotions ?? 0],
    ["Promotions en attente", dashboard?.stats.pending_promotions ?? 0],
    ["Documents", dashboard?.stats.total_documents ?? 0]
  ].map(([label, value]) => <article key={label} className="glass-panel rounded-[28px] border border-white/60 p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-extrabold text-slate-950">{value}</p>
          </article>)}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="glass-panel rounded-[28px] border border-white/60 p-6">
          <h3 className="text-lg font-bold text-slate-950">Promotions recentes</h3>
          <div className="mt-4 space-y-3">
            {(dashboard?.recent_promotions ?? []).map((promotion) => <div key={promotion.id} className="rounded-2xl bg-white/80 px-4 py-3">
                <p className="font-semibold text-slate-900">{promotion.professeur?.full_name}</p>
                <p className="text-sm text-slate-600">
                  {promotion.type_label} • {promotion.status_label}
                </p>
                <p className="text-xs text-slate-500">{formatDateTime(promotion.created_at)}</p>
              </div>)}
            {!isLoading && !dashboard?.recent_promotions.length && <p className="text-sm text-slate-500">Aucune promotion recente.</p>}
          </div>
        </article>

        <article className="glass-panel rounded-[28px] border border-white/60 p-6">
          <h3 className="text-lg font-bold text-slate-950">Documents recents</h3>
          <div className="mt-4 space-y-3">
            {(dashboard?.recent_documents ?? []).map((document) => <div key={document.id} className="rounded-2xl bg-white/80 px-4 py-3">
                <p className="font-semibold text-slate-900">{document.display_name || document.original_name}</p>
                <p className="text-sm text-slate-600">{document.professeur?.full_name}</p>
                <p className="text-xs text-slate-500">{formatDateTime(document.created_at)}</p>
              </div>)}
            {!isLoading && !dashboard?.recent_documents.length && <p className="text-sm text-slate-500">Aucun document recent.</p>}
          </div>
        </article>
      </section>
    </div>;
}
export {
  AdminDashboardPage as default
};
