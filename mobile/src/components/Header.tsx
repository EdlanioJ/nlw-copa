import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Text, HStack, Box } from 'native-base';
import { CaretLeft, Export, List } from 'phosphor-react-native';

import { ButtonIcon } from './ButtonIcon';

interface Props {
  title: string;
  showBackButton?: boolean;
  showShareButton?: boolean;
  showMenuButton?: boolean;
  onShare?: () => void;
}

export function Header({
  title,
  showBackButton = false,
  showShareButton = false,
  showMenuButton = false,
  onShare,
}: Props) {
  const { navigate, dispatch } = useNavigation();
  const EmptyBoxSpace = () => <Box w={6} h={6} />;

  return (
    <HStack
      w="full"
      h={24}
      bgColor="gray.800"
      alignItems="flex-end"
      pb={5}
      px={5}
    >
      <HStack w="full" alignItems="center" justifyContent="space-between">
        {showMenuButton && !showBackButton ? (
          <ButtonIcon
            onPress={() => dispatch(DrawerActions.openDrawer())}
            icon={List}
          />
        ) : showBackButton ? (
          <ButtonIcon onPress={() => navigate('polls')} icon={CaretLeft} />
        ) : (
          <EmptyBoxSpace />
        )}
        <Text
          color="white"
          fontFamily="medium"
          fontSize="md"
          textAlign="center"
        >
          {title}
        </Text>

        {showShareButton ? (
          <ButtonIcon onPress={onShare} icon={Export} />
        ) : (
          <EmptyBoxSpace />
        )}
      </HStack>
    </HStack>
  );
}
