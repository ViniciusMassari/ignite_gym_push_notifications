import { ExerciseDTO } from '@dtos/ExerciseDTO';
import {
  Text,
  Heading,
  HStack,
  Image,
  VStack,
  Icon,
} from '@gluestack-ui/themed';
import { api } from '@services/api';
import { ChevronRight } from 'lucide-react-native';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

type Props = TouchableOpacityProps & {
  exercise: ExerciseDTO;
};

export function ExerciseCard({ exercise, ...props }: Props) {
  return (
    <TouchableOpacity {...props}>
      <HStack
        bg='$gray500'
        alignItems='center'
        p='$2'
        pr='$4'
        rounded='$md'
        mb='$3'
      >
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${exercise.thumb}`,
          }}
          alt='Imagem do exercício'
          w='$16'
          h='$16'
          rounded='$md'
          mr='$4'
          resizeMode='cover'
        />

        <VStack flex={1}>
          <Heading fontSize='$lg' color='$white' fontFamily='$heading'>
            {exercise.name}
          </Heading>
          <Text fontSize='$sm' color='$gray200' mt='$1' numberOfLines={2}>
            {exercise.series} séries X {exercise.repetitions} repetições
          </Text>
        </VStack>

        <Icon as={ChevronRight} color='$gray300' />
      </HStack>
    </TouchableOpacity>
  );
}
