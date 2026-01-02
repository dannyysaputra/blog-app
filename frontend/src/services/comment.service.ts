import api from './api';
import type { ApiResponse } from '../types/api';
import type { Comment, CreateCommentData } from '../types/comment';

export const commentService = {
  getByPostId: async (postId: string) => {
    const response = await api.get<ApiResponse<Comment[]>>(`/posts/${postId}/comments`);
    return response.data;
  },

  create: async (postId: string, data: CreateCommentData) => {
    const response = await api.post<ApiResponse<Comment>>(`/posts/${postId}/comments`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/comments/${id}`);
    return response.data;
  },
};
