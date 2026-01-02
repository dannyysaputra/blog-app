import api from './api';
import type { ApiResponse } from '../types/api';
import type { Post, CreatePostData } from '../types/post';
import type { PaginatedPosts } from '../types/pagination';

export const postService = {
  getAll: async (page = 1, limit = 6, search = '') => {
    const response = await api.get<ApiResponse<PaginatedPosts>>('/posts', {
      params: { page, limit, search },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Post>>(`/posts/${id}`);
    return response.data;
  },

  create: async (data: CreatePostData) => {
    const response = await api.post<ApiResponse<Post>>('/posts', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreatePostData>) => {
    const response = await api.put<ApiResponse<Post>>(`/posts/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/posts/${id}`);
    return response.data;
  },
};
