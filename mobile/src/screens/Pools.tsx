import { FlatList, Icon, useToast, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';

import { Octicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { PoolCard } from '../components/PoolCard';
import { Loading } from '../components/Loading';
import { EmptyPoolList } from '../components/EmptyPoolList';

import { useRefreshOnFocus } from '../hooks/refresh';
import { useFetchPools } from '../api/hooks';

export function Pools() {
  const toast = useToast();
  const { navigate } = useNavigation();

  const {
    data: pools,
    isLoading,
    refetch,
  } = useFetchPools({
    onError: (error) => {
      console.log(error);
      toast.show({
        title: 'Não foi possível carregar os bolões',
        placement: 'top',
        bgColor: 'red.500',
      });
    },
  });

  useRefreshOnFocus(refetch);

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header showMenuButton title="Meus bolões" />
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
          onPress={() => navigate('find')}
          title="Buscar Bolão por Código"
        />
      </VStack>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={pools}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigate('details', { id: item.id })}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => <EmptyPoolList />}
          _contentContainerStyle={{ pb: 10 }}
          px={5}
        />
      )}
    </VStack>
  );
}
