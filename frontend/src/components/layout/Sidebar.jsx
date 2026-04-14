import { HelpCircle, Plus, Sparkles } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
function Sidebar({
  title,
  subtitle,
  items,
  quickAction
}) {
  return <aside className="sidebar-panel h-fit rounded-[28px] border border-white/70 p-4 sm:p-5 xl:sticky xl:top-5 2xl:top-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#0891b2,#2563eb)] text-white shadow-[0_22px_40px_-24px_rgba(37,99,235,0.62)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Systeme Promotions</p>
          <h1 className="mt-2 text-xl font-extrabold tracking-tight text-slate-950 sm:text-[1.45rem]">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
        </div>
      </div>

      <nav className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {items.map((item) => {
    const Icon = item.icon;
    return <NavLink
      key={item.to}
      to={item.to}
      end={item.to === "/admin" || item.to === "/teacher"}
      className={({ isActive }) => cn(
        "flex min-w-0 items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-semibold transition",
        isActive ? "bg-[linear-gradient(135deg,rgba(92,85,255,0.14),rgba(79,70,229,0.08))] text-indigo-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]" : "text-slate-500 hover:bg-white/75 hover:text-slate-950"
      )}
    >
              <span className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition",
        "bg-white/70 text-slate-500 shadow-[0_12px_24px_-22px_rgba(15,23,42,0.5)]"
      )}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="truncate">{item.label}</span>
            </NavLink>;
  })}
      </nav>

      <div className="mt-6 space-y-4">
        {quickAction && <Link
          to={quickAction.to}
          className="accent-button inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105"
        >
            <Plus className="h-4 w-4" />
            {quickAction.label}
          </Link>}

        <div className="soft-card rounded-[22px] px-4 py-4">
          <div className="flex items-center gap-3 text-slate-500">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Help Center</p>
              <p className="mt-1 text-sm font-medium text-slate-600">Besoin d'aide sur le portail</p>
            </div>
          </div>
        </div>
      </div>
    </aside>;
}
export {
  Sidebar
};
