import axios from 'axios';
import type {
  Article,
  ArticleContentDraft,
  ArticleContentPublished,
  PaginatedResponse,
  CreateArticleDto,
  UpdateArticleDraftDto,
  UpdateUserDto,
  DeleteResultDto,
  ArticleQueryParams,
  User,
} from '../types';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Articles API
export const articlesApi = {
  getAll: async (params: ArticleQueryParams): Promise<PaginatedResponse<Article>> => {
    const { data } = await apiClient.get<PaginatedResponse<Article>>('/articles', { params });
    return data;
  },

  getOne: async (id: number): Promise<Article> => {
    const { data } = await apiClient.get<Article>(`/articles/${id}`);
    return data;
  },

  create: async (dto: CreateArticleDto): Promise<Article> => {
    const { data } = await apiClient.post<Article>('/articles', dto);
    return data;
  },

  delete: async (id: number): Promise<DeleteResultDto> => {
    const { data } = await apiClient.delete<DeleteResultDto>(`/articles/${id}`);
    return data;
  },

  // Draft operations
  getDraft: async (id: number): Promise<ArticleContentDraft> => {
    const { data } = await apiClient.get<ArticleContentDraft>(`/articles/${id}/draft`);
    return data;
  },

  updateDraft: async (id: number, dto: UpdateArticleDraftDto): Promise<ArticleContentDraft> => {
    const { data } = await apiClient.patch<ArticleContentDraft>(`/articles/${id}/draft`, dto);
    return data;
  },

  // Publish operations
  publish: async (id: number): Promise<ArticleContentPublished> => {
    const { data } = await apiClient.post<ArticleContentPublished>(`/articles/${id}/publish`);
    return data;
  },

  getPublishedVersions: async (id: number): Promise<ArticleContentPublished[]> => {
    const { data } = await apiClient.get<ArticleContentPublished[]>(`/articles/${id}/published`);
    return data;
  },

  getLatestPublished: async (id: number): Promise<ArticleContentPublished> => {
    const { data } = await apiClient.get<ArticleContentPublished>(`/articles/${id}/published/latest`);
    return data;
  },
};

// Users API
export const usersApi = {
  getAll: async (organizationId: number): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get<PaginatedResponse<User>>('/users', {
      params: { 'filter.organization.id': organizationId },
    });
    return data;
  },

  getOne: async (id: number): Promise<User> => {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  update: async (id: number, dto: UpdateUserDto): Promise<UpdateResultDto> => {
    const { data } = await apiClient.patch<UpdateResultDto>(`/users/${id}`, dto);
    return data;
  },
};

export default apiClient;
