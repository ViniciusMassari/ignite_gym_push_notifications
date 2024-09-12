import { VStack } from '@gluestack-ui/themed';
import {
  Toast,
  ToastDescription,
  ToastTitle,
  Pressable,
  Icon,
} from '@gluestack-ui/themed';
import { X } from 'lucide-react-native';

type Props = {
  id: string;
  title: string;
  description?: string;
  action?: 'error' | 'success';
  onClose: () => void;
};

export function ToastMessage({
  description,
  id,
  onClose,
  title,
  action = 'success',
}: Props) {
  return (
    <Toast
      nativeID={`toast-${id}`}
      action={action}
      bgColor={action == 'success' ? '$green500' : '$red500'}
      mt='$10'
    >
      <VStack space='xs' w='$full'>
        <Pressable alignSelf='flex-end' onPress={onClose}>
          <Icon as={X} color='$coolGray50' size='md' />
        </Pressable>
        <ToastTitle color='$white' fontFamily='$heading'>
          {title}
        </ToastTitle>
      </VStack>
      {description && (
        <ToastDescription fontFamily='$body' color='$white'>
          {description}
        </ToastDescription>
      )}
    </Toast>
  );
}
