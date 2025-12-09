import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesApi } from '../api/client';
import type { ArticleQueryParams, CreateArticleDto, UpdateArticleDto } from '../types';

export const ARTICLES_QUERY_KEY = 'articles';

export function useArticles(params: ArticleQueryParams) {
  return useQuery({
    queryKey: [ARTICLES_QUERY_KEY, params],
    queryFn: () => articlesApi.getAll(params),
  });
}

export function useArticle(id: number) {
  return useQuery({
    queryKey: [ARTICLES_QUERY_KEY, id],
    queryFn: () => articlesApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateArticleDto) => articlesApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ARTICLES_QUERY_KEY] });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateArticleDto }) =>
      articlesApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ARTICLES_QUERY_KEY] });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => articlesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ARTICLES_QUERY_KEY] });
    },
  });
}
