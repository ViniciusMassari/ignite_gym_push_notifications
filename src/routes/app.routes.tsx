import { Platform } from 'react-native';

import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { Home } from '@screens/Home';
import { Exercise } from '@screens/Exercise';
import { History } from '@screens/History';
import { Profile } from '@screens/Profile';

import { config } from '../../config/gluestack-ui.config';

import HomeSvg from '@assets/home.svg';
import HistorySvg from '@assets/history.svg';
import ProfileSvg from '@assets/profile.svg';

export type AppRoutes = {
  Home: undefined;
  History: undefined;
  Profile: undefined;
  Exercise: {
    exerciseId: string;
  };
};

export type AppNavigatorRoutesProps<K extends keyof AppRoutes> =
  BottomTabScreenProps<AppRoutes, K>;
const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const { tokens } = config;
  const iconSize = tokens.space['6'];

  return (
    <>
      <Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: tokens.colors.green500,
          tabBarInactiveTintColor: tokens.colors.gray200,
          tabBarStyle: {
            backgroundColor: tokens.colors.gray600,
            borderTopWidth: 0,
            height: Platform.OS === 'android' ? 'auto' : 96,
            paddingBottom: tokens.space['10'],
            paddingTop: tokens.space['6'],
          },
        }}
      >
        <Screen
          name='Home'
          component={Home}
          options={{
            tabBarIcon: ({ color }) => (
              <HomeSvg width={iconSize} height={iconSize} fill={color} />
            ),
          }}
        />

        <Screen
          name='History'
          component={History}
          options={{
            tabBarIcon: ({ color }) => (
              <HistorySvg width={iconSize} height={iconSize} fill={color} />
            ),
          }}
        />

        <Screen
          name='Profile'
          component={Profile}
          options={{
            tabBarIcon: ({ color }) => (
              <ProfileSvg width={iconSize} height={iconSize} fill={color} />
            ),
          }}
        />

        <Screen
          name='Exercise'
          component={Exercise}
          options={{ tabBarButton: () => null }}
        />
      </Navigator>
    </>
  );
}
