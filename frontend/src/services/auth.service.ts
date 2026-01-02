import api from './api';
import type { LoginResponse, User } from '../types/auth';
import type { ApiResponse } from '../types/api';

export const authService = {
  register: async (userData: any) => {
    const response = await api.post<LoginResponse>('/auth/register', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  login: async (userData: any) => {
    const response = await api.post<LoginResponse>('/auth/login', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  uploadProfilePicture: async (formData: FormData) => {
    const response = await api.post<ApiResponse<User>>('/users/profile/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.success) {
      // Update local user data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return response.data;
  },
};
