import type { User } from './auth';

export interface Post {
  _id: string;
  title: string;
  content: string;
  category?: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  category?: string;
}
