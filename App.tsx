import { AuthContextProvider } from '@contexts/AuthContext';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { config } from './config/gluestack-ui.config';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { Routes } from '@routes/index';
import { Loading } from '@components/Loading';
import { OneSignal } from 'react-native-onesignal';

import { APP_ID } from '@env';
import { Notification } from '@components/Notification';

OneSignal.initialize(APP_ID);

OneSignal.Notifications.requestPermission(true);
export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });
  return (
    <AuthContextProvider>
      <GluestackUIProvider config={config}>
        <StatusBar translucent backgroundColor='transparent' style='light' />

        {fontsLoaded ? <Routes /> : <Loading />}
      </GluestackUIProvider>
    </AuthContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
