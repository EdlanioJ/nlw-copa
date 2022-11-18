import { Center, Text, VStack } from 'native-base';

interface Props {
  value: number;
}
export function Guess({ value }: Props) {
  return (
    <Center
      h={9}
      minW={10}
      px={2}
      bgColor="gray.800"
      borderColor="gray.600"
      borderWidth={1}
      borderRadius={5}
    >
      <Text fontFamily="body" color="white" textAlign="center" fontSize="xs">
        {value}
      </Text>
    </Center>
  );
}
