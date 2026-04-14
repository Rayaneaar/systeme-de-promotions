import { api } from "@/api/axios";
const authApi = {
  login: async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },
  me: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },
  logout: async () => {
    const { data } = await api.post("/auth/logout");
    return data;
  }
};
export {
  authApi
};
