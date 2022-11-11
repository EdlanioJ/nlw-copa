import { useRoute } from '@react-navigation/native';
import { HStack, useToast, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { Share } from 'react-native';

import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Guesses } from '../components/Guesses';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Option } from '../components/Option';
import { PoolHeader } from '../components/PoolHeader';

import { useFetchPool } from '../api/hooks';
import { useRefreshOnFocus } from '../hooks/refresh';

interface RouteParams {
  id: string;
}

export function Details() {
  const route = useRoute();
  const toast = useToast();
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>(
    'guesses'
  );

  const { id } = route.params as RouteParams;
  const { data: pool, isLoading, error, isError, refetch } = useFetchPool(id);

  useRefreshOnFocus(refetch);

  useEffect(() => {
    if (isError) {
      console.log(error);
      toast.show({
        title: 'Não foi possível carregar os detalhes do bolão',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }, [isError]);

  async function handleCodeShare(message: string) {
    await Share.share({
      message,
    });
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!pool) {
    return null;
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={pool.title}
        showBackButton
        showShareButton
        onShare={() => handleCodeShare(pool.id)}
      />
      {pool._count.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={pool} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === 'guesses'}
              onPress={() => setOptionSelected('guesses')}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === 'ranking'}
              onPress={() => setOptionSelected('ranking')}
            />
          </HStack>
          <Guesses poolId={pool.id} code={pool.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={pool.code} />
      )}
    </VStack>
  );
}
