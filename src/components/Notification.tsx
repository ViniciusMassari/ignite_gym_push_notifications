import { Ionicons } from '@expo/vector-icons/';
import { OSNotification } from 'react-native-onesignal';
import { openURL } from 'expo-linking';
import { CloseIcon, HStack, Icon, Pressable, Text } from '@gluestack-ui/themed';

type Props = {
  data: OSNotification;
  onClose: () => void;
};

export function Notification({ data, onClose }: Props) {
  function handleOnPress() {
    if (data.launchURL) {
      openURL(data.launchURL);
      onClose();
    }
  }
  return (
    <Pressable
      onPress={handleOnPress}
      w='$full'
      p={'$4'}
      pt={'$12'}
      bgColor='$gray200'
      margin={'auto'}
    >
      <HStack
        justifyContent='space-between'
        alignItems='center'
        top={0}
        gap={'$5'}
      >
        <Ionicons name='notifications' size={15} color='$white' mr={2} />

        <Text fontSize='$md' color='$black' flex={1}>
          {data.title}
        </Text>
        <Pressable onPress={onClose}>
          <CloseIcon size='md' />
        </Pressable>
      </HStack>
    </Pressable>
  );
}
