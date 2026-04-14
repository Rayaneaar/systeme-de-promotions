import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  Loader2,
  LogOut,
  Mail,
  Search,
  Settings2,
  UploadCloud,
  UserCircle2,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/api/authApi";
import { notificationApi } from "@/api/notificationApi";
import { cn, extractErrorMessage, formatDateTime } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

function getNotificationMeta(type) {
  if (type === "promotion_submitted") {
    return {
      icon: UploadCloud,
      iconWrapper: "bg-indigo-100 text-indigo-600",
      badge: "bg-indigo-50 text-indigo-600"
    };
  }

  if (type === "promotion_approved") {
    return {
      icon: CheckCircle2,
      iconWrapper: "bg-emerald-100 text-emerald-600",
      badge: "bg-emerald-50 text-emerald-600"
    };
  }

  if (type === "promotion_rejected") {
    return {
      icon: XCircle,
      iconWrapper: "bg-rose-100 text-rose-600",
      badge: "bg-rose-50 text-rose-600"
    };
  }

  if (type === "admin_message") {
    return {
      icon: Mail,
      iconWrapper: "bg-amber-100 text-amber-600",
      badge: "bg-amber-50 text-amber-600"
    };
  }

  if (type === "teacher_report") {
    return {
      icon: Mail,
      iconWrapper: "bg-sky-100 text-sky-600",
      badge: "bg-sky-50 text-sky-600"
    };
  }

  return {
    icon: Bell,
    iconWrapper: "bg-slate-100 text-slate-600",
    badge: "bg-slate-100 text-slate-600"
  };
}

function getPageMeta(pathname, isAdmin) {
  if (isAdmin) {
    if (pathname.startsWith("/admin/promotions")) {
      return {
        eyebrow: "Promotion Requests",
        title: "Demandes de promotion",
        searchPlaceholder: "Rechercher une demande..."
      };
    }

    if (pathname.startsWith("/admin/enseignants/import")) {
      return {
        eyebrow: "Import Center",
        title: "Importation RH",
        searchPlaceholder: "Rechercher une colonne ou un enseignant..."
      };
    }

    if (pathname.startsWith("/admin/enseignants")) {
      return {
        eyebrow: "Faculty Directory",
        title: "Dossiers enseignants",
        searchPlaceholder: "Rechercher un enseignant..."
      };
    }

    if (pathname.startsWith("/admin/documents")) {
      return {
        eyebrow: "Document Center",
        title: "Documents",
        searchPlaceholder: "Rechercher un document..."
      };
    }

    if (pathname.startsWith("/admin/settings")) {
      return {
        eyebrow: "Settings",
        title: "Parametres administrateur",
        searchPlaceholder: "Rechercher un reglage..."
      };
    }

    return {
      eyebrow: "Administration",
      title: "Tableau de bord",
      searchPlaceholder: "Rechercher un flux ou un enseignant..."
    };
  }

  if (pathname.startsWith("/teacher/promotions")) {
    return {
      eyebrow: "Promotion Journey",
      title: "Mon dossier de promotion",
      searchPlaceholder: "Rechercher une demande..."
    };
  }

  if (pathname.startsWith("/teacher/documents")) {
    return {
      eyebrow: "Document Hub",
      title: "Mes documents",
      searchPlaceholder: "Rechercher un document..."
    };
  }

  if (pathname.startsWith("/teacher/settings")) {
    return {
      eyebrow: "Profile Studio",
      title: "Parametres personnels",
      searchPlaceholder: "Rechercher dans mes parametres..."
    };
  }

  return {
    eyebrow: "Espace enseignant",
    title: "Tableau de bord",
    searchPlaceholder: "Rechercher dans mon espace..."
  };
}

