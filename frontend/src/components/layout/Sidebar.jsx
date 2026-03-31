import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
function Sidebar({
  title,
  subtitle,
  items
}) {
  return <aside className="glass-panel rounded-[28px] border border-white/60 p-5 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.45)]">
      <div className="mb-8 space-y-3">
        <span className="inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
          Systeme Promotions
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
    const Icon = item.icon;
    return <NavLink
      key={item.to}
      to={item.to}
      end={item.to === "/admin" || item.to === "/teacher"}
      className={({ isActive }) => cn(
        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
        isActive ? "bg-slate-950 text-white shadow-lg shadow-slate-900/20" : "text-slate-600 hover:bg-white hover:text-slate-950"
      )}
    >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>;
  })}
      </nav>
    </aside>;
}
export {
  Sidebar
};
