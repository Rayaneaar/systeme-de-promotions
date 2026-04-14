import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { adminNavigation, teacherNavigation } from "@/lib/constants/navigation";
import { useAuthStore } from "@/store/authStore";
function DashboardLayout() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";
  const quickAction = isAdmin ? null : {
    label: "Nouvelle demande",
    to: "/teacher/promotions"
  };
  return <div className="min-h-screen px-3 py-3 sm:px-4 sm:py-4 xl:px-5 xl:py-5 2xl:px-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-4%] top-[12%] h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute right-[8%] top-[8%] h-64 w-64 rounded-full bg-white/80 blur-3xl" />
        <div className="absolute bottom-[-2%] right-[12%] h-72 w-72 rounded-full bg-sky-200/20 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-[1680px] items-start gap-4 xl:grid-cols-[258px_minmax(0,1fr)] xl:gap-5 2xl:grid-cols-[270px_minmax(0,1fr)] 2xl:gap-6">
        <Sidebar
    title={isAdmin ? "Administration" : "Espace enseignant"}
    subtitle={isAdmin ? "Pilotage des comptes importes, des promotions et des flux documentaires." : "Suivi lumineux de votre dossier, de vos pieces et des prochaines promotions."}
    items={isAdmin ? adminNavigation : teacherNavigation}
    quickAction={quickAction}
  />
        <div className="min-w-0 space-y-4">
          <Navbar />
          <main className="min-w-0 space-y-6 pb-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>;
}
export {
  DashboardLayout
};
