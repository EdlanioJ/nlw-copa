import { NavigationContainer } from '@react-navigation/native';
import { Box } from 'native-base';
import { useAuth } from '../hooks/auth';
import { SignIn } from '../screens/SignIn';
import { AppRoutes } from './app.routes';

export function Routes() {
  const { isSigned } = useAuth();

  return (
    <Box flex={1} bgColor="gray.900">
      <NavigationContainer>
        {isSigned ? <AppRoutes /> : <SignIn />}
      </NavigationContainer>
    </Box>
  );
}
