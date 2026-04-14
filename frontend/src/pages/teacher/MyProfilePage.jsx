import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { notificationApi } from "@/api/notificationApi";
import { professeurApi } from "@/api/professeurApi";
import { extractErrorMessage, formatDate, formatDateTime } from "@/lib/utils";

function MyProfilePage() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => professeurApi.getMyProfile()
  });
  const notificationsQuery = useQuery({
    queryKey: ["notifications", "settings"],
    queryFn: () => notificationApi.getNotifications(4)
  });
  const [form, setForm] = useState({
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    if (profileQuery.data?.data) {
      setForm({
        email: profileQuery.data.data.email ?? "",
        phone: profileQuery.data.data.phone ?? "",
        address: profileQuery.data.data.address ?? ""
      });
    }
  }, [profileQuery.data]);

  const updateMutation = useMutation({
    mutationFn: () => professeurApi.updateMyProfile(form),
    onSuccess: () => {
      toast.success("Coordonnees mises a jour.");
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });

  const profile = profileQuery.data?.data;
  return <div className="space-y-6">
      <section className="soft-panel rounded-[36px] px-6 py-6 sm:px-8 sm:py-8">
        <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <div>
            <p className="page-eyebrow">Profile Studio</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-[3rem]">
              Editer mon profil
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Les informations RH importees restent verrouillees. Vous gardez seulement la main sur
              vos coordonnees de contact.
            </p>
          </div>

          <article className="soft-card rounded-[32px] px-6 py-6">
            <p className="page-eyebrow">Regle de gestion</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">Champs modifiables</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Email, telephone et adresse uniquement. Le grade, l'echelon, les dates RH et les
              identifiants administratifs sont preserves par l'import.
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <article className="soft-panel rounded-[34px] px-6 py-6 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#6158ff,#4f46e5)] text-white shadow-[0_20px_36px_-22px_rgba(79,70,229,0.78)]">
              <Settings2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Coordonnees personnelles</h2>
              <p className="text-sm text-slate-500">Ces informations restent synchronisees avec votre compte.</p>
            </div>
          </div>

          <form
    className="mt-6 space-y-4"
    onSubmit={(event) => {
      event.preventDefault();
      updateMutation.mutate();
    }}
  >
            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Email</span>
              <input
    value={form.email}
    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
    className="w-full rounded-[26px] border border-white/80 bg-white/80 px-5 py-4 text-sm text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-indigo-300 focus:bg-white"
  />
            </label>
            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Telephone</span>
              <input
    value={form.phone}
    onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
    className="w-full rounded-[26px] border border-white/80 bg-white/80 px-5 py-4 text-sm text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-indigo-300 focus:bg-white"
  />
            </label>
            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Adresse</span>
              <textarea
    rows={5}
    value={form.address}
    onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
    className="w-full rounded-[26px] border border-white/80 bg-white/80 px-5 py-4 text-sm text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-indigo-300 focus:bg-white"
  />
            </label>
            <button className="accent-button rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105">
              {updateMutation.isPending ? "Enregistrement..." : "Enregistrer mes coordonnees"}
            </button>
          </form>
        </article>

        <article className="soft-panel rounded-[34px] px-6 py-6 sm:px-7">
          <h2 className="text-2xl font-bold text-slate-950">Informations verrouillees</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
          ["Nom complet", profile?.full_name ?? "Non renseigne"],
          ["Numero DR", profile?.num_dr ?? "Non renseigne"],
          ["CIN", profile?.cin ?? "Non renseigne"],
          ["PPR", profile?.ppr ?? "Non renseigne"],
          ["Grade", profile?.grade_label ?? "Non renseigne"],
          ["Echelon", profile?.echelon ?? "Non renseigne"],
          ["Date de recrutement", formatDate(profile?.date_recrutement)],
          ["Derniere promotion", formatDate(profile?.date_last_promotion)],
          ["Specialite", profile?.specialite ?? "Non renseignee"]
        ].map(([label, value]) => <div key={label} className="soft-card rounded-[24px] px-4 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</p>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-900">{value}</p>
              </div>)}
          </div>
        </article>
      </section>

      <section className="soft-panel rounded-[34px] px-6 py-6 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <p className="page-eyebrow">Recent Alerts</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Dernieres notifications</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {(notificationsQuery.data?.data.items ?? []).map((item) => <article key={item.id} className="soft-card rounded-[26px] px-5 py-5">
              <p className="text-sm font-bold text-slate-950">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-500">{item.message}</p>
              <p className="mt-4 text-xs font-medium text-slate-400">{formatDateTime(item.created_at)}</p>
            </article>)}
        </div>
      </section>
    </div>;
}

export {
  MyProfilePage as default
};
