import { Center, Icon, Text, VStack } from 'native-base';
import { Fontisto } from '@expo/vector-icons';

import Logo from '../assets/logo.svg';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/auth';

export function SignIn() {
  const { signIn, isUserLoading } = useAuth();

  return (
    <Center flex={1} bgColor="gray.900" p={7}>
      <Logo width={212} height={40} />
      <Button
        title="ENTRAR COM O GOOGLE"
        type="SECONDARY"
        leftIcon={<Icon as={Fontisto} name="google" size="md" color="white" />}
        mt={12}
        onPress={signIn}
        isLoading={isUserLoading}
      />

      <Text textAlign="center" mt={4} color="white">
        Não utilizamos nenhuma informação além{'\n'}do seu e-mail para criação
        de sua conta.
      </Text>
    </Center>
  );
}
