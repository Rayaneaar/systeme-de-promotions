import { useQuery } from "@tanstack/react-query";
import { professeurApi } from "@/api/professeurApi";
function EligibilityStatusPage() {
  const { data } = useQuery({
    queryKey: ["eligibility", "page", "me"],
    queryFn: () => professeurApi.getMyEligibility()
  });
  const eligibility = data?.data;
  return <section className="glass-panel rounded-[28px] border border-white/60 p-6">
      <h3 className="text-xl font-bold text-slate-950">Mon statut d'eligibilite</h3>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-[24px] bg-white/80 p-5">
          <p className="text-sm text-slate-500">Grade</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {eligibility?.grade.eligible ? "Eligible" : "Non eligible"}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Annees dans le grade: {eligibility?.grade.years_in_grade ?? 0}
          </p>
        </article>

        <article className="rounded-[24px] bg-white/80 p-5">
          <p className="text-sm text-slate-500">Echelon</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {eligibility?.echelon.eligible ? "Eligible" : "Non eligible"}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Annees dans l'echelon: {eligibility?.echelon.years_in_echelon ?? 0}
          </p>
        </article>
      </div>
    </section>;
}
export {
  EligibilityStatusPage as default
};
