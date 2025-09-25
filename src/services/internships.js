import api from "../lib/axios";

export const internshipsService = {
  list: async (params = {}) => {
    const response = await api.get("/internships", { params });
    return response.data;
  },

  get: async (id) => {
    const response = await api.get(`/internships/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/internships", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/internships/${id}`, data);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/internships/${id}`);
    return response.data;
  },

  generateMagicLink: async (id) => {
    const response = await api.post(`/internships/${id}/company-portal-link`);
    return response.data;
  },
};
