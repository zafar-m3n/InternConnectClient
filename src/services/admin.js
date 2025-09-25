import api from '../lib/axios';

export const adminService = {
  // Tenants
  listTenants: async () => {
    const response = await api.get('/admin/tenants');
    return response.data;
  },

  createTenant: async (data) => {
    const response = await api.post('/admin/tenants', data);
    return response.data;
  },

  updateTenant: async (id, data) => {
    const response = await api.put(`/admin/tenants/${id}`, data);
    return response.data;
  },

  // Settings
  getSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  }
};