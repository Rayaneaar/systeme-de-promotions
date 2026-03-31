import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, LogOut } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/api/authApi";
import { notificationApi } from "@/api/notificationApi";
import { useAuthStore } from "@/store/authStore";
import { extractErrorMessage, formatDateTime } from "@/lib/utils";
function Navbar() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const notificationsQuery = useQuery({
    queryKey: ["notifications", "navbar"],
    queryFn: () => notificationApi.getNotifications(5)
  });
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearSession();
      queryClient.clear();
      window.location.href = "/connexion";
    },
    onError: (error) => {
      clearSession();
      toast.error(extractErrorMessage(error));
      window.location.href = "/connexion";
    }
  });
  return <header className="glass-panel rounded-[28px] border border-white/60 px-5 py-4 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.35)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Portail</p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">
            Bonjour {user?.name?.split(" ")[0] ?? "Utilisateur"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {user?.role_label ?? "Session"} connecte(e) au systeme de gestion des promotions.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 text-sm text-slate-600">
            <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
              <Bell className="h-4 w-4" />
              Notifications
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                {notificationsQuery.data?.data.unread_count ?? 0}
              </span>
            </div>
            <div className="space-y-2">
              {(notificationsQuery.data?.data.items ?? []).slice(0, 3).map((item) => <div key={item.id} className="rounded-xl bg-slate-50 px-3 py-2">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{formatDateTime(item.created_at)}</p>
                </div>)}
              {!notificationsQuery.data?.data.items?.length && <p className="text-xs text-slate-500">Aucune notification recente.</p>}
            </div>
          </div>

          <button
    type="button"
    onClick={() => logoutMutation.mutate()}
    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
  >
            <LogOut className="h-4 w-4" />
            Se deconnecter
          </button>
        </div>
      </div>
    </header>;
}
export {
  Navbar
};
