// Organization
export interface Organization {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

// User
export interface User {
  id: number;
  name: string;
  thumbnailImage: string | null;
  createdAt: string;
  updatedAt: string;
  organization: Organization;
}

// Article
export type ArticleStatus = 'draft' | 'published';

export interface Article {
  id: number;
  title: string;
  content: string;
  status: ArticleStatus;
  createdAt: string;
  updatedAt: string;
  user: User;
}

// Pagination
export interface PaginatedMeta {
  itemsPerPage: number;
  totalItems?: number;
  currentPage?: number;
  totalPages?: number;
  sortBy: [string, string][];
  searchBy: string[];
  search: string;
  select: string[];
  filter?: Record<string, string | string[]>;
}

export interface PaginatedLinks {
  first?: string;
  previous?: string;
  current: string;
  next?: string;
  last?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
  links: PaginatedLinks;
}

// Request DTOs
export interface CreateArticleDto {
  title: string;
  content?: string;
  status: ArticleStatus;
  userId: number;
}

export interface UpdateArticleDto {
  title?: string;
  content?: string;
  status?: ArticleStatus;
}

// Response DTOs
export interface UpdateResultDto {
  affected: number;
}

export interface DeleteResultDto {
  affected: number;
}

// Query params
export type SortOrder = 'ASC' | 'DESC';
export type ArticleSortField = 'title' | 'status' | 'updatedAt';

export interface ArticleQueryParams {
  page?: number;
  limit?: number;
  sortBy?: `${ArticleSortField}:${SortOrder}`;
  search?: string;
  'filter.user.organization.id': number;
  'filter.status'?: ArticleStatus;
  'filter.user.id'?: number;
}
