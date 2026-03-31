import { api } from "@/api/axios";
const dashboardApi = {
  getAdminDashboard: async () => {
    const { data } = await api.get("/dashboard/admin");
    return data;
  },
  getTeacherDashboard: async () => {
    const { data } = await api.get("/dashboard/teacher");
    return data;
  }
};
export {
  dashboardApi
};
