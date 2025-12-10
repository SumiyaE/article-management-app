import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/client';
import type { UpdateUserDto } from '../types';

export const USERS_QUERY_KEY = 'users';

export function useUsers(organizationId: number) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, organizationId],
    queryFn: () => usersApi.getAll(organizationId),
    enabled: !!organizationId,
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, id],
    queryFn: () => usersApi.getOne(id),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateUserDto }) =>
      usersApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
}
