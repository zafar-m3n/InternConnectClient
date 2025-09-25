import api from '../lib/axios';

export const dashboardsService = {
  getStudentDashboard: async () => {
    const response = await api.get('/dashboards/student');
    return response.data;
  },

  getLiaisonDashboard: async () => {
    const response = await api.get('/dashboards/liaison');
    return response.data;
  }
};