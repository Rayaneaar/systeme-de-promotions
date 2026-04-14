import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Clock3, SendHorizonal, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { dashboardApi } from "@/api/dashboardApi";
import { promotionApi } from "@/api/promotionApi";
import {
  cn,
  extractErrorMessage,
  formatCountdown,
  formatDate,
  formatDateTime,
  formatReferenceNumber
} from "@/lib/utils";

function MyPromotionsPage() {
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState("");
  const [reportForm, setReportForm] = useState({
    subject: "Signalement sur mon dossier de promotion",
    message: "",
    promotion_id: ""
  });

  const promotionsQuery = useQuery({
    queryKey: ["promotions", "me"],
    queryFn: () => promotionApi.getMyPromotions()
  });

  const dashboardQuery = useQuery({
    queryKey: ["dashboard", "teacher", "promotions"],
    queryFn: () => dashboardApi.getTeacherDashboard()
  });

  const requestMutation = useMutation({
    mutationFn: () => promotionApi.requestMyPromotion({ notes }),
    onSuccess: () => {
      toast.success("Demande envoyee.");
      setNotes("");
      queryClient.invalidateQueries({ queryKey: ["promotions", "me"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "teacher"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });

  const reportMutation = useMutation({
    mutationFn: () => promotionApi.reportIssue({
      ...reportForm,
      promotion_id: reportForm.promotion_id || null
    }),
    onSuccess: (response) => {
      toast.success(response.message);
      setReportForm({
        subject: "Signalement sur mon dossier de promotion",
        message: "",
        promotion_id: ""
      });
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });

  const dashboard = dashboardQuery.data?.data;
  const profile = dashboard?.profile;
  const canSubmit = dashboard?.eligibility?.overall?.can_submit_request;
  const promotions = promotionsQuery.data?.data ?? [];
  const referenceMatrix = profile?.promotion_reference_matrix ?? [];
  const pendingPromotions = useMemo(
    () => promotions.filter((promotion) => promotion.status === "pending"),
    [promotions]
  );

  return <div className="space-y-6">
      <section className="soft-panel overflow-hidden rounded-[36px] px-6 py-6 sm:px-8 sm:py-8">
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="min-w-0">
            <p className="page-eyebrow">Promotion Workspace</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-[3rem]">
              Suivi des promotions et numeros de reference
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Votre dossier centralise le palier actuel, le prochain avancement et le tableau des
              references associees a chaque grade et echelon.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {[
                ["Grade actuel", `${profile?.grade ?? "-"} • echelon ${profile?.echelon ?? "-"}`],
                ["Numero de reference", formatReferenceNumber(profile?.reference_number)],
                ["Derniere promotion", formatDate(profile?.date_last_promotion)],
                ["Prochaine promotion", dashboard?.next_promotion?.date ? `${formatDate(dashboard?.next_promotion.date)} • ${formatCountdown(dashboard?.next_promotion.date)}` : "Date a confirmer"]
              ].map(([label, value]) => <article key={label} className="soft-card rounded-[26px] px-5 py-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">{label}</p>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-900">{value}</p>
                </article>)}
            </div>
          </div>

          <article className="rounded-[34px] bg-[linear-gradient(145deg,#0f766e,#0891b2_55%,#2563eb)] px-6 py-6 text-white shadow-[0_34px_72px_-44px_rgba(8,145,178,0.72)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="page-eyebrow !text-white/70">Cycle en cours</p>
                <p className="mt-1 text-lg font-bold">{dashboard?.next_promotion?.label ?? "Prochaine fenetre"}</p>
              </div>
            </div>

            <p className="mt-6 text-4xl font-extrabold tracking-tight">
              {dashboard?.next_promotion?.date ? formatCountdown(dashboard?.next_promotion.date) : "A confirmer"}
            </p>
            <p className="mt-3 text-sm leading-7 text-cyan-50/90">
              {dashboard?.next_promotion?.date ? `Le systeme vise le ${formatDate(dashboard?.next_promotion.date)} pour votre prochain passage.` : "Le calcul sera ajuste automatiquement a partir de votre dossier RH."}
            </p>

            <button
              type="button"
              onClick={() => requestMutation.mutate()}
              disabled={requestMutation.isPending || !canSubmit}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <SendHorizonal className="h-4 w-4" />
              {requestMutation.isPending ? "Envoi..." : "Soumettre ma demande"}
            </button>

            <div className="mt-5 rounded-[22px] border border-white/12 bg-white/10 px-4 py-4 text-sm leading-7 text-cyan-50/90">
              La validation administrative envoie maintenant un email d'information a l'enseignant.
            </div>

            {!canSubmit && <p className="mt-3 text-xs leading-6 text-cyan-50/80">
                La soumission sera disponible automatiquement lorsque votre prochaine promotion sera atteinte.
              </p>}
          </article>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <article className="soft-panel rounded-[34px] px-6 py-6 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <p className="page-eyebrow">Tableau de reference</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Grades et numeros</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {referenceMatrix.map((grade) => <div key={grade.grade} className="soft-card rounded-[26px] px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-950">Grade {grade.grade}</h3>
                  <span className="status-pill bg-sky-50 text-sky-700">Reference</span>
                </div>

                <div className="mt-4 space-y-3">
                  {grade.rows.map((row) => <div
                    key={`${grade.grade}-${row.echelon}`}
                    className={cn(
                      "flex items-center justify-between rounded-[18px] px-3 py-3 text-sm",
                      profile?.grade === grade.grade && profile?.echelon === row.echelon ? "bg-sky-50 text-sky-700" : "bg-slate-50 text-slate-600"
                    )}
                  >
                      <span>Echelon {row.echelon}</span>
                      <span className="font-bold">{row.reference_number}</span>
                    </div>)}
                </div>
              </div>)}
          </div>
        </article>

        <article className="soft-panel rounded-[34px] px-6 py-6 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="page-eyebrow">Signaler un probleme</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Transmettre un report a l'administration</h2>
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-slate-500">
            Utilisez ce formulaire si vous constatez une erreur sur votre dossier, votre
            classement ou vos pieces justificatives. Les administrateurs verront le signalement
            dans leur espace.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              reportMutation.mutate();
            }}
          >
            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Objet</span>
              <input
                value={reportForm.subject}
                onChange={(event) => setReportForm((current) => ({ ...current, subject: event.target.value }))}
                className="w-full rounded-[24px] border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Demande concernee</span>
              <select
                value={reportForm.promotion_id}
                onChange={(event) => setReportForm((current) => ({ ...current, promotion_id: event.target.value }))}
                className="w-full rounded-[24px] border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white"
              >
                <option value="">Signalement general</option>
                {promotions.map((promotion) => <option key={promotion.id} value={promotion.id}>
                    {promotion.type_label} • {promotion.status_label} • {formatDate(promotion.created_at)}
                  </option>)}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Message</span>
              <textarea
                rows={6}
                value={reportForm.message}
                onChange={(event) => setReportForm((current) => ({ ...current, message: event.target.value }))}
                placeholder="Expliquez clairement ce qui doit etre corrige ou verifie."
                className="w-full rounded-[28px] border border-white/80 bg-white/80 px-5 py-4 text-sm text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white"
              />
            </label>

            <button
              type="submit"
              disabled={reportMutation.isPending}
              className="accent-button inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
            >
              {reportMutation.isPending ? "Transmission..." : "Envoyer le signalement"}
            </button>
          </form>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Demandes en attente", pendingPromotions.length],
              ["Promotions validees", dashboard?.folder_statuses?.approved ?? 0]
            ].map(([label, value]) => <div key={label} className="soft-card rounded-[22px] px-4 py-4">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-extrabold text-slate-950">{value}</p>
              </div>)}
          </div>
        </article>
      </section>

      <section className="soft-panel rounded-[36px] px-6 py-6 sm:px-8 sm:py-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="page-eyebrow">Historique</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">Demandes et suivi</h2>
          </div>
          <span className="text-sm text-slate-500">{promotions.length} entree{promotions.length > 1 ? "s" : ""}</span>
        </div>

        <div className="mt-6 space-y-4">
          {promotions.map((promotion) => <article key={promotion.id} className="soft-card rounded-[28px] px-5 py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-base font-bold text-slate-950">{promotion.type_label}</p>
                  <p className="mt-1 text-sm text-slate-500">{promotion.status_label}</p>
                  <p className="mt-2 text-xs font-medium text-slate-400">{formatDateTime(promotion.created_at)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {promotion.tracking_steps?.map((step) => <span
                    key={step.key}
                    className={cn(
                      "status-pill",
                      step.state === "completed" && "bg-slate-900 text-white",
                      step.state === "current" && "bg-sky-50 text-sky-700",
                      step.state === "upcoming" && "bg-slate-100 text-slate-500"
                    )}
                  >
                    {step.label}
                  </span>)}
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Palier actuel", `${promotion.old_grade ?? "-"} • echelon ${promotion.old_echelon ?? "-"}`],
                  ["Reference actuelle", formatReferenceNumber(promotion.old_reference_number)],
                  ["Nouveau palier", `${promotion.new_grade ?? "-"} • echelon ${promotion.new_echelon ?? "-"}`],
                  ["Nouvelle reference", formatReferenceNumber(promotion.new_reference_number)]
                ].map(([label, value]) => <div key={label} className="rounded-[22px] bg-slate-50 px-4 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">{label}</p>
                    <p className="mt-3 text-sm font-semibold leading-7 text-slate-700">{value}</p>
                  </div>)}
              </div>

              {(promotion.notes || promotion.rejection_reason) && <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {promotion.notes && <div className="rounded-[22px] bg-slate-50 px-4 py-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Notes</p>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{promotion.notes}</p>
                    </div>}
                  {promotion.rejection_reason && <div className="rounded-[22px] bg-rose-50 px-4 py-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-rose-400">Motif du rejet</p>
                      <p className="mt-3 text-sm leading-7 text-rose-600">{promotion.rejection_reason}</p>
                    </div>}
                </div>}
            </article>)}

          {!promotions.length && <div className="soft-card rounded-[28px] px-6 py-14 text-center text-sm text-slate-500">
              Aucune demande de promotion pour le moment.
            </div>}
        </div>
      </section>
    </div>;
}

export {
  MyPromotionsPage as default
};
