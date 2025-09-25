import axiosInstance from '../lib/axios';

export const profileService = {
  getMe: async () => {
    const response = await axiosInstance.get('/students/me');
    return response.data;
  },

  updateMe: async (data) => {
    const response = await axiosInstance.put('/students/me', data);
    return response.data;
  },

  uploadCV: async (file) => {
    const formData = new FormData();
    formData.append('cv', file);
    const response = await axiosInstance.post('/students/me/cv', formData);
    return response.data;
  }
}