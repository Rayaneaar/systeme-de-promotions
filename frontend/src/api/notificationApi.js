import { api } from "@/api/axios";
const notificationApi = {
  getNotifications: async (limit = 8) => {
    const { data } = await api.get("/notifications", {
      params: { limit }
    });
    return data;
  },
  markAsRead: async (id) => {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  },
  markAllAsRead: async () => {
    const { data } = await api.patch("/notifications/read-all");
    return data;
  }
};
export {
  notificationApi
};
