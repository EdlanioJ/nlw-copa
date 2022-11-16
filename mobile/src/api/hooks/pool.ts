import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { GameData } from '../../components/Game';
import { PoolData } from '../../components/PoolCard';
import { api } from '../api';

export function useCreatePool() {
  const queryClient = useQueryClient();
  return useMutation(
    async (title: string) => {
      await api.post('/pools', { title });
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
      await api.post('/pools/join', { code });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pools']);
      },
    }
  );
}

export function useFetchPools(options?: UseQueryOptions<PoolData[]>) {
  return useQuery<PoolData[]>(
    ['pools'],
    async () => {
      const response = await api.get('/pools');
      return response.data.pools;
    },
    options
  );
}

export function useFetchPool(id: string, options?: UseQueryOptions<PoolData>) {
  return useQuery<PoolData>(['pools', id], async () => {
    const response = await api.get(`pools/${id}`);
    return response.data.pool;
  }, options);
}

export function useFetchGames(
  poolId: string,
  options?: UseQueryOptions<GameData[]>
) {
  return useQuery<GameData[]>(
    ['games'],
    async () => {
      const response = await api.get(`/pools/${poolId}/games`);
      return response.data.games;
    },
    options
  );
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
      await api.post(`/pools/${poolId}/game/${gameId}/guess`, {
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
