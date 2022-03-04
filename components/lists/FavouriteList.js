// Import from React and library
import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

// Import from UI Kitten Library
import {Avatar, Layout, Text} from '@ui-kitten/components';

// Import from files

import {colors} from '../../utils';
import {uploadsUrl} from '../../utils/url';
import {LikeComponent} from '../index';
import {getUserById} from '../../hooks/ApiHooks';

const FavouriteList = ({navigation, singleItem}) => {
  const [itemUser, setItemUser] = useState({});

  const getUser = async () => {
    const user = await getUserById(singleItem.user_id);
    setItemUser(user);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => {
        navigation.navigate('Product Detail', {file: singleItem});
      }}
    >
      <Layout style={styles.layout}>
        <Avatar
          shape="square"
          size={'giant'}
          style={styles.productImage}
          source={{uri: uploadsUrl + singleItem.thumbnails.w160}}
        />
      </Layout>
      <Text numberOfLines={1} style={styles.title}>
        {singleItem.title}
      </Text>

      <Layout style={styles.user}>
        <Text style={styles.postTitle}>Post by</Text>
        <Text style={styles.username}>{itemUser.username}</Text>
      </Layout>
      <LikeComponent file={singleItem} heartAnimation={false} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    flex: 3.5,
    width: 100,
    alignSelf: 'center',
  },
  username: {
    flex: 3,
    fontSize: 12,
    fontFamily: 'Karla_400Regular',
    alignSelf: 'center',
    right: '-10%',
    top: '30%',
  },
  layout: {
    flex: 2,
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postTitle: {
    fontSize: 14,
    top: '30%',
    fontFamily: 'Karla_400Regular',
    alignSelf: 'flex-end',
    right: '15%',
  },
  productImage: {
    width: 70,
    height: 70,
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: colors.box,
    left: 10,
  },
  user: {
    flex: 3,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    right: 30,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Karla_700Bold',
    alignSelf: 'center',
    width: 170,
    marginStart: 25,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: 10,
    backgroundColor: colors.box,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
});

FavouriteList.propTypes = {
  singleItem: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  showMyMedia: PropTypes.bool,
  displayText: PropTypes.bool,
  file: PropTypes.number,
};

export default FavouriteList;
