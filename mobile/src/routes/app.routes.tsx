import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from 'native-base';
import { Sidebar } from '../components/Sidebar';
import { TabRoutes } from './tab.routes';

const { Navigator, Screen } = createDrawerNavigator();

export function AppRoutes() {
  const { colors } = useTheme();
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: colors.gray[800] },
      }}
      drawerContent={Sidebar}
    >
      <Screen name="tab" component={TabRoutes} />
    </Navigator>
  );
}
