import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleProtectedRoute } from "@/routes/RoleProtectedRoute";
import LoginPage from "@/pages/public/LoginPage";
import RegisterPage from "@/pages/public/RegisterPage";
import UnauthorizedPage from "@/pages/shared/UnauthorizedPage";
import NotFoundPage from "@/pages/shared/NotFoundPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import TeachersListPage from "@/pages/admin/TeachersListPage";
import CreateTeacherPage from "@/pages/admin/CreateTeacherPage";
import EditTeacherPage from "@/pages/admin/EditTeacherPage";
import TeacherDetailsPage from "@/pages/admin/TeacherDetailsPage";
import PromotionManagementPage from "@/pages/admin/PromotionManagementPage";
import DocumentsManagementPage from "@/pages/admin/DocumentsManagementPage";
import TeacherDashboardPage from "@/pages/teacher/TeacherDashboardPage";
import MyProfilePage from "@/pages/teacher/MyProfilePage";
import MyDocumentsPage from "@/pages/teacher/MyDocumentsPage";
import MyPromotionsPage from "@/pages/teacher/MyPromotionsPage";
import EligibilityStatusPage from "@/pages/teacher/EligibilityStatusPage";
const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/connexion" replace /> },
  { path: "/connexion", element: <LoginPage /> },
  { path: "/inscription", element: <RegisterPage /> },
  { path: "/non-autorise", element: <UnauthorizedPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleProtectedRoute allowedRole="admin" />,
        children: [
          {
            path: "/admin",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <AdminDashboardPage /> },
              { path: "enseignants", element: <TeachersListPage /> },
              { path: "enseignants/nouveau", element: <CreateTeacherPage /> },
              { path: "enseignants/:id/modifier", element: <EditTeacherPage /> },
              { path: "enseignants/:id", element: <TeacherDetailsPage /> },
              { path: "promotions", element: <PromotionManagementPage /> },
              { path: "documents", element: <DocumentsManagementPage /> }
            ]
          }
        ]
      },
      {
        element: <RoleProtectedRoute allowedRole="teacher" />,
        children: [
          {
            path: "/teacher",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <TeacherDashboardPage /> },
              { path: "profil", element: <MyProfilePage /> },
              { path: "documents", element: <MyDocumentsPage /> },
              { path: "promotions", element: <MyPromotionsPage /> },
              { path: "eligibilite", element: <EligibilityStatusPage /> }
            ]
          }
        ]
      }
    ]
  },
  { path: "*", element: <NotFoundPage /> }
]);
export {
  router
};
