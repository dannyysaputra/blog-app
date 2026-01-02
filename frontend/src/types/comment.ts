import type { User } from './auth';

export interface Comment {
  _id: string;
  content: string;
  post: string;
  author: User;
  createdAt: string;
}

export interface CreateCommentData {
  content: string;
}
