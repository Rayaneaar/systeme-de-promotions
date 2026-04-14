import { Link } from "react-router-dom";
import { Mail, Settings2, Upload, Users2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

function AdminSettingsPage() {
  const user = useAuthStore((state) => state.user);
  return <div className="space-y-6">
      <section className="soft-panel rounded-[36px] px-6 py-6 sm:px-8 sm:py-8">
        <div className="grid gap-6 xl:grid-cols-[1.14fr_0.86fr]">
          <div>
            <p className="page-eyebrow">Admin Settings</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-[3rem]">
              Centre de pilotage
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Retrouvez les actions structurantes du portail: import RH, suivi des dossiers,
              communication et supervision documentaire.
            </p>
          </div>

          <article className="soft-card rounded-[32px] px-6 py-6">
            <p className="page-eyebrow">Compte connecte</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">{user?.name ?? "Administrateur"}</h2>
            <p className="mt-2 text-sm text-slate-500">{user?.email}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
              <Settings2 className="h-4 w-4" />
              Admin Workspace
            </div>
          </article>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {[
      {
        icon: Upload,
        title: "Importer des enseignants",
        text: "Chargez un fichier Excel ou CSV pour creer et mettre a jour les dossiers enseignants.",
        to: "/admin/enseignants/import"
      },
      {
        icon: Users2,
        title: "Gerer les dossiers",
        text: "Consultez les fiches, les promotions et les informations importees pour chaque enseignant.",
        to: "/admin/enseignants"
      },
      {
        icon: Mail,
        title: "Communication",
        text: "Envoyez des emails depuis les fiches enseignant et gardez la relation de suivi visible.",
        to: "/admin/enseignants"
      }
    ].map((item) => {
      const Icon = item.icon;
      return <Link
        key={item.title}
        to={item.to}
        className="soft-panel rounded-[32px] px-6 py-6 transition hover:-translate-y-0.5"
      >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#6158ff,#4f46e5)] text-white shadow-[0_20px_36px_-22px_rgba(79,70,229,0.78)]">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-950">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">{item.text}</p>
          </Link>;
    })}
      </section>

      <section className="soft-panel rounded-[34px] px-6 py-6 sm:px-7">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
            <Settings2 className="h-5 w-5" />
          </div>
          <div>
            <p className="page-eyebrow">Important</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Bon a savoir</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
              Les comptes enseignants sont maintenant alimentes par import. Les enseignants peuvent
              seulement mettre a jour leur email, leur telephone et leur adresse depuis leurs
              parametres personnels.
            </p>
          </div>
        </div>
      </section>
    </div>;
}

export {
  AdminSettingsPage as default
};
