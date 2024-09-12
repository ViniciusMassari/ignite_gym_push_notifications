import { Heading, HStack, Icon, Text, VStack } from '@gluestack-ui/themed';
import { UserPhoto } from './UserPhoto';
import { LogOut } from 'lucide-react-native';
import { useAuth } from '@hooks/useAuth';

import defaulUserPhotoImg from '@assets/userPhotoDefault.png';
import { Pressable } from 'react-native';
import { api } from '@services/api';

export function HomeHeader() {
  const { user } = useAuth();
  const {
    user: { name, avatar },
    signOut,
  } = useAuth();
  return (
    <HStack bg='$gray600' pt='$16' pb='$5' px='$8' alignItems='center' gap='$4'>
      <UserPhoto
        source={
          user.avatar
            ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
            : defaulUserPhotoImg
        }
        w='$16'
        h='$16'
        alt='Imagem do usuário'
      />

      <VStack flex={1}>
        <Text color='$gray100' fontSize='$sm'>
          Olá
        </Text>
        <Heading color='$gray100' fontSize='$md'>
          {name}
        </Heading>
      </VStack>

      <Pressable onPress={signOut}>
        <Icon as={LogOut} color='$gray200' size='xl' />
      </Pressable>
    </HStack>
  );
}
