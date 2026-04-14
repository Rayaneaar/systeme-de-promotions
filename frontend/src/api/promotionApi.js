import { api } from "@/api/axios";
const promotionApi = {
  getPromotions: async (params) => {
    const { data } = await api.get("/promotions", { params });
    return data;
  },
  getMyPromotions: async () => {
    const { data } = await api.get("/me/promotions");
    return data;
  },
  createPromotion: async (payload) => {
    const { data } = await api.post("/promotions", payload);
    return data;
  },
  requestMyPromotion: async (payload) => {
    const { data } = await api.post("/me/promotions/request", payload);
    return data;
  },
  reportIssue: async (payload) => {
    const { data } = await api.post("/me/promotions/report", payload);
    return data;
  },
  approvePromotion: async (id, payload) => {
    const { data } = await api.post(`/promotions/${id}/approve`, payload);
    return data;
  },
  rejectPromotion: async (id, payload) => {
    const { data } = await api.post(`/promotions/${id}/reject`, payload);
    return data;
  },
  deletePromotion: async (id) => {
    const { data } = await api.delete(`/promotions/${id}`);
    return data;
  }
};
export {
  promotionApi
};
