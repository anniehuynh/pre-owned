import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from '../utils/url';

// Communicating with server

const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      const message = json.error
        ? `${json.message}: ${json.error}`
        : json.message;
      throw new Error(message || response.statusText);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchFromMedia = async (jsonData, setCategory) => {
  const media = await Promise.all(
    jsonData.map(async (item) => {
      const response = await fetch(baseUrl + 'media/' + item.file_id);
      const mediaData = await response.json();
      // console.log('Media Data', mediaData);
      return mediaData;
    })
  );
  setCategory(media);
  return media;
};

// Getting token from Storage
const getToken = async () => {
  return await AsyncStorage.getItem('userToken');
};

export {getToken, fetchData, fetchFromMedia};
