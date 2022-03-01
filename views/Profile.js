// Import from React and library
import React, {useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';

// Import from UI Kitten library
import {Layout, Text, Avatar} from '@ui-kitten/components';

// Import from files
import {MainContext} from '../contexts/MainContext';
import colors from '../utils/colors';
import {uploadsUrl} from '../utils/url';
import {getFilesByTag} from '../hooks/MediaHooks';
import {getUserById} from '../hooks/ApiHooks';
import {ProfileSeparator} from '../components/elements/ItemSeparator';
import Statistics from '../components/elements/ProfileStatistics';

const Profile = ({route}) => {
  const {setIsLoggedIn, user} = useContext(MainContext);
  const [avatar, setAvatar] = useState();
  const [hasAvatar, setHasAvatar] = useState(false);
  const userIdParam = route.params?.profileParam ?? user.user_id;
  const [userProfile, setUserProfile] = useState({});

  const fetchAvatar = async () => {
    try {
      const info = await getUserById(userIdParam);
      setUserProfile(info);
      const avatarArray = await getFilesByTag('avatar_' + userIdParam);
      const avatar = avatarArray.pop();
      setAvatar(uploadsUrl + avatar.filename);
      if (avatar != null) {
        setHasAvatar(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchAvatar();
    // console.log('profile', user);
    // console.log("param", userIdParam);
    // console.log("user", userProfile);
  }, []);

  return (
    <Layout style={styles.container}>
      <Image
        style={styles.backgroundImg}
        source={require('../assets/backgrounds/profile_background.png')}
        PlaceholderContent={<ActivityIndicator />}
      />
      <Layout style={styles.profileWrapper}>
        {hasAvatar ? (
          <Avatar style={styles.avatar} source={{uri: avatar}} shape="round" />
        ) : (
          <Avatar
            style={styles.avatar}
            source={require('../assets/backgrounds/Avatar.png')}
            shape="round"
          />
        )}
        <Text style={styles.username}>{userProfile.username}</Text>
        <ProfileSeparator />
        <Text style={styles.bio}>Bio</Text>
        {userProfile.full_name ? (
          <Text style={styles.description}>{userProfile.full_name}</Text>
        ) : (
          <Text style={styles.description}>User description not set.</Text>
        )}
        <ProfileSeparator />
      </Layout>
      <Statistics />
    </Layout>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundImg: {
    position: 'absolute',
    top: 0,
  },
  profileWrapper: {
    flex: 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  avatar: {
    width: 150,
    height: 150,
    position: 'absolute',
    top: '10%',
  },
  username: {
    marginTop: '53%',
    fontSize: 26,
    fontFamily: 'Karla_400Regular',
  },
  bio: {
    marginTop: '5%',
    fontSize: 20,
    fontFamily: 'Karla_700Bold',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    maxWidth: '80%',
    fontFamily: 'Karla_400Regular',
  },
});

Profile.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Profile;
