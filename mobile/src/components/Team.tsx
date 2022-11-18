import { HStack } from 'native-base';
import CountryFlag from 'react-native-country-flag';
import { Guess } from './Guess';

import { Input } from './Input';

interface Props {
  code: string;
  guess?: number;
  position: 'left' | 'right';
  onChangeText: (value: string) => void;
}

export function Team({ code, guess, position, onChangeText }: Props) {
  return (
    <HStack alignItems="center">
      {position === 'left' && (
        <CountryFlag isoCode={code} size={25} style={{ marginRight: 12 }} />
      )}

      {guess ? (
        <Guess value={guess} />
      ) : (
        <Input
          w={10}
          h={9}
          textAlign="center"
          fontSize="xs"
          keyboardType="numeric"
          onChangeText={onChangeText}
        />
      )}

      {position === 'right' && (
        <CountryFlag isoCode={code} size={25} style={{ marginLeft: 12 }} />
      )}
    </HStack>
  );
}
