import { useState } from 'react';
import { Heading, Text, useToast, VStack } from 'native-base';

import { Header } from '../components/Header';
import Logo from '../assets/logo.svg';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

import { useCreatePool } from '../api/hooks';

export function NewPoll() {
  const [title, setTitle] = useState('');
  const toast = useToast();
  const { mutate, isLoading } = useCreatePool();
  function handlePollCreate() {
    if (!title.trim()) {
      return toast.show({
        title: 'Informe o titulo do seu bolão',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
    mutate(title, {
      onSuccess: () => {
        toast.show({
          title: 'Bolão criado com sucesso',
          placement: 'top',
          bgColor: 'green.500',
        });

        setTitle('');
      },
      onError: (error) => {
        console.log(error);
        toast.show({
          title: 'Não foi possível criar o bolão',
          placement: 'top',
          bgColor: 'red.500',
        });
      },
    });
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header showMenuButton title="Criar novo bolão" />
      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie seu próprio bolão da copa{'\n'}e compartilhe entre amigos!
        </Heading>
        <Input
          mb={2}
          value={title}
          onChangeText={setTitle}
          placeholder="Qual o nome do seu bolão?"
        />
        <Button
          title="Criar seu bolão"
          isLoading={isLoading}
          onPress={handlePollCreate}
        />

        <Text color="gray.200" textAlign="center" px={10} mt={4}>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
}
