import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { professeurApi } from "@/api/professeurApi";
import { cn, extractErrorMessage, formatCountdown, formatDate, formatDateTime } from "@/lib/utils";

function TeacherDetailsPage() {
  const { id = "" } = useParams();
  const { data } = useQuery({
    queryKey: ["teacher", "details", id],
    queryFn: () => professeurApi.getTeacher(id)
  });
  const [mailForm, setMailForm] = useState({
    subject: "",
    message: ""
  });

  useEffect(() => {
    if (data?.data?.full_name) {
      setMailForm({
        subject: `Suivi du dossier de ${data.data.full_name}`,
        message: ""
      });
    }
  }, [data]);

  const contactMutation = useMutation({
    mutationFn: (payload) => professeurApi.contactTeacher(id, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      setMailForm((current) => ({ ...current, message: "" }));
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });

  const teacher = data?.data;

  if (!teacher) return null;

  return <div className="space-y-6">
      <section className="soft-panel rounded-[34px] px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-4">
          <div className="min-w-0">
            <p className="page-eyebrow">Faculty File</p>
            <h1 className="mt-3 break-words text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              {teacher.full_name}
            </h1>
            <p className="mt-3 break-words text-sm leading-7 text-slate-500">
              {teacher.email} • {teacher.grade_label} • echelon {teacher.echelon}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
          ["Numero DR", teacher.num_dr],
          ["CIN", teacher.cin ?? "Non renseigne"],
          ["Recrutement", formatDate(teacher.date_recrutement)],
          ["Derniere promotion", formatDate(teacher.date_last_promotion)]
        ].map(([label, value]) => <div key={label} className="soft-card rounded-[24px] px-4 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">{value}</p>
              </div>)}
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-2">
        <article className="soft-panel rounded-[34px] px-5 py-5 sm:px-6 sm:py-6">
          <h2 className="text-2xl font-bold text-slate-950">Synthese du dossier</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
          ["Email", teacher.email ?? "Non renseigne"],
          ["Telephone", teacher.phone ?? "Non renseigne"],
          ["Adresse", teacher.address ?? "Non renseignee"],
          ["Prochaine promotion", teacher.next_promotion?.date ? `${formatDate(teacher.next_promotion.date)} (${formatCountdown(teacher.next_promotion.date)})` : "A confirmer"]
        ].map(([label, value]) => <div key={label} className="soft-card rounded-[24px] px-4 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</p>
                <p className="mt-3 break-words text-sm font-semibold leading-7 text-slate-900">{value}</p>
              </div>)}
          </div>
        </article>

        <article className="soft-panel rounded-[34px] px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Contacter l'enseignant</h2>
              <p className="text-sm text-slate-500">Envoyez un email directement depuis le dossier.</p>
            </div>
          </div>
          <form
    className="mt-5 space-y-4"
    onSubmit={(event) => {
      event.preventDefault();
      contactMutation.mutate(mailForm);
    }}
  >
            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Objet</span>
              <input
    value={mailForm.subject}
    onChange={(event) => setMailForm((current) => ({ ...current, subject: event.target.value }))}
    className="w-full rounded-[24px] border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white"
  />
            </label>
            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Message</span>
              <textarea
    rows={6}
    value={mailForm.message}
    onChange={(event) => setMailForm((current) => ({ ...current, message: event.target.value }))}
    className="w-full rounded-[24px] border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white"
  />
            </label>
            <button className="accent-button rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105">
              {contactMutation.isPending ? "Envoi..." : "Envoyer l'email"}
            </button>
          </form>
        </article>
      </section>

      <section className="soft-panel rounded-[34px] px-5 py-5 sm:px-6 sm:py-6">
        <h2 className="text-2xl font-bold text-slate-950">Historique des promotions</h2>
        <div className="mt-5 space-y-4">
          {teacher.promotions?.map((promotion) => <div key={promotion.id} className="soft-card rounded-[24px] px-4 py-4 sm:px-5 sm:py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-950">{promotion.type_label}</p>
                    <p className="mt-1 text-sm text-slate-500">{promotion.status_label}</p>
                    <p className="mt-2 text-xs text-slate-400">{formatDateTime(promotion.created_at)}</p>
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
              </div>)}
        </div>
      </section>
    </div>;
}

export {
  TeacherDetailsPage as default
};
