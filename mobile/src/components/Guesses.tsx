import { FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { useFetchGames, useGuessConfirm } from '../api/hooks';

import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Game } from './Game';
import { Loading } from './Loading';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');
  const toast = useToast();
  const { data: games, isLoading, isError, error } = useFetchGames(poolId);
  const { mutate } = useGuessConfirm();
  useEffect(() => {
    if (isError) {
      console.log(error);
      toast.show({
        title: 'Não foi possível carregar os jogos',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }, [isError]);

  function handleGuessConfirm(gameId: string) {
    if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
      return toast.show({
        title: 'Informa o placar do palpite',
        placement: 'top',
        bgColor: 'red.500',
      });
    }

    mutate(
      {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
        gameId,
        poolId,
      },
      {
        onSuccess() {
          toast.show({
            title: 'Palpite realizado com sucesso',
            placement: 'top',
            bgColor: 'green.500',
          });
        },
        onError(error) {
          console.log(error);
          toast.show({
            title: 'Não foi possível enviar o palpite',
            placement: 'top',
            bgColor: 'red.500',
          });
        },
      }
    );
  }

  if (isLoading) {
    return <Loading />;
  }
  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
