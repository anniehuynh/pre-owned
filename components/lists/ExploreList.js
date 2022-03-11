// Import from react
import React from 'react';
import PropTypes from 'prop-types';

// Import from UI Kitten library
import {List} from '@ui-kitten/components';

// Import from files
import {useMedia} from '../../hooks/MediaHooks';
import {GalleryItemHorizontal, GalleryItemVertical} from './GalleryItem';
import {colors} from '../../utils';

// Return a horizontal gallery list
const GalleryListHorizontal = ({navigation}) => {
  const {mediaArray} = useMedia();

  // Sorting items by recently added date and displaying first 5
  mediaArray.sort((a, b) => a.time_added < b.time_added);
  const showFirstFive = mediaArray.slice(0, 5);

  return (
    <List
      style={{backgroundColor: colors.background}}
      data={showFirstFive}
      contentContainerStyle={{
        alignItems: 'center',
        paddingEnd: 30,
        marginStart: 20,
      }}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      renderItem={({item}) => (
        <GalleryItemHorizontal navigation={navigation} singleItem={item} />
      )}
    ></List>
  );
};

// Return a vertical gallery list
const GalleryListVertical = ({navigation}) => {
  const {mediaArray} = useMedia();
  mediaArray.sort((a, b) => a.favCount < b.favCount);
  const showFirstFive = mediaArray.slice(0, 5);

  return (
    <List
      style={{backgroundColor: colors.background}}
      data={showFirstFive}
      contentContainerStyle={{
        alignItems: 'center',
      }}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      renderItem={({item}) => (
        <GalleryItemVertical
          navigation={navigation}
          singleItem={item}
          displayText={false}
        />
      )}
    ></List>
  );
};

// Return a vertical gallery list
const GalleryListVerticalLandscape = ({navigation}) => {
  const {mediaArray} = useMedia();
  mediaArray.sort((a, b) => a.favCount < b.favCount);
  const showFirstFive = mediaArray.slice(0, 5);

  return (
    <List
      style={{backgroundColor: colors.background}}
      data={showFirstFive}
      contentContainerStyle={{
        alignItems: 'center',
        paddingEnd: 30,
        marginStart: 20,
      }}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      renderItem={({item}) => (
        <GalleryItemVertical
          navigation={navigation}
          singleItem={item}
          displayText={false}
        />
      )}
    ></List>
  );
};

GalleryListHorizontal.propTypes = {
  navigation: PropTypes.object,
};

GalleryListVertical.propTypes = {
  navigation: PropTypes.object,
};

GalleryListVerticalLandscape.propTypes = {
  navigation: PropTypes.object,
};

export {GalleryListHorizontal, GalleryListVertical, GalleryListVerticalLandscape};
