import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../api';

export function useAuthWithGoogle() {
  return useMutation(async (token: string) => {
    const response = await api.post('/users', { access_token: token });
    return response.data.token as string;
  });
}

export function useFetchMe() {
  return useQuery(['user', 'me'], async () => {
    const response = await api.get('/me');
    return response.data.user;
  });
}
