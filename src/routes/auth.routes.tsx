import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignIn } from '@screens/SignIn';
import { SignUp } from '@screens/SignUp';
import { type NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';

export type AuthRoutes = {
  SignIn: undefined;
  SignUp: undefined;
};

export type AuthNavigatorRoutesProps<K extends keyof AuthRoutes> =
  NativeStackScreenProps<AuthRoutes, K>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();
export const AuthRoutes = () => {
  return (
    <Navigator initialRouteName='SignIn' screenOptions={{ headerShown: false }}>
      <Screen name='SignIn' component={SignIn} />
      <Screen name='SignUp' component={SignUp} />
    </Navigator>
  );
};
