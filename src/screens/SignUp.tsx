import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack,
  useToast,
} from '@gluestack-ui/themed';

import BackgroundImg from '@assets/background.png';
import Logo from '@assets/logo.svg';

import { useState } from 'react';
import { useAuth } from '@hooks/useAuth';

import { AppError } from '@utils/AppError';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

import { useForm, Controller } from 'react-hook-form';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
('react-hook-form');

import { api } from '@services/api';

import { ToastMessage } from '@components/ToastMessage';

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
};

export function SignUp({
  navigation: { goBack },
}: AuthNavigatorRoutesProps<'SignUp'>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const toast = useToast();

  async function handleSignUp({ name, email, password }: FormDataProps) {
    try {
      setIsLoading(true);

      await api.post('/users', { name, email, password });
      await signIn(email, password);
    } catch (error) {
      setIsLoading(false);

      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : 'Não foi possível criar a conta. Tente novamente mais tarde';

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

  function handleGoBack() {
    goBack();
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
        <Image
          w='$full'
          h={624}
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt='Pessoas treinando'
          position='absolute'
        />

        <VStack flex={1} px='$10' pb='$16'>
          <Center my='$24'>
            <Logo />

            <Text color='$gray100' fontSize='$sm'>
              Treine sua mente e seu corpo
            </Text>
          </Center>

          <Center flex={1} gap='$2'>
            <Heading color='$gray100'>Crie sua conta</Heading>
            <Controller
              rules={{
                required: 'Informe seu nome',
              }}
              control={control}
              name='name'
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='Nome'
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='email'
              rules={{
                required: 'Informe seu email',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'E-mail inválido',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='E-mail'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='password'
              rules={{
                required: 'Informe sua senha',
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='Senha'
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                />
              )}
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              name='password_confirm'
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='Confirme a senha'
                  secureTextEntry
                  onChangeText={onChange}
                  onSubmitEditing={handleSubmit(handleSignUp)}
                  returnKeyType='send'
                  errorMessage={errors.password_confirm?.message}
                  value={value}
                />
              )}
            />

            <Button
              title='Criar e acessar'
              onPress={handleSubmit(handleSignUp)}
              isLoading={isLoading}
            />
          </Center>

          <Button
            title='Voltar para o login'
            variant='outline'
            mt='$12'
            onPress={handleGoBack}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
