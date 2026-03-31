import { api } from "@/api/axios";
const professeurApi = {
  getTeachers: async (params) => {
    const { data } = await api.get("/professeurs", { params });
    return data;
  },
  getTeacher: async (id) => {
    const { data } = await api.get(`/professeurs/${id}`);
    return data;
  },
  createTeacher: async (payload) => {
    const { data } = await api.post("/professeurs", payload);
    return data;
  },
  updateTeacher: async (id, payload) => {
    const { data } = await api.patch(`/professeurs/${id}`, payload);
    return data;
  },
  deleteTeacher: async (id) => {
    const { data } = await api.delete(`/professeurs/${id}`);
    return data;
  },
  getMyProfile: async () => {
    const { data } = await api.get("/me/profile");
    return data;
  },
  updateMyProfile: async (payload) => {
    const { data } = await api.patch("/me/profile", payload);
    return data;
  },
  getMyEligibility: async () => {
    const { data } = await api.get("/me/eligibility");
    return data;
  },
  getEligibility: async (id) => {
    const { data } = await api.get(`/professeurs/${id}/eligibility`);
    return data;
  }
};
export {
  professeurApi
};
