import api from '../lib/axios';

export const notificationsService = {
  listMe: async (params = {}) => {
    const response = await api.get('/notifications/me', { params });
    return response.data;
  },

  markRead: async (notificationId) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  }
};