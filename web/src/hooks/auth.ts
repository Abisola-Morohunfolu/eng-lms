import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '../api/client';
import { keys } from './keys';

export function useMe() {
  return useQuery({
    queryKey: keys.me,
    queryFn: authApi.me,
    retry: false,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(keys.me, null);
      toast.success('Signed out');
    },
    onError: () => toast.error('Couldn’t sign out'),
  });
}
