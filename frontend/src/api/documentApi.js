import { api } from "@/api/axios";
const documentApi = {
  getAllDocuments: async (params) => {
    const { data } = await api.get("/documents", { params });
    return data;
  },
  getMyDocuments: async (params) => {
    const { data } = await api.get("/me/documents", { params });
    return data;
  },
  getTeacherDocuments: async (professeurId, params) => {
    const { data } = await api.get(`/professeurs/${professeurId}/documents`, { params });
    return data;
  },
  uploadMyDocument: async (formData) => {
    const { data } = await api.post("/me/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  },
  uploadTeacherDocument: async (professeurId, formData) => {
    const { data } = await api.post(`/professeurs/${professeurId}/documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  },
  renameDocument: async (id, display_name) => {
    const { data } = await api.patch(`/documents/${id}/rename`, { display_name });
    return data;
  },
  deleteDocument: async (id) => {
    const { data } = await api.delete(`/documents/${id}`);
    return data;
  },
  deleteTeacherDocuments: async (professeurId) => {
    const { data } = await api.delete(`/professeurs/${professeurId}/documents`);
    return data;
  }
};
export {
  documentApi
};
