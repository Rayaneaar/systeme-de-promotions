import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  BellRing,
  CheckCircle2,
  Clock3,
  FileStack,
  FolderKanban,
  ShieldCheck,
  Upload,
  Users2
} from "lucide-react";
import { dashboardApi } from "@/api/dashboardApi";
import { cn, formatDateTime } from "@/lib/utils";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon apres-midi";
  return "Bonsoir";
}

function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: () => dashboardApi.getAdminDashboard()
  });
  const dashboard = data?.data;
  const stats = [{
    label: "Enseignants",
    value: dashboard?.stats.total_teachers ?? 0,
    helper: "Base active",
    icon: Users2,
    tone: "bg-indigo-100 text-indigo-600"
  }, {
    label: "En attente",
    value: dashboard?.stats.pending_promotions ?? 0,
    helper: "Demandes a traiter",
    icon: Clock3,
    tone: "bg-amber-100 text-amber-600"
  }, {
    label: "Traitees",
    value: dashboard?.stats.processed_promotions ?? 0,
    helper: "Flux finalises",
    icon: CheckCircle2,
    tone: "bg-emerald-100 text-emerald-600"
  }, {
    label: "Documents",
    value: dashboard?.stats.total_documents ?? 0,
    helper: "Pieces disponibles",
    icon: FileStack,
    tone: "bg-sky-100 text-sky-600"
  }, {
    label: "Notifications",
    value: dashboard?.stats.unread_notifications ?? 0,
    helper: "Actions recentes",
    icon: BellRing,
    tone: "bg-rose-100 text-rose-600"
  }, {
    label: "Signalements",
    value: dashboard?.stats.teacher_reports ?? 0,
    helper: "Messages enseignants",
    icon: AlertCircle,
    tone: "bg-sky-100 text-sky-600"
  }];
  const pendingCount = dashboard?.stats.pending_promotions ?? 0;
  const processedCount = dashboard?.stats.processed_promotions ?? 0;
  const totalHandled = pendingCount + processedCount;
  const completionRate = totalHandled ? `${Math.round(processedCount / totalHandled * 100)}%` : "0%";
  const recentPromotions = dashboard?.recent_promotions ?? [];
  const recentDocuments = dashboard?.recent_documents ?? [];
  const recentReports = dashboard?.recent_reports ?? [];
  const adminHighlights = [
    `${pendingCount} demande${pendingCount > 1 ? "s" : ""} en attente`,
    `${dashboard?.stats.total_documents ?? 0} document${(dashboard?.stats.total_documents ?? 0) > 1 ? "s" : ""} centralise${(dashboard?.stats.total_documents ?? 0) > 1 ? "s" : ""}`,
    `${dashboard?.stats.total_teachers ?? 0} enseignant${(dashboard?.stats.total_teachers ?? 0) > 1 ? "s" : ""} actif${(dashboard?.stats.total_teachers ?? 0) > 1 ? "s" : ""}`
  ];
  return <div className="space-y-6">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_360px]">
        <article className="soft-panel overflow-hidden rounded-[34px] px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-sky-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Tableau de bord admin
            </span>
            <span className="status-pill bg-emerald-50 text-emerald-600">Plateforme stable</span>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
            <div className="min-w-0">
              <p className="page-eyebrow">Administration Centrale</p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                {getGreeting()}, pilotez l'activite en un coup d'oeil.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                Suivez les promotions, les imports RH et les dossiers documentaires depuis un
                espace plus compact, plus lisible et plus simple a utiliser au quotidien.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/admin/enseignants/import"
                  className="accent-button inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105"
                >
                  Importer un fichier
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/admin/promotions"
                  className="subtle-button inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
                >
                  Voir les demandes
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-3">
              {adminHighlights.map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-white/80 bg-white/75 px-4 py-3 text-sm font-semibold text-slate-700 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.28)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </article>

        <div className="grid gap-5">
          <article className="soft-card rounded-[30px] px-6 py-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="page-eyebrow">System Status</p>
                <h2 className="mt-3 text-xl font-extrabold text-slate-950">Traitement global</h2>
              </div>
              <span className="status-pill bg-emerald-50 text-emerald-600">Stable</span>
            </div>

            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Taux de traitement</p>
                <p className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950">{completionRate}</p>
              </div>
              <div className="rounded-[22px] bg-slate-50 px-4 py-3 text-right">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  En attente
                </p>
                <p className="mt-2 text-2xl font-extrabold text-slate-950">{pendingCount}</p>
              </div>
            </div>

            <div className="mt-5 h-2.5 rounded-full bg-slate-200">
              <div
                className="h-2.5 rounded-full bg-[linear-gradient(135deg,#0891b2,#2563eb)]"
                style={{
                  width: `${Math.min(100, totalHandled ? processedCount / totalHandled * 100 : 0)}%`
                }}
              />
            </div>
          </article>

          <article className="rounded-[30px] bg-[linear-gradient(145deg,#0f766e,#0891b2_55%,#2563eb)] px-6 py-6 text-white shadow-[0_28px_70px_-40px_rgba(8,145,178,0.72)]">
            <p className="page-eyebrow !text-white/70">Actions Rapides</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight">Priorites du jour</h2>
            <div className="mt-5 space-y-3 text-sm text-white/85">
              <div className="rounded-[22px] border border-white/15 bg-white/10 px-4 py-3">
                Verifier les dossiers de promotion encore non traites.
              </div>
              <div className="rounded-[22px] border border-white/15 bg-white/10 px-4 py-3">
                Completer les imports enseignants et suivre les pieces manquantes.
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return <article key={item.label} className="soft-card rounded-[28px] px-5 py-5">
              <div className="flex items-start justify-between gap-3">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", item.tone)}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="status-pill bg-slate-100 text-slate-500">{item.helper}</span>
              </div>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
                {item.label}
              </p>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950">{item.value}</p>
            </article>;
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <article className="soft-panel rounded-[32px] px-6 py-6 sm:px-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="page-eyebrow">System Activity</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950">Activite recente</h2>
            </div>
            <Link to="/admin/promotions" className="text-sm font-semibold text-indigo-600">
              Voir tout
            </Link>
          </div>

          <div className="mt-6 space-y-5">
            {recentPromotions.map((promotion, index) => <article key={promotion.id} className="relative pl-10">
                {index !== recentPromotions.length - 1 && <span className="absolute left-[0.95rem] top-9 h-[calc(100%+1.25rem)] w-px bg-slate-200" />}
                <span className={cn(
              "absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full",
              promotion.status === "approved" ? "bg-emerald-100 text-emerald-600" : promotion.status === "rejected" ? "bg-rose-100 text-rose-600" : "bg-indigo-100 text-indigo-600"
            )}>
                  {promotion.status === "approved" ? <CheckCircle2 className="h-4 w-4" /> : promotion.status === "rejected" ? <BellRing className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                </span>
                <div className="soft-card rounded-[26px] px-5 py-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-base font-bold text-slate-950">
                        {promotion.professeur?.full_name ?? "Enseignant"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {promotion.type_label} • {promotion.status_label}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Ancien grade: {promotion.old_grade ?? "-"} / nouvel objectif: {promotion.new_grade ?? `echelon ${promotion.new_echelon ?? "-"}`}
                      </p>
                    </div>
                    <p className="text-xs font-medium text-slate-400">
                      {formatDateTime(promotion.created_at)}
                    </p>
                  </div>
                </div>
              </article>)}
            {!isLoading && !recentPromotions.length && <div className="soft-card rounded-[26px] px-5 py-10 text-center text-sm text-slate-500">
                Aucune promotion recente.
              </div>}
          </div>
        </article>

        <div className="grid gap-6">
          <article className="soft-panel rounded-[32px] px-6 py-6 sm:px-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="page-eyebrow">Reports Inbox</p>
                <h2 className="mt-3 text-2xl font-bold text-slate-950">Signalements enseignants</h2>
              </div>
              <span className="status-pill bg-sky-50 text-sky-700">{recentReports.length}</span>
            </div>

            <div className="mt-6 space-y-4">
              {recentReports.map((report) => <article key={report.id} className="soft-card rounded-[24px] px-5 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-950">{report.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {report.data?.teacher_name ?? "Enseignant"} {report.data?.teacher_email ? `• ${report.data.teacher_email}` : ""}
                      </p>
                    </div>
                    {!report.is_read && <span className="status-pill bg-sky-50 text-sky-700">Nouveau</span>}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{report.message}</p>
                  <p className="mt-3 text-xs font-medium text-slate-400">{formatDateTime(report.created_at)}</p>
                </article>)}

              {!isLoading && !recentReports.length && <div className="soft-card rounded-[24px] px-5 py-10 text-center text-sm text-slate-500">
                  Aucun signalement pour le moment.
                </div>}
            </div>
          </article>

          <article className="soft-panel rounded-[32px] px-6 py-6 sm:px-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="page-eyebrow">Document Feed</p>
                <h2 className="mt-3 text-2xl font-bold text-slate-950">Documents recents</h2>
              </div>
              <Link to="/admin/documents" className="text-sm font-semibold text-indigo-600">
                Ouvrir
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {recentDocuments.map((document) => <article key={document.id} className="soft-card rounded-[24px] px-5 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-950">
                        {document.display_name || document.original_name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{document.professeur?.full_name}</p>
                    </div>
                    <span className="status-pill bg-slate-100 text-slate-600">{document.category_label}</span>
                  </div>
                  <p className="mt-4 text-xs font-medium text-slate-400">{formatDateTime(document.created_at)}</p>
                </article>)}
              {!isLoading && !recentDocuments.length && <div className="soft-card rounded-[24px] px-5 py-10 text-center text-sm text-slate-500">
                  Aucun document recent.
                </div>}
            </div>
          </article>

          <article className="soft-card rounded-[32px] px-6 py-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                <FolderKanban className="h-5 w-5" />
              </div>
              <div>
                <p className="page-eyebrow">Coordination</p>
                <h2 className="mt-2 text-xl font-extrabold text-slate-950">Espace de suivi rapide</h2>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Centralisez les imports, les promotions et les documents sans surcharger la page.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>;
}

export {
  AdminDashboardPage as default
};
