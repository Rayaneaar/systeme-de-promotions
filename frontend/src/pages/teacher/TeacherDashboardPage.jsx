import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarClock,
  FileText,
  FolderKanban,
  GraduationCap,
  Sparkles
} from "lucide-react";
import { dashboardApi } from "@/api/dashboardApi";
import {
  cn,
  formatCountdown,
  formatDate,
  formatDateTime,
  formatReferenceNumber,
  formatServiceDuration
} from "@/lib/utils";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon apres-midi";
  return "Bonsoir";
}

function TeacherDashboardPage() {
  const { data } = useQuery({
    queryKey: ["dashboard", "teacher"],
    queryFn: () => dashboardApi.getTeacherDashboard()
  });
  const dashboard = data?.data;
  const serviceDuration = formatServiceDuration(dashboard?.profile.date_recrutement);
  const firstName = dashboard?.profile.first_name ?? dashboard?.profile.full_name ?? "enseignant";
  const folderCards = [{
    label: "Soumis",
    value: dashboard?.folder_statuses?.submitted ?? 0,
    tone: "bg-indigo-100 text-indigo-600"
  }, {
    label: "En cours",
    value: dashboard?.folder_statuses?.processing ?? 0,
    tone: "bg-amber-100 text-amber-600"
  }, {
    label: "Acceptes",
    value: dashboard?.folder_statuses?.approved ?? 0,
    tone: "bg-emerald-100 text-emerald-600"
  }, {
    label: "Rejetes",
    value: dashboard?.folder_statuses?.rejected ?? 0,
    tone: "bg-rose-100 text-rose-600"
  }];
  return <div className="space-y-6">
      <section className="soft-panel overflow-hidden rounded-[36px] px-6 py-6 sm:px-8 sm:py-8">
        <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
          <div>
            <p className="page-eyebrow">Personal Dashboard</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-[3.2rem]">
              {getGreeting()}, {firstName}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Retrouvez les dates de recrutement, le dernier avancement, le prochain palier et
              tout l'etat de votre dossier dans une seule interface.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
          ["Grade actuel", `${dashboard?.stats.current_grade ?? "-"} • echelon ${dashboard?.stats.current_echelon ?? "-"}`],
          ["Numero de reference", formatReferenceNumber(dashboard?.profile.reference_number)],
          ["Date de recrutement", formatDate(dashboard?.profile.date_recrutement)],
          ["Derniere promotion", formatDate(dashboard?.profile.date_last_promotion)],
          ["Prochaine promotion", dashboard?.next_promotion?.date ? `${formatDate(dashboard?.next_promotion.date)} • ${formatCountdown(dashboard?.next_promotion.date)}` : "Date a confirmer"]
        ].map(([label, value]) => <article key={label} className="soft-card rounded-[28px] px-5 py-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">{label}</p>
                  <p className="mt-3 text-lg font-bold leading-7 text-slate-950">{value}</p>
                </article>)}
            </div>
          </div>

          <div className="rounded-[34px] bg-[linear-gradient(145deg,#5c55ff,#4f46e5_55%,#4338ca)] px-6 py-6 text-white shadow-[0_34px_72px_-44px_rgba(79,70,229,0.75)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="page-eyebrow !text-indigo-100/80">Review Cycle</p>
                <p className="mt-1 text-lg font-bold">
                  {dashboard?.next_promotion?.label ?? "Prochaine etape"}
                </p>
              </div>
            </div>

            <p className="mt-6 text-4xl font-extrabold tracking-tight">
              {dashboard?.next_promotion?.date ? formatCountdown(dashboard?.next_promotion.date) : "A confirmer"}
            </p>
            <p className="mt-3 text-sm leading-7 text-indigo-100/90">
              {dashboard?.next_promotion?.date ? `Date cible: ${formatDate(dashboard?.next_promotion.date)}` : "La date sera calculee automatiquement a partir de votre dossier RH."}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
          {
            label: "Anciennete",
            value: serviceDuration,
            icon: CalendarClock
          },
          {
            label: "Documents",
            value: dashboard?.stats.documents_count ?? 0,
            icon: FileText
          },
          {
            label: "Promotions",
            value: dashboard?.stats.promotions_count ?? 0,
            icon: GraduationCap
          },
          {
            label: "En cours",
            value: dashboard?.folder_statuses?.processing ?? 0,
            icon: FolderKanban
          }
        ].map((item) => {
          const Icon = item.icon;
          return <div key={item.label} className="rounded-[22px] border border-white/12 bg-white/10 px-4 py-4">
                  <div className="flex items-center gap-2 text-indigo-100">
                    <Icon className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-[0.2em]">{item.label}</span>
                  </div>
                  <p className="mt-3 text-2xl font-bold text-white">{item.value}</p>
                </div>;
        })}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
      to="/teacher/promotions"
      className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
    >
                Ouvrir mon dossier
              </Link>
              <Link
      to="/teacher/settings"
      className="inline-flex items-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
    >
                Editer mes coordonnees
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {folderCards.map((item) => <article key={item.label} className="soft-card rounded-[28px] px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-500">{item.label}</p>
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold", item.tone)}>
                {item.value}
              </span>
            </div>
            <p className="mt-5 text-3xl font-extrabold text-slate-950">{item.value}</p>
          </article>)}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <article className="soft-panel rounded-[34px] px-6 py-6 sm:px-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="page-eyebrow">Promotion History</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950">Suivi des demandes</h2>
            </div>
            <Link to="/teacher/promotions" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {(dashboard?.recent_promotions ?? []).map((promotion) => <article key={promotion.id} className="soft-card rounded-[26px] px-5 py-5">
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
                        step.state === "current" && "bg-indigo-50 text-indigo-600",
                        step.state === "upcoming" && "bg-slate-100 text-slate-500"
                      )}
                    >
                      {step.label}
                    </span>)}
                  </div>
                </div>
              </article>)}
          </div>
        </article>

        <div className="grid gap-6">
          <article className="soft-panel rounded-[34px] px-6 py-6 sm:px-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="page-eyebrow">Document Feed</p>
                <h2 className="mt-3 text-2xl font-bold text-slate-950">Documents recents</h2>
              </div>
              <Link to="/teacher/documents" className="text-sm font-semibold text-indigo-600">
                Ouvrir
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {(dashboard?.recent_documents ?? []).map((document) => <article key={document.id} className="soft-card rounded-[24px] px-5 py-4">
                  <p className="text-sm font-bold text-slate-950">{document.display_name || document.original_name}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="status-pill bg-slate-100 text-slate-600">{document.category_label}</span>
                    <span className="text-xs font-medium text-slate-400">{formatDateTime(document.created_at)}</span>
                  </div>
                </article>)}
            </div>
          </article>

          <article className="soft-card rounded-[34px] px-6 py-6">
            <p className="page-eyebrow">Quick Focus</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">Prochain cap</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Votre prochaine promotion est calculee depuis le dossier RH. Les numeros de
              reference sont maintenant affiches directement pour simplifier le suivi.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
      to="/teacher/documents"
      className="subtle-button inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold text-slate-700"
    >
                Mettre a jour mes documents
              </Link>
              <Link
      to="/teacher/promotions"
      className="accent-button inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold text-white"
    >
                Voir mon cycle
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>;
}

export {
  TeacherDashboardPage as default
};
