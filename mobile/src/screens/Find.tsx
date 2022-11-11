import { useState } from 'react';
import { Heading, useToast, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';

import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

import { useJoinPool } from '../api/hooks';
import { AxiosError } from 'axios';

export function Find() {
  const toast = useToast();
  const { navigate } = useNavigation();
  const { mutate, isLoading } = useJoinPool();
  const [code, setCode] = useState('');

  function handleFindPoll() {
    if (!code.trim()) {
      return toast.show({
        title: 'Informe o código',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
    mutate(code, {
      onSuccess: () => {
        toast.show({
          title: 'Você entrou no bolão com sucesso',
          placement: 'top',
          bgColor: 'green.500',
        });
        navigate('polls');
      },
      onError: (error) => {
        console.log(error);

        if (error instanceof AxiosError) {
          if (error.response?.data?.message === 'Poll not found.') {
            return toast.show({
              title: 'Bolão não encontrado!',
              placement: 'top',
              bgColor: 'red.500',
            });
          }

          if (
            error.response?.data?.message === 'You already joined this poll.'
          ) {
            return toast.show({
              title: 'Você já está nesse bolão',
              placement: 'top',
              bgColor: 'red.500',
            });
          }
        }

        toast.show({
          title: 'Não foi possível encontrar o bolão',
          placement: 'top',
          bgColor: 'red.500',
        });
      },
    });
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />
      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de{'\n'}seu código único
        </Heading>
        <Input
          mb={2}
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          placeholder="Qual o código do bolão?"
        />
        <Button
          title="Buscar bolão"
          onPress={handleFindPoll}
          isLoading={isLoading}
        />
      </VStack>
    </VStack>
  );
}
