import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { adminNavigation, teacherNavigation } from "@/lib/constants/navigation";
import { useAuthStore } from "@/store/authStore";
function DashboardLayout() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";
  return <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f3f5f9_46%,#eef2f7_100%)] p-3 md:p-6">
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute left-[8%] top-[8%] h-64 w-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-[10%] right-[6%] h-72 w-72 rounded-full bg-slate-200/60 blur-3xl" />
      </div>
      <div className="relative mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1440px] gap-4 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-6">
        <Sidebar
    title={isAdmin ? "Administration" : "Espace enseignant"}
    subtitle="Gestion moderne des promotions des enseignants-chercheurs au Maroc."
    items={isAdmin ? adminNavigation : teacherNavigation}
  />
        <div className="min-w-0 space-y-4 lg:space-y-6">
          <Navbar />
          <main className="min-w-0 space-y-4 lg:space-y-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>;
}
export {
  DashboardLayout
};
