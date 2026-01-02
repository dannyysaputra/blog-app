import type { Post } from './post';

export interface Pagination {
  total: number;
  page: number;
  pages: number;
}

export interface PaginatedPosts {
  posts: Post[];
  pagination: Pagination;
}
