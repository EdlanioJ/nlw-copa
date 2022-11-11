import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GameData } from '../../components/Game';
import { PoolData } from '../../components/PoolCard';
import { api } from '../api';

export function useCreatePool() {
  const queryClient = useQueryClient();
  return useMutation(
    async (title: string) => {
      await api.post('/polls', { title });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pools']);
      },
    }
  );
}

export function useJoinPool() {
  const queryClient = useQueryClient();

  return useMutation(
    async (code: string) => {
      await api.post('/polls/join', { code });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pools']);
      },
    }
  );
}

export function useFetchPools() {
  return useQuery<PoolData[]>(['pools'], async () => {
    const response = await api.get('/polls');
    return response.data.polls;
  });
}

export function useFetchPool(id: string) {
  return useQuery<PoolData>(['pools', id], async () => {
    const response = await api.get(`polls/${id}`);
    return response.data.poll;
  });
}

export function useFetchGames(poolId: string) {
  return useQuery<GameData[]>(['games'], async () => {
    const response = await api.get(`/polls/${poolId}/games`);
    return response.data.games;
  });
}

export function useGuessConfirm() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      poolId,
      gameId,
      firstTeamPoints,
      secondTeamPoints,
    }: {
      poolId: string;
      gameId: string;
      firstTeamPoints: number;
      secondTeamPoints: number;
    }) => {
      await api.post(`/polls/${poolId}/game/${gameId}/guess`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['games']);
      },
    }
  );
}
