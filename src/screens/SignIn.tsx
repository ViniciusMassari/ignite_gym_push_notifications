import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  useToast,
  VStack,
} from '@gluestack-ui/themed';

import BackgroundImg from '@assets/background.png';
import Logo from '@assets/logo.svg';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { Controller, useForm } from 'react-hook-form';

import { useAuth } from '@hooks/useAuth';

import { AppError } from '@utils/AppError';
import { ToastMessage } from '@components/ToastMessage';
import { useState } from 'react';

type FormDataProps = {
  email: string;
  password: string;
};

export function SignIn({
  navigation: { navigate },
}: AuthNavigatorRoutesProps<'SignIn'>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({});

  const { signIn } = useAuth();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn({ email, password }: FormDataProps) {
    try {
      setIsLoading(true);

      await signIn(email, password);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : 'Não foi possível entrar na conta. Tente novamente mais tarde';

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

          <Center gap='$2'>
            <Heading color='$gray100'>Acesse sua conta</Heading>
            <Controller
              name='email'
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <Input
                    placeholder='E-mail'
                    keyboardType='email-address'
                    autoCapitalize='none'
                    onChangeText={onChange}
                    errorMessage={errors.email?.message}
                  />
                );
              }}
            />
            <Controller
              name='password'
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <Input
                    placeholder='Senha'
                    secureTextEntry
                    autoCapitalize='none'
                    onChangeText={onChange}
                    errorMessage={errors.password?.message}
                  />
                );
              }}
            />

            <Button
              title='Acessar'
              onPress={handleSubmit(handleSignIn)}
              isLoading={isLoading}
            />
          </Center>

          <Center flex={1} justifyContent='flex-end' marginTop='$4'>
            <Text color='$gray100' fontSize='$sm' mb='$3' fontFamily='$body'>
              Ainda não tem acesso?
            </Text>

            <Button
              title='Criar conta'
              variant='outline'
              onPress={() => navigate('SignUp')}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
