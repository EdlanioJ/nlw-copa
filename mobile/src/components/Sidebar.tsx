import { Feather } from '@expo/vector-icons';
import { Avatar, Heading, Icon, VStack } from 'native-base';

import { useFetchMe } from '../api/hooks';
import { useAuth } from '../hooks/auth';
import { Button } from './Button';
import { Loading } from './Loading';

function formatName(name: string) {
  return name
    .split(' ')
    .map((str) => str.at(0)?.toUpperCase())
    .join('');
}

export function Sidebar() {
  const { data, isLoading } = useFetchMe();
  const { signOut } = useAuth();
  return (
    <VStack flex={1} pb={5} px={5} bgColor="gray.800">
      {isLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} pt={16} alignItems="center">
          <Avatar
            source={{ uri: data?.avatarUrl }}
            size="2xl"
            borderWidth={6}
            borderColor="gray.600"
            bg="gray.400"
            color="gray.900"
          >
            {data?.name}
          </Avatar>

          <Heading size="xs" color="gray.400" textTransform="uppercase" mt={5}>
            {data?.name}
          </Heading>
        </VStack>
      )}
      <Button
        title="Sair"
        onPress={signOut}
        leftIcon={<Icon as={Feather} name="log-out" size="md" color="black" />}
      />
    </VStack>
  );
}
