import { HistoryCard } from '@components/HistoryCard';
import { ScreenHeader } from '@components/ScreenHeader';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
  VStack,
  SectionList,
  Text,
  useToast,
  Heading,
} from '@gluestack-ui/themed';
import { ToastMessage } from '@components/ToastMessage';
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO';
import { Loading } from '@components/Loading';

export function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);
  const toast = useToast();
  async function fetchHistory() {
    try {
      setIsLoading(true);
      const response = await api.get('/history');

      setExercises(response.data);
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

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  return (
    <VStack flex={1}>
      <ScreenHeader title='Histórico de Exercícios' />
      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={exercises}
          keyExtractor={(item) => item.id as any}
          renderItem={({ item }) => <HistoryCard data={item} />}
          renderSectionHeader={({ section }) => (
            <Heading color='$gray200' fontSize='$md' mt='$10' mb='$3'>
              {section.title}
            </Heading>
          )}
          style={{ paddingHorizontal: 32 }}
          contentContainerStyle={
            exercises.length === 0 && { flex: 1, justifyContent: 'center' }
          }
          ListEmptyComponent={() => (
            <Text color='$gray200' textAlign='center'>
              Não há exercícios registrados ainda. {'\n'}
              Vamos fazer execícios hoje?
            </Text>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </VStack>
  );
}
