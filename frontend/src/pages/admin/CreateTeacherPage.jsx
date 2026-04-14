import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AlertCircle, FileSpreadsheet, UploadCloud, UserPlus2 } from "lucide-react";
import { toast } from "sonner";
import { professeurApi } from "@/api/professeurApi";
import { TeacherForm } from "@/features/TeacherForm";
import { cn, extractErrorMessage } from "@/lib/utils";

const modes = [
  {
    key: "create",
    title: "Creation manuelle",
    helper: "Ajouter un compte enseignant individuel.",
    badge: "Action rapide",
    icon: UserPlus2
  },
  {
    key: "import",
    title: "Import RH",
    helper: "Charger un fichier pour les creations en lot.",
    badge: "Traitement en lot",
    icon: FileSpreadsheet
  }
];

function CreateTeacherPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeMode, setActiveMode] = useState("create");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const createMutation = useMutation({
    mutationFn: (payload) => professeurApi.createTeacher(payload),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      navigate(`/admin/enseignants/${response.data.id}`);
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });

  const importMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Veuillez selectionner un fichier Excel ou CSV.");
      const formData = new FormData();
      formData.append("file", file);
      return professeurApi.importTeachers(formData);
    },
    onSuccess: (response) => {
      setResult(response.data);
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success(response.message);
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });

  return <div className="space-y-6">
      <section className="soft-panel overflow-hidden rounded-[36px] px-6 py-6 sm:px-8 sm:py-8">
        <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr] xl:items-end">
          <div className="min-w-0">
            <p className="page-eyebrow">Accounts Workspace</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-[3rem]">
              Comptes enseignants
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              L'espace a ete simplifie pour se concentrer sur une seule action a la fois:
              creation manuelle ou import RH.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="soft-card rounded-[26px] px-5 py-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Mot de passe</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Si vous laissez le mot de passe vide, le compte utilise `password` par defaut.
              </p>
            </article>
            <article className="soft-card rounded-[26px] px-5 py-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Import RH</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Formats acceptes: `.xlsx`, `.csv`, `.txt`.
              </p>
            </article>
          </div>
        </div>

        <div className="mt-8 grid gap-3 lg:grid-cols-2">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return <button
              key={mode.key}
              type="button"
              onClick={() => setActiveMode(mode.key)}
              className={cn(
                "rounded-[26px] border px-5 py-5 text-left text-sm transition",
                activeMode === mode.key
                  ? "border-sky-300 bg-[linear-gradient(145deg,#0f766e,#0891b2_55%,#2563eb)] text-white shadow-[0_28px_60px_-34px_rgba(8,145,178,0.55)]"
                  : "border-slate-200 bg-white text-slate-600 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.16)] hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl",
                  activeMode === mode.key ? "bg-white/14 text-white" : "bg-sky-100 text-sky-700"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  "status-pill",
                  activeMode === mode.key ? "bg-white/14 text-white" : "bg-slate-100 text-slate-600"
                )}>
                  {activeMode === mode.key ? "Selectionne" : mode.badge}
                </span>
              </div>
              <p className="mt-5 text-lg font-bold">{mode.title}</p>
              <p className={cn(
                "mt-2 text-sm leading-7",
                activeMode === mode.key ? "text-white/88" : "text-slate-500"
              )}>
                {mode.helper}
              </p>
            </button>;
          })}
        </div>
      </section>

      {activeMode === "create" && <section className="soft-panel rounded-[36px] px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#0f766e,#0891b2)] text-white">
              <UserPlus2 className="h-5 w-5" />
            </div>
            <div>
              <p className="page-eyebrow">Compte individuel</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Creer un compte enseignant</h2>
            </div>
          </div>

          <div className="mt-6">
            <TeacherForm
              submitLabel="Creer le compte"
              busy={createMutation.isPending}
              onSubmit={async (values) => {
                const payload = {
                  ...values,
                  password: values.password || null,
                  password_confirmation: values.password ? values.password_confirmation : null
                };

                await createMutation.mutateAsync(payload);
              }}
            />
          </div>
        </section>}

      {activeMode === "import" && <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
          <article className="soft-panel rounded-[36px] px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <p className="page-eyebrow">Import RH</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">Charger un fichier</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                ["Colonnes minimales", "NUM DRPP, Nom, Prenom, Email, Date recrutement"],
                ["Colonnes optionnelles", "Date dernier promo, Grade, Echelon, CIN, PPR, Telephone, Adresse, Specialite"],
                ["Mise a jour", "Le fichier cree ou met a jour les comptes deja existants."]
              ].map(([label, text]) => <article key={label} className="soft-card rounded-[24px] px-4 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">{label}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                </article>)}
            </div>

            <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-white/70 p-4">
              <input
                type="file"
                accept=".xlsx,.csv,.txt"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="w-full text-sm text-slate-600 file:mr-4 file:rounded-2xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              <p className="mt-3 break-all text-xs text-slate-500">
                {file ? `Fichier selectionne: ${file.name}` : "Aucun fichier selectionne"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => importMutation.mutate()}
              disabled={importMutation.isPending}
              className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-[22px] bg-slate-950 px-5 py-4 text-base font-bold text-white shadow-[0_26px_50px_-28px_rgba(15,23,42,0.52)] transition hover:bg-slate-800 disabled:opacity-60"
            >
              <UploadCloud className="h-4 w-4" />
              {importMutation.isPending ? "Importation..." : "Lancer l'import"}
            </button>
          </article>

          <article className="soft-panel rounded-[36px] px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="page-eyebrow">Resultat</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">Resume du traitement</h2>
              </div>
              <span className="status-pill bg-slate-100 text-slate-600">
                {result ? "Pret" : "En attente"}
              </span>
            </div>

            {!result && <div className="mt-6 rounded-[28px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center text-sm text-slate-500">
                Le resume apparaitra ici apres l'import du fichier.
              </div>}

            {result && <div className="mt-6 space-y-5">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    ["Crees", result.created_count ?? 0],
                    ["Mis a jour", result.updated_count ?? 0],
                    ["Ignores", result.skipped_count ?? 0]
                  ].map(([label, value]) => <article key={label} className="soft-card rounded-[24px] px-5 py-5">
                      <p className="text-sm text-slate-500">{label}</p>
                      <p className="mt-3 text-3xl font-extrabold text-slate-950">{value}</p>
                    </article>)}
                </div>

                {Boolean(result.errors?.length) && <div className="rounded-[24px] border border-amber-200 bg-amber-50/90 p-5">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                      <div className="min-w-0">
                        <p className="font-semibold text-amber-900">Lignes a verifier</p>
                        <div className="mt-3 space-y-2 break-words text-sm text-amber-800">
                          {result.errors.map((error) => <p key={error}>{error}</p>)}
                        </div>
                      </div>
                    </div>
                  </div>}
              </div>}
          </article>
        </section>}
    </div>;
}

export {
  CreateTeacherPage as default
};
