import { Button } from '@components/Button';
import { Input } from '@components/Input';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';

import { Center, Heading, Text, VStack, useToast } from '@gluestack-ui/themed';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import defaulUserPhotoImg from '@assets/userPhotoDefault.png';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import { byteToMegabyteScale } from '@utils/byteToMegabyteScale';
import { ToastMessage } from '@components/ToastMessage';
import { useAuth } from '@hooks/useAuth';

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
};

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    'https://github.com/ViniciusMassari.png'
  );

  const { user, updateUserProfile } = useAuth();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true);
      const userUpdated = user;
      userUpdated.name = data.name;
      await api.put('/users', data);
      await updateUserProfile(userUpdated);
      toast.show({
        render: ({ id }) => {
          return (
            <ToastMessage
              id={id}
              action='success'
              title='Perfil atualizado com sucesso!'
              onClose={() => toast.close(id)}
            />
          );
        },
        placement: 'top',
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar os dados. Tente novamente mais tarde.';

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
      setIsUpdating(false);
    }
  }

  async function handleUserPhotoSelect() {
    try {
      const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        aspect: [4, 4],
      });
      if (canceled) {
        return;
      }

      const selectedPhoto = assets[0];

      const photoUri = assets[0].uri;

      if (photoUri) {
        const photoInfo = (await FileSystem.getInfoAsync(photoUri)) as {
          size: number;
        };

        if (photoInfo.size && byteToMegabyteScale(photoInfo.size) > 5) {
          return toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action='error'
                title='Essa imagem é muito grande. Escolha uma de até 5MB.'
                onClose={() => toast.close(id)}
              />
            ),
          });
        }
        const fileExtension = photoUri.split('.').pop();

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoUri,
          type: `${selectedPhoto.type}/${fileExtension}`,
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append('avatar', photoFile);

        const avatarUpdatedResponse = await api.patch(
          '/users/avatar',
          userPhotoUploadForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const userUpdated = user;
        userUpdated.avatar = avatarUpdatedResponse.data.avatar;

        updateUserProfile(userUpdated);

        toast.show({
          render: ({ id }) => (
            <ToastMessage
              id={id}
              action='success'
              title='Foto atualizada com sucesso'
              onClose={() => toast.close(id)}
            />
          ),
          placement: 'top',
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <VStack flex={1}>
      <ScreenHeader title='Perfil' />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt='$6' px='$10'>
          <UserPhoto
            source={
              user.avatar
                ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                : defaulUserPhotoImg
            }
            size='xl'
            alt='Imagem do usuário'
          />

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color='$green500'
              fontFamily='$heading'
              fontSize='$md'
              mt='$2'
              mb='$8'
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>

          <Center w='$full' gap='$4'>
            <Controller
              name='name'
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    placeholder='Nome'
                    isReadOnly
                    bg='$gray600'
                    errorMessage={errors.name?.message}
                  />
                );
              }}
            />
            <Controller
              name='email'
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Input
                    onChangeText={onChange}
                    value={value}
                    bg='$gray600'
                    placeholder='E-mail'
                    errorMessage={errors.email?.message}
                    isReadOnly
                  />
                );
              }}
            />
          </Center>

          <Heading
            alignSelf='flex-start'
            fontFamily='$heading'
            color='$gray200'
            fontSize='$md'
            mt='$12'
            mb='$2'
          >
            Alterar senha
          </Heading>

          <Center w='$full' gap='$4'>
            <Controller
              name='old_password'
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Input
                    onChangeText={onChange}
                    value={value}
                    placeholder='Senha antiga'
                    bg='$gray600'
                    errorMessage={errors.old_password?.message}
                    secureTextEntry
                  />
                );
              }}
            />

            <Controller
              name='password'
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Input
                    onChangeText={onChange}
                    value={value}
                    placeholder='Nova senha'
                    bg='$gray600'
                    errorMessage={errors.password?.message}
                    secureTextEntry
                  />
                );
              }}
            />

            <Controller
              name='confirm_password'
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Input
                    onChangeText={onChange}
                    value={value}
                    placeholder='Confirme a nova senha'
                    bg='$gray600'
                    errorMessage={errors.confirm_password?.message}
                    secureTextEntry
                  />
                );
              }}
            />

            <Button
              title='Atualizar'
              onPress={handleSubmit(handleProfileUpdate)}
              isLoading={isUpdating}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
