import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
function ProtectedRoute() {
  const { isAuthenticated, token } = useAuthStore();
  const location = useLocation();
  if (!isAuthenticated || !token) {
    return <Navigate to="/connexion" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
export {
  ProtectedRoute
};
