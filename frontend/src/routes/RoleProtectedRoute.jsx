import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
function RoleProtectedRoute({ allowedRole }) {
  const user = useAuthStore((state) => state.user);
  if (!user || user.role !== allowedRole) {
    return <Navigate to="/non-autorise" replace />;
  }
  return <Outlet />;
}
export {
  RoleProtectedRoute
};
