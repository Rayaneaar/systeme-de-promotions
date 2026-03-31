import { Link } from "react-router-dom";
function NotFoundPage() {
  return <div className="mx-auto flex min-h-screen max-w-2xl items-center px-4 py-10">
      <div className="glass-panel w-full rounded-[32px] border border-white/60 p-8 text-center shadow-[0_30px_60px_-40px_rgba(15,23,42,0.35)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Erreur 404</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Page introuvable</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Le chemin demande n'existe pas ou n'est plus disponible dans cette version de l'application.
        </p>
        <Link
    to="/connexion"
    className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
  >
          Revenir au portail
        </Link>
      </div>
    </div>;
}
export {
  NotFoundPage as default
};
