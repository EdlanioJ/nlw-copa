import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserData } from '../../contexts/AuthContext';
import { TokenData } from '../../services/token';
import { api } from '../api';

export function useAuthWithGoogle() {
  const queryClient = useQueryClient();

  return useMutation(
    async (token: string) => {
      const response = await api.post('/users', { access_token: token });
      return response.data as TokenData;
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['games', 'pools', 'pool', 'user', 'me']);
      },
    }
  );
}

export function useFetchMe() {
  return useQuery<UserData>(['user', 'me'], async () => {
    const response = await api.get('/me');
    return response.data.user;
  });
}
