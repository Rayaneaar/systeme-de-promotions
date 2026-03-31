import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import { extractErrorMessage } from "@/lib/utils";
const initialState = {
  num_dr: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  password_confirmation: "",
  cin: "",
  ppr: "",
  date_of_birth: "",
  phone: "",
  address: "",
  specialite: "",
  grade: "A",
  echelon: 1,
  date_recrutement: ""
};
function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [form, setForm] = useState(initialState);
  const registerMutation = useMutation({
    mutationFn: () => authApi.register(form),
    onSuccess: (response) => {
      setSession({ token: response.data.token, user: response.data.user });
      navigate("/teacher");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    }
  });
  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }
  return <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="glass-panel rounded-[32px] border border-white/60 p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.35)]">
        <h1 className="text-3xl font-bold text-slate-950">Creer un compte enseignant</h1>
        <p className="mt-2 text-sm text-slate-600">
          Renseignez les informations essentielles pour ouvrir votre espace personnel.
        </p>

        <form
    className="mt-8 grid gap-4 md:grid-cols-2"
    onSubmit={(event) => {
      event.preventDefault();
      registerMutation.mutate();
    }}
  >
          {[
    ["num_dr", "Numero DR", "text"],
    ["first_name", "Prenom", "text"],
    ["last_name", "Nom", "text"],
    ["email", "Email", "email"],
    ["password", "Mot de passe", "password"],
    ["password_confirmation", "Confirmation", "password"],
    ["cin", "CIN", "text"],
    ["ppr", "PPR", "text"],
    ["date_of_birth", "Date de naissance", "date"],
    ["phone", "Telephone", "text"],
    ["specialite", "Specialite", "text"],
    ["date_recrutement", "Date de recrutement", "date"]
  ].map(([key, label, type]) => <label key={key} className="space-y-2 text-sm font-medium text-slate-700">
              <span>{label}</span>
              <input
    type={type}
    value={String(form[key] ?? "")}
    onChange={(event) => update(key, event.target.value)}
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
  />
            </label>)}

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Grade</span>
            <select
    value={form.grade}
    onChange={(event) => update("grade", event.target.value)}
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
  >
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
              <option value="C">Grade C</option>
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Echelon</span>
            <input
    type="number"
    min={1}
    max={4}
    value={form.echelon}
    onChange={(event) => update("echelon", Number(event.target.value))}
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
  />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            <span>Adresse</span>
            <textarea
    rows={3}
    value={form.address ?? ""}
    onChange={(event) => update("address", event.target.value)}
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
  />
          </label>

          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
    type="submit"
    disabled={registerMutation.isPending}
    className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
  >
              {registerMutation.isPending ? "Creation..." : "Creer mon compte"}
            </button>
            <Link to="/connexion" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
              Retour a la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>;
}
export {
  RegisterPage as default
};