function Navbar() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [activePopover, setActivePopover] = useState(null);
  const actionsRef = useRef(null);
  const isAdmin = user?.role === "admin";
  const settingsHref = isAdmin ? "/admin/settings" : "/teacher/settings";
  const settingsTitle = isAdmin ? "Ouvrir les parametres" : "Editer le profil";
  const secondaryHref = isAdmin ? "/admin/enseignants" : "/teacher/documents";
  const secondaryTitle = isAdmin ? "Voir les dossiers" : "Ouvrir mes documents";
  const pageMeta = getPageMeta(location.pathname, isAdmin);
  const isOverviewPage = location.pathname === "/admin" || location.pathname === "/teacher";
  const initials = useMemo(() => {
    const parts = user?.name?.split(" ").filter(Boolean) ?? [];
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "U";
  }, [user?.name]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!actionsRef.current?.contains(event.target)) {
        setActivePopover(null);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setActivePopover(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const notificationsQuery = useQuery({
    queryKey: ["notifications", "navbar"],
    queryFn: () => notificationApi.getNotifications(6)
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Toutes les notifications ont ete marquees comme lues.");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    }
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

  const notifications = notificationsQuery.data?.data.items ?? [];
  const unreadCount = notificationsQuery.data?.data.unread_count ?? 0;

  return <header className="soft-panel rounded-[28px] px-4 py-3 sm:px-5 lg:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="page-eyebrow">{pageMeta.eyebrow}</span>
            <span className="status-pill bg-slate-100 text-slate-500">
              {isAdmin ? "Administration" : "Enseignant"}
            </span>
          </div>
          <div className="mt-2 flex min-w-0 items-center gap-2">
            <h2 className={cn(
              "truncate font-extrabold tracking-tight text-slate-950",
              isOverviewPage ? "text-xl sm:text-2xl" : "text-2xl sm:text-[2rem]"
            )}>
              {pageMeta.title}
            </h2>
            {!isOverviewPage && <>
                <ChevronRight className="hidden h-4 w-4 text-slate-300 sm:block" />
                <span className="hidden text-sm font-medium text-slate-400 sm:block">
                  {isAdmin ? "Workspace" : "Portal"}
                </span>
              </>}
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center xl:w-auto">
          <label className="relative min-w-0 flex-1 md:w-[280px] xl:w-[320px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
    type="text"
    placeholder={pageMeta.searchPlaceholder}
    className="w-full rounded-full border border-white/80 bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white"
  />
          </label>

          <div ref={actionsRef} className="flex items-center justify-end gap-2">
            <div className="relative">
              <button
    type="button"
    onClick={() => setActivePopover((current) => current === "notifications" ? null : "notifications")}
    className={cn(
      "icon-surface relative flex h-12 w-12 items-center justify-center rounded-full text-slate-600 transition hover:text-slate-950",
      activePopover === "notifications" && "border-indigo-200 bg-indigo-50 text-indigo-600"
    )}
  >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-[0_0_0_5px_rgba(99,102,241,0.16)]" />}
              </button>

              {activePopover === "notifications" && <div className="floating-panel absolute right-0 top-[calc(100%+14px)] z-40 w-[min(92vw,370px)] rounded-[28px] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-950">Notifications</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {unreadCount} notification{unreadCount > 1 ? "s" : ""} non lue{unreadCount > 1 ? "s" : ""}
                      </p>
                    </div>
                    {unreadCount > 0 && <button
                      type="button"
                      onClick={() => markAllAsReadMutation.mutate()}
                      disabled={markAllAsReadMutation.isPending}
                      className="subtle-button inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-60"
                    >
                      {markAllAsReadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
                      Tout lire
                    </button>}
                  </div>

                  <div className="mt-4 space-y-3">
                    {notificationsQuery.isLoading && Array.from({
                length: 3
              }).map((_, index) => <div key={index} className="soft-card rounded-[22px] px-4 py-4">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-200" />
                            <div className="min-w-0 flex-1 space-y-2">
                              <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
                              <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-100" />
                              <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
                            </div>
                          </div>
                        </div>)}

                    {notificationsQuery.isError && <div className="rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        Impossible de charger les notifications.
                      </div>}

                    {!notificationsQuery.isLoading && !notificationsQuery.isError && notifications.map((item) => {
                const meta = getNotificationMeta(item.type);
                const Icon = meta.icon;
                const isMarkingCurrent = markAsReadMutation.isPending && markAsReadMutation.variables === item.id;
                return <article
                  key={item.id}
                  className={cn(
                    "soft-card rounded-[24px] px-4 py-4 transition",
                    !item.is_read && "border-indigo-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(239,242,255,0.9))]"
                  )}
                >
                            <div className="flex items-start gap-3">
                              <div className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", meta.iconWrapper)}>
                                <Icon className="h-4 w-4" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={cn("status-pill", meta.badge)}>
                                    {item.type_label}
                                  </span>
                                  {!item.is_read && <span className="status-pill bg-indigo-50 text-indigo-600">Nouveau</span>}
                                </div>

                                <p className="mt-3 text-sm font-semibold text-slate-900">{item.title}</p>
                                <p className="mt-1 text-sm leading-6 text-slate-600">{item.message}</p>

                                <div className="mt-3 flex flex-col gap-2 border-t border-slate-200/70 pt-3 sm:flex-row sm:items-center sm:justify-between">
                                  <p className="text-xs font-medium text-slate-400">
                                    {formatDateTime(item.created_at)}
                                  </p>
                                  {!item.is_read && <button
                                    type="button"
                                    onClick={() => markAsReadMutation.mutate(item.id)}
                                    disabled={isMarkingCurrent}
                                    className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 disabled:opacity-60"
                                  >
                                    {isMarkingCurrent ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
                                    Marquer comme lue
                                  </button>}
                                </div>
                              </div>
                            </div>
                          </article>;
              })}

                    {!notificationsQuery.isLoading && !notificationsQuery.isError && !notifications.length && <div className="soft-card rounded-[24px] px-5 py-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                          <Bell className="h-5 w-5" />
                        </div>
                        <p className="mt-4 text-sm font-semibold text-slate-900">Boite de reception vide</p>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          Aucune activite recente pour le moment.
                        </p>
                      </div>}
                  </div>
                </div>}
            </div>

            <div className="relative">
              <button
    type="button"
    onClick={() => setActivePopover((current) => current === "settings" ? null : "settings")}
    className={cn(
      "icon-surface flex h-12 w-12 items-center justify-center rounded-full text-slate-600 transition hover:text-slate-950",
      activePopover === "settings" && "border-indigo-200 bg-indigo-50 text-indigo-600"
    )}
  >
                <Settings2 className="h-4 w-4" />
              </button>

              {activePopover === "settings" && <div className="floating-panel absolute right-0 top-[calc(100%+14px)] z-40 w-[min(92vw,290px)] rounded-[28px] p-4">
                  <div className="soft-card rounded-[24px] px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(145deg,#6057ff,#4f46e5)] text-sm font-bold text-white">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-950">{user?.name ?? "Utilisateur"}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                          {isAdmin ? "Admin Workspace" : "Teacher Portal"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Link
    to={settingsHref}
    onClick={() => setActivePopover(null)}
    className="soft-card flex items-center justify-between rounded-[22px] px-4 py-3 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
  >
                      {settingsTitle}
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                    <Link
    to={secondaryHref}
    onClick={() => setActivePopover(null)}
    className="soft-card flex items-center justify-between rounded-[22px] px-4 py-3 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
  >
                      {secondaryTitle}
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                    <button
    type="button"
    onClick={() => {
      setActivePopover(null);
      logoutMutation.mutate();
    }}
    className="soft-card flex w-full items-center justify-between rounded-[22px] px-4 py-3 text-sm font-semibold text-rose-600 transition hover:text-rose-700"
  >
                      Se deconnecter
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </div>}
            </div>

            <div className="soft-card hidden items-center gap-3 rounded-full px-2 py-2 sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(145deg,#0f172a,#1e293b)] text-white">
                <UserCircle2 className="h-5 w-5" />
              </div>
              <div className="pr-2">
                <p className="text-sm font-bold text-slate-900">{user?.name ?? "Utilisateur"}</p>
                <p className="text-xs text-slate-400">{isAdmin ? "Administrateur" : "Enseignant"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>;
}

export {
  Navbar
};
