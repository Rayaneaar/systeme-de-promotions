import { Link } from "react-router-dom";
function RegisterPage() {
  return <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="glass-panel rounded-[32px] border border-white/60 p-8 text-center shadow-[0_30px_60px_-40px_rgba(15,23,42,0.35)]">
        <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">Creation de compte desactivee</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Les comptes enseignants sont maintenant crees par import administratif de fichier Excel ou
          CSV.
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
  RegisterPage as default
};
