import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/api/dashboardApi";
import { formatDate, formatDateTime } from "@/lib/utils";
function TeacherDashboardPage() {
  const { data } = useQuery({
    queryKey: ["dashboard", "teacher"],
    queryFn: () => dashboardApi.getTeacherDashboard()
  });
  const dashboard = data?.data;
  return <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
    ["Grade actuel", dashboard?.stats.current_grade ?? "-"],
    ["Echelon", dashboard?.stats.current_echelon ?? "-"],
    ["Anciennete", `${dashboard?.stats.years_of_service ?? 0} ans`],
    ["Documents", dashboard?.stats.documents_count ?? 0]
  ].map(([label, value]) => <article key={label} className="glass-panel rounded-[28px] border border-white/60 p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-extrabold text-slate-950">{value}</p>
          </article>)}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="glass-panel rounded-[28px] border border-white/60 p-6">
          <h3 className="text-lg font-bold text-slate-950">Mon profil</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p>{dashboard?.profile.full_name}</p>
            <p>{dashboard?.profile.email}</p>
            <p>Date de recrutement: {formatDate(dashboard?.profile.date_recrutement)}</p>
            <p>Specialite: {dashboard?.profile.specialite ?? "Non renseignee"}</p>
          </div>
        </article>

        <article className="glass-panel rounded-[28px] border border-white/60 p-6">
          <h3 className="text-lg font-bold text-slate-950">Mon eligibilite</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p>Promotion de grade: {dashboard?.eligibility.overall.eligible_for_grade ? "Eligible" : "Non eligible"}</p>
            <p>Promotion d'echelon: {dashboard?.eligibility.overall.eligible_for_echelon ? "Eligible" : "Non eligible"}</p>
            <p>Type recommande: {dashboard?.eligibility.overall.recommended_type ?? "Aucun"}</p>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="glass-panel rounded-[28px] border border-white/60 p-6">
          <h3 className="text-lg font-bold text-slate-950">Promotions recentes</h3>
          <div className="mt-4 space-y-3">
            {(dashboard?.recent_promotions ?? []).map((promotion) => <div key={promotion.id} className="rounded-2xl bg-white/80 px-4 py-3">
                <p className="font-semibold text-slate-900">{promotion.type_label}</p>
                <p className="text-sm text-slate-600">{promotion.status_label}</p>
                <p className="text-xs text-slate-500">{formatDateTime(promotion.created_at)}</p>
              </div>)}
          </div>
        </article>

        <article className="glass-panel rounded-[28px] border border-white/60 p-6">
          <h3 className="text-lg font-bold text-slate-950">Documents recents</h3>
          <div className="mt-4 space-y-3">
            {(dashboard?.recent_documents ?? []).map((document) => <div key={document.id} className="rounded-2xl bg-white/80 px-4 py-3">
                <p className="font-semibold text-slate-900">{document.display_name || document.original_name}</p>
                <p className="text-xs text-slate-500">{formatDateTime(document.created_at)}</p>
              </div>)}
          </div>
        </article>
      </section>
    </div>;
}
export {
  TeacherDashboardPage as default
};
