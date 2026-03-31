import {
  Bell,
  FileText,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  UserRound,
  Users
} from "lucide-react";
const adminNavigation = [
  { label: "Vue d'ensemble", to: "/admin", icon: LayoutDashboard },
  { label: "Enseignants", to: "/admin/enseignants", icon: Users },
  { label: "Promotions", to: "/admin/promotions", icon: GraduationCap },
  { label: "Documents", to: "/admin/documents", icon: FileText }
];
const teacherNavigation = [
  { label: "Tableau de bord", to: "/teacher", icon: LayoutDashboard },
  { label: "Mon profil", to: "/teacher/profil", icon: UserRound },
  { label: "Mes documents", to: "/teacher/documents", icon: FileText },
  { label: "Mes promotions", to: "/teacher/promotions", icon: Bell },
  { label: "Eligibilite", to: "/teacher/eligibilite", icon: ShieldCheck }
];
export {
  adminNavigation,
  teacherNavigation
};
