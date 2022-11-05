import { useRoute } from '@react-navigation/native';
import { HStack, useToast, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { Share } from 'react-native';
import { EmptyMyPollList } from '../components/EmptyMyPollList';
import { Guesses } from '../components/Guesses';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Option } from '../components/Option';
import { PollData } from '../components/PollCard';
import { PollHeader } from '../components/PollHeader';
import { api } from '../service/api';

interface RouteParams {
  id: string;
}

export function Details() {
  const route = useRoute();
  const toast = useToast();
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>(
    'guesses'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [poll, setPoll] = useState<PollData>({} as PollData);
  const { id } = route.params as RouteParams;

  async function fetchPoll() {
    try {
      const response = await api.get(`polls/${id}`);
      setPoll(response.data.poll);
    } catch (error) {
      console.log(error);
      toast.show({
        title: 'Não foi possível carregar os detalhes do bolão',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPoll();
  }, [id]);

  async function handleCodeShare() {
    await Share.share({
      message: poll.code,
    });
  }

  if (isLoading) {
    return <Loading />;
  }
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poll.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />
      {poll._count.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PollHeader data={poll} />

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
          <Guesses pollId={poll.id} code={poll.code} />
        </VStack>
      ) : (
        <EmptyMyPollList code={poll.code} />
      )}
    </VStack>
  );
}
