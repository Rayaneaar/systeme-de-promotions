import { Link } from "react-router-dom";
function UnauthorizedPage() {
  return <div className="mx-auto flex min-h-screen max-w-2xl items-center px-4 py-10">
      <div className="glass-panel w-full rounded-[32px] border border-white/60 p-8 text-center shadow-[0_30px_60px_-40px_rgba(15,23,42,0.35)]">
        <h1 className="text-3xl font-bold text-slate-950">Acces non autorise</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Votre compte n'a pas les droits necessaires pour consulter cette page.
        </p>
        <Link
    to="/connexion"
    className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
  >
          Retour a la connexion
        </Link>
      </div>
    </div>;
}
export {
  UnauthorizedPage as default
};
