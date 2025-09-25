import api from '../lib/axios';

export const cvService = {
  pending: async () => {
    const response = await api.get('/cv/pending');
    return response.data;
  },

  approve: async (studentId, feedback = '') => {
    const response = await api.patch(`/cv/${studentId}/approve`, { cv_feedback: feedback });
    return response.data;
  },

  reject: async (studentId, feedback) => {
    const response = await api.patch(`/cv/${studentId}/reject`, { cv_feedback: feedback });
    return response.data;
  }
};