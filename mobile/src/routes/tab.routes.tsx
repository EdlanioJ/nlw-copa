import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'native-base';
import { PlusCircle, SoccerBall } from 'phosphor-react-native';
import { Platform } from 'react-native';
import { Details } from '../screens/Details';
import { Find } from '../screens/Find';
import { New } from '../screens/New';
import { Polls } from '../screens/Polls';

const { Navigator, Screen } = createBottomTabNavigator();

export function TabRoutes() {
  const { colors, sizes } = useTheme();
  const size = sizes[6];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'beside-icon',
        tabBarActiveTintColor: colors.yellow[500],
        tabBarInactiveTintColor: colors.gray[300],
        tabBarStyle: {
          position: 'absolute',
          height: 87,
          borderWidth: 0,
          backgroundColor: colors.gray[800],
        },
        tabBarItemStyle: {
          position: 'relative',
          top: Platform.OS === 'android' ? -10 : 0,
        },
      }}
    >
      <Screen
        name="new-poll"
        component={New}
        options={{
          tabBarLabel: 'Novo Bolão',
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={size} />,
        }}
      />
      <Screen
        name="polls"
        component={Polls}
        options={{
          tabBarLabel: 'Meus bolões',
          tabBarIcon: ({ color }) => <SoccerBall color={color} size={size} />,
        }}
      />
      <Screen
        name="find-poll"
        component={Find}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="details"
        component={Details}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  );
}
