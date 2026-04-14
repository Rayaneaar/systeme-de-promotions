import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Waves
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api/authApi";
import { extractErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const highlightItems = [
  "Suivi clair des promotions et des pieces justificatives",
  "Acces unifie pour l'administration et les enseignants"
];

function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-[-9%] h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[12%] h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute bottom-[-14%] left-[16%] h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="wave-shell absolute inset-x-[-15%] bottom-[-8%] h-[320px]">
          <div className="wave-layer wave-layer-one" />
          <div className="wave-layer wave-layer-two" />
          <div className="wave-layer wave-layer-three" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative z-10 mx-auto mb-5 flex w-fit flex-wrap items-center justify-center gap-4 rounded-[30px] border border-white/70 bg-white/72 px-4 py-4 shadow-[0_28px_60px_-48px_rgba(14,116,144,0.35)] backdrop-blur-md"
      >
        <div className="partner-logo-card min-w-[10rem] sm:min-w-[12rem]">
          <img
            src="/logos/cdc.png"
            alt="Logo Centre de la Double Competence"
            className="max-h-20 w-auto object-contain sm:max-h-24"
          />
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(145deg,#0f766e,#2563eb)] text-sm font-extrabold text-white shadow-[0_22px_44px_-26px_rgba(37,99,235,0.65)]">
          x
        </div>

        <div className="partner-logo-card min-w-[10rem] sm:min-w-[12rem]">
          <img
            src="/logos/fsjes-ain-chock.png"
            alt="Logo FSJES Ain Chock"
            className="max-h-16 w-auto object-contain sm:max-h-20"
          />
        </div>
      </motion.div>

      <div className="relative mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl overflow-hidden rounded-[36px] border border-white/65 bg-[linear-gradient(145deg,rgba(255,255,255,0.7),rgba(244,249,255,0.52))] shadow-[0_48px_120px_-72px_rgba(15,23,42,0.5)] backdrop-blur-xl lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative overflow-hidden px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(255,255,255,0.95),transparent_28%),linear-gradient(155deg,rgba(240,249,255,0.98),rgba(232,245,255,0.82)_44%,rgba(226,248,239,0.78))]" />
          <div className="absolute right-[-8%] top-[16%] h-56 w-56 rounded-full border border-white/40 bg-white/20 blur-[2px]" />
          <div className="absolute bottom-[10%] left-[6%] h-28 w-28 rounded-full border border-white/50 bg-white/30" />

          <div className="relative z-10 flex h-full flex-col">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="max-w-2xl"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.34em] text-sky-500">
                Centre de la Double Competence x FSJES Ain Chock
              </p>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-[3.55rem] lg:leading-[1.04]">
                Acces simplifie a votre espace universitaire.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Accedez a la gestion des promotions, des documents et du suivi enseignant dans une
                interface plus moderne, inspiree des couleurs des deux partenaires.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="mt-8 grid gap-4 sm:grid-cols-2"
            >
              {highlightItems.map((item) => (
                <div
                  key={item}
                  className="rounded-[28px] border border-white/70 bg-white/72 px-5 py-5 shadow-[0_28px_60px_-48px_rgba(14,116,144,0.4)] backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#0ea5e9,#2563eb)] text-white shadow-[0_20px_40px_-28px_rgba(37,99,235,0.8)]">
                      <Waves className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold leading-6 text-slate-700">{item}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="relative flex items-center justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.14 }}
            className="soft-panel relative z-10 w-full max-w-[540px] overflow-hidden rounded-[34px] px-6 py-7 sm:px-8 sm:py-9"
          >
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[32px] bg-[linear-gradient(145deg,rgba(14,165,233,0.16),rgba(37,99,235,0.06))]" />

            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[linear-gradient(145deg,#0ea5e9,#2563eb)] text-white shadow-[0_22px_40px_-24px_rgba(37,99,235,0.85)]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="page-eyebrow text-sky-500">Portail securise</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
                  Connexion a la plateforme
                </h2>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-500">
              Les comptes enseignants sont importes par l&apos;administration. Utilisez vos
              identifiants institutionnels pour acceder a votre espace.
            </p>

            <form
              className="mt-8 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                loginMutation.mutate();
              }}
            >
              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                  Email Identity
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nom.prenom@universite.ma"
                    className="w-full rounded-[22px] border border-white/80 bg-white/88 py-4 pl-11 pr-4 text-sm text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white"
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                    Security Key
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-sky-600">
                    Acces securise
                  </span>
                </div>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Votre mot de passe"
                    className="w-full rounded-[22px] border border-white/80 bg-white/88 py-4 pl-11 pr-14 text-sm text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="accent-button inline-flex w-full items-center justify-center gap-2 rounded-[22px] px-5 py-4 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
              >
                {loginMutation.isPending ? "Connexion..." : "Se connecter"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-8 rounded-[24px] border border-sky-100 bg-sky-50/70 px-5 py-4 text-sm leading-7 text-slate-600">
              Les acces administrateur et enseignant sont geres depuis la base du portail. En cas
              de blocage, contactez l&apos;administration pour verifier votre compte ou reinitialiser
              votre mot de passe.
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

export {
  LoginPage as default
};
