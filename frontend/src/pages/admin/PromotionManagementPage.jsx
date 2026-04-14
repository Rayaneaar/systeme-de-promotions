import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Filter, MailCheck, MessageSquareWarning, MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { dashboardApi } from "@/api/dashboardApi";
import { promotionApi } from "@/api/promotionApi";
import { cn, extractErrorMessage, formatDateTime, formatReferenceNumber } from "@/lib/utils";

function downloadCsv(rows) {
  const header = [
    "Enseignant",
    "Type",
    "Statut",
    "Ancien palier",
    "Reference actuelle",
    "Nouveau palier",
    "Nouvelle reference",
    "Date soumission"
  ];

  const csvRows = rows.map((row) => [
    row.professeur?.full_name ?? "",
    row.type_label ?? "",
    row.status_label ?? "",
    `${row.old_grade ?? ""} / echelon ${row.old_echelon ?? ""}`,
    row.old_reference_number ?? "",
    `${row.new_grade ?? ""} / echelon ${row.new_echelon ?? ""}`,
    row.new_reference_number ?? "",
    row.created_at ?? ""
  ]);

  const content = [header, ...csvRows]
    .map((line) => line.map((cell) => `"${String(cell).replaceAll("\"", "\"\"")}"`).join(","))
    .join("\n");

  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "promotion-requests.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function ActionDialog({
  title,
  description,
  tone,
  confirmLabel,
  isPending,
  onClose,
  onSubmit,
  children
}) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm">
      <div className="floating-panel w-full max-w-2xl rounded-[32px] p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="page-eyebrow">{tone}</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-surface flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition hover:text-slate-950"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          {children}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="subtle-button rounded-full px-5 py-3 text-sm font-semibold text-slate-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="accent-button rounded-full px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>;
}

function PromotionManagementPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [approveTarget, setApproveTarget] = useState(null);
  const [approveNotes, setApproveNotes] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectNotes, setRejectNotes] = useState("");

  const { data } = useQuery({
    queryKey: ["promotions", "admin"],
    queryFn: () => promotionApi.getPromotions({ per_page: 50 })
  });

  const dashboardQuery = useQuery({
    queryKey: ["dashboard", "admin", "reports"],
    queryFn: () => dashboardApi.getAdminDashboard()
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, notes }) => promotionApi.approvePromotion(id, { notes }),
    onSuccess: () => {
      toast.success("Promotion approuvee et email envoye.");
      setApproveTarget(null);
      setApproveNotes("");
      queryClient.invalidateQueries({ queryKey: ["promotions", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, rejection_reason, notes }) => promotionApi.rejectPromotion(id, { rejection_reason, notes }),
    onSuccess: () => {
      toast.success("Promotion rejetee.");
      setRejectTarget(null);
      setRejectReason("");
      setRejectNotes("");
      queryClient.invalidateQueries({ queryKey: ["promotions", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });

  const promotions = data?.data ?? [];
  const reports = dashboardQuery.data?.data?.recent_reports ?? [];

  const filteredPromotions = useMemo(() => {
    if (statusFilter === "all") return promotions;
    return promotions.filter((promotion) => promotion.status === statusFilter);
  }, [promotions, statusFilter]);

  const totalCount = promotions.length;
  const pendingCount = promotions.filter((promotion) => promotion.status === "pending").length;
  const approvedCount = promotions.filter((promotion) => promotion.status === "approved").length;
  const rejectedCount = promotions.filter((promotion) => promotion.status === "rejected").length;
  const approvalRate = totalCount ? `${((approvedCount / totalCount) * 100).toFixed(1)}%` : "0%";

  return <div className="space-y-6">
      <section className="soft-panel rounded-[36px] px-6 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="page-eyebrow">Promotion Control</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-[3.1rem]">
              Validation des promotions
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Verifiez les paliers, les numeros de reference et les signalements enseignants dans
              un seul espace. L'approbation envoie automatiquement un email d'information.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="subtle-button inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-slate-700">
              <Filter className="h-4 w-4" />
              Filtrer
            </div>
            <button
              type="button"
              onClick={() => downloadCsv(filteredPromotions)}
              className="accent-button inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105"
            >
              <Download className="h-4 w-4" />
              Exporter
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {[
            ["Demandes", totalCount, "Vue globale"],
            ["En attente", pendingCount, "A traiter"],
            ["Taux d'approbation", approvalRate, rejectedCount ? `${rejectedCount} rejetee(s)` : "Aucun rejet"],
            ["Signalements", reports.length, "Recents"]
          ].map(([label, value, helper]) => <article key={label} className="soft-card rounded-[30px] px-5 py-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">{label}</p>
              <p className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950">{value}</p>
              <p className="mt-2 text-sm text-slate-500">{helper}</p>
            </article>)}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="soft-panel rounded-[36px] px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                ["all", "Toutes"],
                ["pending", "En attente"],
                ["approved", "Approuvees"],
                ["rejected", "Rejetees"]
              ].map(([value, label]) => <button
                  key={value}
                  type="button"
                  onClick={() => setStatusFilter(value)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    statusFilter === value ? "bg-sky-600 text-white shadow-[0_18px_36px_-22px_rgba(8,145,178,0.65)]" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {label}
                </button>)}
            </div>
            <p className="text-sm text-slate-500">
              {filteredPromotions.length} demande{filteredPromotions.length > 1 ? "s" : ""} affichee{filteredPromotions.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {filteredPromotions.map((promotion) => <article key={promotion.id} className="soft-card rounded-[28px] px-5 py-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-slate-950">{promotion.professeur?.full_name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {promotion.type_label} • {promotion.status_label}
                    </p>
                    <p className="mt-2 text-xs font-medium text-slate-400">{formatDateTime(promotion.created_at)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn(
                      "status-pill",
                      promotion.status === "approved" && "bg-emerald-50 text-emerald-600",
                      promotion.status === "pending" && "bg-amber-50 text-amber-600",
                      promotion.status === "rejected" && "bg-rose-50 text-rose-600"
                    )}>
                      {promotion.status_label}
                    </span>
                    <span className="status-pill bg-slate-100 text-slate-600">{promotion.type_label}</span>
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

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {promotion.status === "pending" ? <>
                      <button
                        type="button"
                        onClick={() => {
                          setApproveTarget(promotion);
                          setApproveNotes(promotion.notes ?? "");
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                      >
                        <MailCheck className="h-4 w-4" />
                        Approuver et notifier
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRejectTarget(promotion);
                          setRejectReason("");
                          setRejectNotes(promotion.notes ?? "");
                        }}
                        className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                      >
                        Rejeter
                      </button>
                    </> : <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>}
                </div>
              </article>)}

            {!filteredPromotions.length && <div className="px-6 py-16 text-center text-sm text-slate-500">
                Aucune demande pour ce filtre.
              </div>}
          </div>
        </article>

        <article className="soft-panel rounded-[36px] px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <MessageSquareWarning className="h-5 w-5" />
            </div>
            <div>
              <p className="page-eyebrow">Reports Inbox</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Signalements enseignants</h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {reports.map((report) => <article key={report.id} className="soft-card rounded-[24px] px-5 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-950">{report.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {report.data?.teacher_name ?? "Enseignant"}
                    </p>
                  </div>
                  {!report.is_read && <span className="status-pill bg-sky-50 text-sky-700">Nouveau</span>}
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{report.message}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {report.data?.teacher_email && <span className="status-pill bg-slate-100 text-slate-600">{report.data.teacher_email}</span>}
                  {report.promotion && <span className="status-pill bg-amber-50 text-amber-700">{report.promotion.type_label}</span>}
                </div>
                <p className="mt-3 text-xs font-medium text-slate-400">{formatDateTime(report.created_at)}</p>
              </article>)}

            {!dashboardQuery.isLoading && !reports.length && <div className="soft-card rounded-[24px] px-5 py-10 text-center text-sm text-slate-500">
                Aucun signalement recent.
              </div>}
          </div>
        </article>
      </section>

      {approveTarget && <ActionDialog
          title="Approuver la promotion"
          description="Le systeme validera le nouveau palier, mettra a jour le dossier RH et enverra un email d'information a l'enseignant."
          tone="Validation et email"
          confirmLabel={approveMutation.isPending ? "Validation..." : "Confirmer l'approbation"}
          isPending={approveMutation.isPending}
          onClose={() => {
            if (!approveMutation.isPending) {
              setApproveTarget(null);
              setApproveNotes("");
            }
          }}
          onSubmit={() => approveMutation.mutate({ id: approveTarget.id, notes: approveNotes })}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Enseignant", approveTarget.professeur?.full_name ?? "-"],
              ["Email", approveTarget.professeur?.email ?? approveTarget.requester?.email ?? "Non renseigne"],
              ["Nouveau palier", `${approveTarget.new_grade ?? "-"} • echelon ${approveTarget.new_echelon ?? "-"}`],
              ["Nouvelle reference", formatReferenceNumber(approveTarget.new_reference_number)]
            ].map(([label, value]) => <div key={label} className="rounded-[22px] bg-slate-50 px-4 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">{label}</p>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-700">{value}</p>
              </div>)}
          </div>

          <label className="block space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Note administrative</span>
            <textarea
              rows={5}
              value={approveNotes}
              onChange={(event) => setApproveNotes(event.target.value)}
              placeholder="Ajoutez une note visible dans l'historique et l'email si necessaire."
              className="w-full rounded-[24px] border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white"
            />
          </label>
        </ActionDialog>}

      {rejectTarget && <ActionDialog
          title="Rejeter la promotion"
          description="Precisez le motif du rejet pour qu'il apparaisse dans le suivi enseignant."
          tone="Rejet"
          confirmLabel={rejectMutation.isPending ? "Enregistrement..." : "Confirmer le rejet"}
          isPending={rejectMutation.isPending}
          onClose={() => {
            if (!rejectMutation.isPending) {
              setRejectTarget(null);
              setRejectReason("");
              setRejectNotes("");
            }
          }}
          onSubmit={() => rejectMutation.mutate({
            id: rejectTarget.id,
            rejection_reason: rejectReason,
            notes: rejectNotes
          })}
        >
          <label className="block space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Motif du rejet</span>
            <textarea
              rows={5}
              required
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              placeholder="Expliquez clairement la raison du rejet."
              className="w-full rounded-[24px] border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-rose-300 focus:bg-white"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Note interne</span>
            <textarea
              rows={4}
              value={rejectNotes}
              onChange={(event) => setRejectNotes(event.target.value)}
              placeholder="Optionnel."
              className="w-full rounded-[24px] border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-rose-300 focus:bg-white"
            />
          </label>
        </ActionDialog>}
    </div>;
}

export {
  PromotionManagementPage as default
};
