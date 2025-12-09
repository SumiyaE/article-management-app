import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/client';

export const USERS_QUERY_KEY = 'users';

export function useUsers(organizationId: number) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, organizationId],
    queryFn: () => usersApi.getAll(organizationId),
    enabled: !!organizationId,
  });
}
