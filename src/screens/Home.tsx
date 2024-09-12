import { ExerciseCard } from '@components/ExerciseCard';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { Loading } from '@components/Loading';
import { ToastMessage } from '@components/ToastMessage';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { Heading, HStack, Text, useToast, VStack } from '@gluestack-ui/themed';
import { useFocusEffect } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';

export function Home({
  navigation: { navigate },
}: AppNavigatorRoutesProps<'Home'>) {
  const [isLoading, setIsLoading] = useState(true);

  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [groupSelected, setGroupSelected] = useState('bíceps');

  const toast = useToast();

  function handleOpenExerciseDetails(exerciseId: string) {
    navigate('Exercise', { exerciseId });
  }
  async function fetchGroups() {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os grupos musculares';

      toast.show({
        render: ({ id }) => {
          return (
            <ToastMessage
              title={title}
              action='error'
              id={id}
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          );
        },
        placement: 'top',
      });
    }
  }

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/bygroup/${groupSelected}`);
      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os exercícios.';

      toast.show({
        render: ({ id }) => {
          return (
            <ToastMessage
              title={title}
              action='error'
              id={id}
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
    fetchGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup();
    }, [groupSelected])
  );

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <VStack px='$8' flex={1}>
          <HStack justifyContent='space-between' mb='$5' alignItems='center'>
            <Heading color='$gray200' fontSize='$md'>
              Exercícios
            </Heading>
            <Text color='$gray200' fontSize='$sm' fontFamily='$body'>
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExerciseCard
                exercise={item}
                onPress={() => handleOpenExerciseDetails(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </VStack>
      )}
    </VStack>
  );
}
