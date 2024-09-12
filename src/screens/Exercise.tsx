import {
  Heading,
  HStack,
  Icon,
  VStack,
  Text,
  Image,
  Box,
  useToast,
} from '@gluestack-ui/themed';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { ArrowLeft } from 'lucide-react-native';
import { ScrollView, TouchableOpacity } from 'react-native';

import BodySvg from '@assets/body.svg';
import SeriesSvg from '@assets/series.svg';
import RepetitionsSvg from '@assets/repetitions.svg';
import { Button } from '@components/Button';
import { ToastMessage } from '@components/ToastMessage';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { useEffect, useState } from 'react';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { Loading } from '@components/Loading';

export function Exercise({
  navigation: { navigate, goBack },
  route: {
    params: { exerciseId },
  },
}: AppNavigatorRoutesProps<'Exercise'>) {
  function handleGoBack() {
    goBack();
  }
  const [sendingRegister, setSendingRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const toast = useToast();

  async function handleExerciseHistoryRegister() {
    try {
      setSendingRegister(true);

      await api.post('/history', { exercise_id: exerciseId });

      toast.show({
        render: ({ id }) => {
          return (
            <ToastMessage
              id={id}
              action='success'
              title='Parabéns! Exercício registrado no seu histórico.'
              onClose={() => toast.close(id)}
            />
          );
        },
        placement: 'top',
      });

      navigate('History');
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível registrar exercício.';

      toast.show({
        render: ({ id }) => {
          return (
            <ToastMessage
              id={id}
              action='error'
              title={title}
              onClose={() => toast.close(id)}
            />
          );
        },
        placement: 'top',
      });
    } finally {
      setSendingRegister(false);
    }
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/${exerciseId}`);
      setExercise(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os detalhes do exercício';

      toast.show({
        render: ({ id }) => {
          return (
            <ToastMessage
              id={id}
              action='error'
              title={title}
              onClose={() => toast.close(id)}
            />
          );
        },
        placement: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  return (
    <VStack flex={1}>
      <VStack px='$8' bg='$gray600' pt='$12'>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color='$green500' size='xl' />
        </TouchableOpacity>

        <HStack
          justifyContent='space-between'
          alignItems='center'
          mt='$4'
          mb='$8'
        >
          <Heading
            color='$gray100'
            fontFamily='$heading'
            fontSize='$lg'
            flexShrink={1}
          >
            {exercise.name}
          </Heading>
          <HStack alignItems='center'>
            <BodySvg />

            <Text color='$gray200' ml='$1' textTransform='capitalize'>
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {isLoading ? (
          <Loading />
        ) : (
          <VStack p='$8'>
            <Box rounded='$lg' h='$80' mb={3} overflow='hidden'>
              <Image
                w='$full'
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exercise?.demo}`,
                }}
                alt='Nome do exercício'
                h='$full'
                rounded='$lg'
              />
            </Box>

            <Box bg='$gray600' rounded='$md' pb='$4' px='$4'>
              <HStack
                alignItems='center'
                justifyContent='space-around'
                mb='$6'
                mt='$5'
              >
                <HStack>
                  <SeriesSvg />
                  <Text color='$gray200' ml='$2'>
                    {exercise.series} séries
                  </Text>
                </HStack>

                <HStack>
                  <RepetitionsSvg />
                  <Text color='$gray200' ml='$2'>
                    {exercise.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>

              <Button
                title='Marcar como realizado'
                isLoading={sendingRegister}
                onPress={handleExerciseHistoryRegister}
              />
            </Box>
          </VStack>
        )}
      </ScrollView>
    </VStack>
  );
}
