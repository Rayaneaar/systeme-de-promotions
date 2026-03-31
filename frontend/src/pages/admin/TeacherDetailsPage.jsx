import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { professeurApi } from "@/api/professeurApi";
import { formatDate, formatDateTime } from "@/lib/utils";
function TeacherDetailsPage() {
  const { id = "" } = useParams();
  const { data } = useQuery({
    queryKey: ["teacher", "details", id],
    queryFn: () => professeurApi.getTeacher(id)
  });
  const teacher = data?.data;
  const eligibility = teacher?.eligibility;
  if (!teacher) return null;
  return <div className="space-y-6">
      <section className="glass-panel rounded-[28px] border border-white/60 p-6">
        <h3 className="text-2xl font-bold text-slate-950">{teacher.full_name}</h3>
        <p className="mt-2 text-sm text-slate-600">
          {teacher.email} • {teacher.grade_label} • echelon {teacher.echelon}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
    ["Numero DR", teacher.num_dr],
    ["CIN", teacher.cin ?? "Non renseigne"],
    ["Recrutement", formatDate(teacher.date_recrutement)],
    ["Derniere promotion", formatDate(teacher.date_last_promotion)]
  ].map(([label, value]) => <div key={label} className="rounded-2xl bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
            </div>)}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="glass-panel rounded-[28px] border border-white/60 p-6">
          <h4 className="text-lg font-bold text-slate-950">Eligibilite</h4>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <p>Promotion de grade: {eligibility?.overall.eligible_for_grade ? "Eligible" : "Non eligible"}</p>
            <p>Promotion d'echelon: {eligibility?.overall.eligible_for_echelon ? "Eligible" : "Non eligible"}</p>
            <p>Recommandation: {eligibility?.overall.recommended_type ?? "Aucune"}</p>
          </div>
        </article>

        <article className="glass-panel rounded-[28px] border border-white/60 p-6">
          <h4 className="text-lg font-bold text-slate-950">Promotions recentes</h4>
          <div className="mt-4 space-y-3">
            {teacher.promotions?.map((promotion) => <div key={promotion.id} className="rounded-2xl bg-white/80 p-4">
                  <p className="font-semibold text-slate-900">{promotion.type_label}</p>
                  <p className="text-sm text-slate-600">{promotion.status_label}</p>
                  <p className="text-xs text-slate-500">{formatDateTime(promotion.created_at)}</p>
                </div>)}
          </div>
        </article>
      </section>
    </div>;
}
export {
  TeacherDetailsPage as default
};
