import {
  useFonts,
  Roboto_700Bold,
  Roboto_400Regular,
  Roboto_500Medium,
} from '@expo-google-fonts/roboto';
import { NativeBaseProvider, StatusBar } from 'native-base';

import { Loading } from './src/components/Loading';
import { AuthProvider } from './src/contexts/AuthContext';
import { Routes } from './src/routes';

import { THEME } from './src/styles/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  return (
    <NativeBaseProvider theme={THEME}>
      <AuthProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent
        />
      </AuthProvider>
    </NativeBaseProvider>
  );
}
