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

// Article Content Draft
export interface ArticleContentDraft {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Article Content Published
export interface ArticleContentPublished {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
}

// Article
export interface Article {
  id: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  contentDraft?: ArticleContentDraft;
  contentPublishedVersions?: ArticleContentPublished[];
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
  userId: number;
}

export interface UpdateArticleDraftDto {
  title?: string;
  content?: string;
}

export interface UpdateUserDto {
  name?: string;
  thumbnailImage?: string | null;
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
export type ArticleSortField = 'contentDraft.title' | 'updatedAt';
export type PublishStatus = 'all' | 'draft' | 'published';

export interface ArticleQueryParams {
  page?: number;
  limit?: number;
  sortBy?: `${ArticleSortField}:${SortOrder}`;
  search?: string;
  'filter.user.organization.id': number;
  'filter.user.id'?: number;
  publishStatus?: PublishStatus;
}
