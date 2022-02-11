import {Alert, Image, ScrollView, StyleSheet} from 'react-native';
import React, {useContext, useState} from 'react';
import {Video} from 'expo-av';
import {Controller, useForm} from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import {Card} from 'react-native-elements';
import FormInput from '../components/formComponents/FormInput';
import {AppButton, FormButton} from '../components/elements/AppButton';
import {Text} from '@ui-kitten/components';
import {getToken} from '../hooks/CommonFunction';
import {postMedia, postTag} from '../hooks/MediaHooks';
import {appId} from '../utils/url';
import {MainContext} from '../contexts/MainContext';

const AddListing = ({navigation}) => {
  // const [image, setImage] = useState('../assets/backgrounds/ProfileBG.png');
  const [image, setImage] = useState(
    'https://place-hold.it/300x200&text=Choose'
  );
  const [imageSelected, setImageSelected] = useState(false);
  const [type, setType] = useState('image');
  const {update, setUpdate} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'onBlur',
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });
    // console.log('Picke image', result);
    if (!result.cancelled) {
      setImage(result.uri);
      setImageSelected(true);
      setType(result.type);
    }
  };

  const onSubmit = async (data) => {
    if (!imageSelected) {
      Alert.alert('Please select file');
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);

    const filename = image.split('/').pop();
    let fileExtension = filename.split('.').pop();

    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;
    // console.log('Extension', fileExtension);

    formData.append('file', {
      uri: image,
      name: filename,
      type: type + '/' + fileExtension,
    });
    // console.log('formData', formData);

    try {
      const token = await getToken();
      const response = await postMedia(formData, token);
      // console.log('Media upload', response);

      const tagResponse = await postTag(
        {file_id: response.file_id, tag: appId},
        token
      );
      // console.log('upload response', tagResponse);

      tagResponse &&
        Alert.alert('File', 'uploaded', [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(update + 1);
              navigation.navigate('Explore');
              reset();
            },
          },
        ]);
    } catch (error) {
      console.error('Media upload: ', error);
    }
  };

  // Resets the form
  const reset = () => {
    setImage('https://place-hold.it/300x200&text=Choose');
    setImageSelected(false);
    setValue('title', '');
    setValue('description', '');
    setType('image');
  };

  return (
    <ScrollView>
      <Card>
        <Card.Image
          source={{uri: image}}
          style={styles.image}
          onPress={pickImage}
        />
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required.'},
            minLength: {
              value: 5,
              message: 'Username has to be at least 5 characters.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <FormInput
              style={styles.inputStyle}
              iconName="text-outline"
              name="Title"
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              textEntry={false}
            />
          )}
          name="title"
        />
        {errors.title && (
          <Text status="danger">{errors.title && errors.title.message} </Text>
        )}

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required.'},
            minLength: {
              value: 10,
              message: 'Description has to be at least 10 characters.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <FormInput
              style={styles.inputStyle}
              iconName="text-outline"
              name="Description"
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              textEntry={false}
            />
          )}
          name="description"
        />

        {errors.description && (
          <Text status="danger">
            {errors.description && errors.description.message}{' '}
          </Text>
        )}

        <FormButton
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          text="Upload"
        />
        <AppButton
          title="Reset form"
          titleStyle={{fontWeight: 'bold'}}
          onPress={reset}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  inputStyle: {},
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 5,
  },
});

export default AddListing;
