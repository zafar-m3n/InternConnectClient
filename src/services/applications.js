import api from '../lib/axios';

export const applicationsService = {
  apply: async (internshipId, data) => {
    const response = await api.post(`/applications/${internshipId}/apply`, data);
    return response.data;
  },

  myApplications: async () => {
    const response = await api.get('/applications/me');
    return response.data;
  },

  byInternship: async (internshipId) => {
    const response = await api.get(`/applications/by-internship/${internshipId}`);
    return response.data;
  },

  changeStatus: async (applicationId, payload) => {
    const response = await api.patch(`/applications/${applicationId}/status`, payload);
    return response.data;
  }
};