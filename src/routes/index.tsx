import {
  DefaultTheme,
  LinkingOptions,
  NavigationContainer,
} from '@react-navigation/native';
import { AuthRoutes } from './auth.routes';

import { gluestackUIConfig } from '../../config/gluestack-ui.config';
import { Box } from '@gluestack-ui/themed';
import { Notification } from '@components/Notification';

import { useAuth } from '@hooks/useAuth';
import { AppRoutes } from './app.routes';
import { Loading } from '@components/Loading';

import { useEffect, useState } from 'react';
import {
  NotificationWillDisplayEvent,
  OneSignal,
  OSNotification,
} from 'react-native-onesignal';

export const Routes = () => {
  const { user, isLoadingUserStorageData } = useAuth();

  const [notification, setNotification] = useState<null | OSNotification>(null);

  useEffect(() => {
    const handleNotification = (event: NotificationWillDisplayEvent): void => {
      event.preventDefault();
      const response = event.getNotification();
      setNotification(response);
    };

    OneSignal.Notifications.addEventListener(
      'foregroundWillDisplay',
      handleNotification
    );

    return () =>
      OneSignal.Notifications.removeEventListener(
        'foregroundWillDisplay',
        handleNotification
      );
  }, []);

  const linking: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: ['ignitegym://', 'com.rocketseat.ignitegym://'],
    config: {
      screens: {
        Exercise: {
          path: '/Exercise/:exerciseId',
          parse: {
            exerciseId: (exerciseId: string) => exerciseId,
          },
        },
      },
    },
  };

  const theme = DefaultTheme;
  theme.colors.background = gluestackUIConfig.tokens.colors.gray700;
  if (isLoadingUserStorageData) {
    return <Loading />;
  }

  return (
    <Box flex={1} bg='$gray700'>
      {notification && (
        <Notification
          data={notification}
          onClose={() => setNotification(null)}
        />
      )}
      <NavigationContainer theme={theme} linking={linking}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
};
