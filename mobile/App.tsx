import {
  useFonts,
  Roboto_700Bold,
  Roboto_400Regular,
  Roboto_500Medium,
} from '@expo-google-fonts/roboto';
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { NativeBaseProvider, StatusBar } from 'native-base';
import { AppStateStatus, Platform } from 'react-native';

import { Loading } from './src/components/Loading';
import { AuthProvider } from './src/contexts/AuthContext';
import { useAppState } from './src/hooks/app-state';
import { useOnlineManager } from './src/hooks/online-manager';
import { Routes } from './src/routes';

import { THEME } from './src/styles/theme';

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  useOnlineManager();
  useAppState(onAppStateChange);

  return (
    <NativeBaseProvider theme={THEME}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {fontsLoaded ? <Routes /> : <Loading />}
          <StatusBar
            backgroundColor="transparent"
            barStyle="light-content"
            translucent
          />
        </AuthProvider>
      </QueryClientProvider>
    </NativeBaseProvider>
  );
}
