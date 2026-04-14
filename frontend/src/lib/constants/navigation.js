import {
  FileText,
  GraduationCap,
  LayoutDashboard,
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
  { label: "Mes documents", to: "/teacher/documents", icon: FileText },
  { label: "Mes promotions", to: "/teacher/promotions", icon: GraduationCap }
];
export {
  adminNavigation,
  teacherNavigation
};
