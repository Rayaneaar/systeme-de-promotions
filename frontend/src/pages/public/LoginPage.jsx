import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import { extractErrorMessage } from "@/lib/utils";
function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const loginMutation = useMutation({
    mutationFn: () => authApi.login({ email, password }),
    onSuccess: (response) => {
      setSession({ token: response.data.token, user: response.data.user });
      navigate(response.data.user.role === "admin" ? "/admin" : "/teacher");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    }
  });
  return <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
      <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] bg-slate-950 p-8 text-white shadow-[0_40px_120px_-50px_rgba(15,23,42,0.8)]">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
            Portail universitaire
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight">Gestion moderne des promotions.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
            Suivez l'eligibilite, pilotez les demandes de promotion et centralisez les pieces
            administratives dans une seule interface fluide.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
    ["10", "enseignants demos"],
    ["2", "roles geres"],
    ["100%", "workflow numerise"]
  ].map(([value, label]) => <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-bold">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
              </div>)}
          </div>
        </section>

        <section className="glass-panel rounded-[32px] border border-white/60 p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.35)]">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Connexion</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">Acceder a votre espace</h2>
            <p className="mt-2 text-sm text-slate-600">
              Utilisez un compte demo comme `admin@example.com` ou `teacher1@example.com`.
            </p>
          </div>

          <form
    className="space-y-4"
    onSubmit={(event) => {
      event.preventDefault();
      loginMutation.mutate();
    }}
  >
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>Email</span>
              <input
    value={email}
    onChange={(event) => setEmail(event.target.value)}
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
  />
            </label>
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>Mot de passe</span>
              <input
    type="password"
    value={password}
    onChange={(event) => setPassword(event.target.value)}
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
  />
            </label>
            <button
    type="submit"
    disabled={loginMutation.isPending}
    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
  >
              <LogIn className="h-4 w-4" />
              {loginMutation.isPending ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Nouveau compte enseignant ?{" "}
            <Link to="/inscription" className="font-semibold text-blue-700 hover:text-blue-800">
              Creer un acces
            </Link>
          </p>
        </section>
      </div>
    </div>;
}
export {
  LoginPage as default
};
