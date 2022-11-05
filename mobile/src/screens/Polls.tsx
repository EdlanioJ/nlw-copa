import { FlatList, Icon, useToast, VStack } from 'native-base';

import { Octicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { api } from '../service/api';
import { useCallback, useEffect, useState } from 'react';
import { PollCard, PollData } from '../components/PollCard';
import { Loading } from '../components/Loading';
import { EmptyPollList } from '../components/EmptyPollList';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export function Polls() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [polls, setPolls] = useState<PollData[]>([]);
  const { navigate } = useNavigation();
  async function fetchPolls() {
    try {
      setIsLoading(true);
      const response = await api.get('/polls');
      setPolls(response.data.polls);
    } catch (error) {
      console.log(error);
      toast.show({
        title: 'Não foi possível carregar os bolões',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPolls();
    }, [])
  );
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          leftIcon={
            <Icon color="black" as={Octicons} size="md" name="search" />
          }
          onPress={() => navigate('find-poll')}
          title="Buscar Bolão por Código"
        />
      </VStack>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={polls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PollCard
              data={item}
              onPress={() => navigate('details', { id: item.id })}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => <EmptyPollList />}
          _contentContainerStyle={{ pb: 10 }}
          px={5}
        />
      )}
    </VStack>
  );
}
