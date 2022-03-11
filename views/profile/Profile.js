// Import from React and library
import React, {useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, ActivityIndicator, Dimensions} from 'react-native';
import PropTypes from 'prop-types';

// Import from UI Kitten library
import {Layout, Text, Avatar} from '@ui-kitten/components';

// Import from files
import {MainContext} from '../../contexts/MainContext';
import colors from '../../utils/colors';
import assetAvatar from '../../assets/backgrounds/Avatar.png';
import BoxIcon from '../../assets/icons/boxIcon.svg';
import HeartIcon from '../../assets/icons/heartIcon.svg';
import BubbleIcon from '../../assets/icons/bubbleIcon.svg';

// hooks import
import {getAvatar, useMedia} from '../../hooks/MediaHooks';
import {getUserById} from '../../hooks/ApiHooks';

// components import
import {ProfileSeparator} from '../../components/elements/ItemSeparator';

// Import screen orientation
import screenOrientation from '../../components/screenOrientation';

const Profile = ({route}) => {
  const uploadDefaultUri = Image.resolveAssetSource(assetAvatar).uri;
  const {user, updateAvatar} = useContext(MainContext);
  const [avatar, setAvatar] = useState(uploadDefaultUri);
  const userIdParam = route.params?.profileParam ?? user.user_id;
  const [userProfile, setUserProfile] = useState({});
  const {mediaArray} = useMedia();

  // Screen orientation
  const [orientation, setOrientation] = useState(
  screenOrientation.isPortrait() ? 'portrait' : 'landscape'
  );

  // Fetching avatar
  const fetchAvatar = async () => {
    try {
      const info = await getUserById(userIdParam);
      setUserProfile(info);
      await getAvatar(userIdParam, setAvatar);
    } catch (error) {
      console.log('Profile avatar', error.message);
    }
  };

  // Get count for users posts
  const myPosts = mediaArray.filter(
    (item) => item.user_id === userProfile.user_id
  );

  // Get count of messages sent by user
  const myMessages = mediaArray.filter((file) => {
    const userComments = file.fileComments.filter(
      (comment) => comment.user_id === userProfile.user_id
    );
    if (userComments.length > 0) return userComments;
  });

  // Get count for posts liked by user
  const myFavourites = mediaArray.filter((file) => {
    const userFavourites = file.fileFavourites.filter(
      (favourite) => favourite.user_id === userProfile.user_id
    );
    if (userFavourites.length > 0) return userFavourites;
  });

  useEffect(() => {
    fetchAvatar();
    Dimensions.addEventListener('change', () => {
      setOrientation(screenOrientation.isPortrait() ? 'portrait' : 'landscape');
    });
  }, [updateAvatar]);

  if (orientation === 'portrait') {
    return (
      <Layout style={styles.container}>
        <Image
          style={styles.backgroundImg}
          source={require('../../assets/backgrounds/profile_background.png')}
          PlaceholderContent={<ActivityIndicator />}
        />
        <Layout style={styles.profileWrapper}>
          <Avatar style={styles.avatar} source={{uri: avatar}} shape="round" />
          <Text style={styles.username}>{userProfile.username}</Text>
          <ProfileSeparator />
          <Text style={styles.bio}>Bio</Text>
          {userProfile.full_name ? (
            <Text style={styles.description}>{userProfile.full_name}</Text>
          ) : (
            <Text style={styles.description}>{'Nothing to say'}</Text>
          )}
          <ProfileSeparator />
        </Layout>

        <Layout style={styles.statisticsWrapper}>
          <Text style={styles.activity}>Activity</Text>
          <Layout style={styles.hintContainer}>
            <Text style={styles.hint}>Published</Text>
            <Text style={styles.hint}>Liked</Text>
            <Text style={styles.hint}>Commented</Text>
          </Layout>
          <Layout style={styles.icons}>
            <BoxIcon width="90" height="90" />
            <HeartIcon width="90" height="90" />
            <BubbleIcon width="90" height="90" />
          </Layout>
          <Layout style={styles.statisticsView}>
            <Text style={styles.numbers}>{myPosts.length}</Text>
            <Text style={styles.numbers}>{myFavourites.length}</Text>
            <Text style={styles.numbers}>{myMessages.length}</Text>
          </Layout>
        </Layout>
      </Layout>
    );
  } else {
    return (
      <Layout style={styles.containerLandscape}>
        <Layout style={styles.profileWrapperLandscape}>
          <Image
            style={styles.backgroundImg}
            source={require('../../assets/backgrounds/profile_background.png')}
            PlaceholderContent={<ActivityIndicator />}
          />
          <Avatar style={styles.avatarLandscape} source={{uri: avatar}} shape="round" />
          <Text style={styles.usernameLandscape}>{userProfile.username}</Text>
          <ProfileSeparator />
          <Text style={styles.bioLandscape}>Bio</Text>
          {userProfile.full_name ? (
            <Text style={styles.descriptionLandscape}>{userProfile.full_name}</Text>
          ) : (
            <Text style={styles.descriptionLandscape}>{'Nothing to say'}</Text>
          )}
        </Layout>

        <Layout style={styles.statisticsWrapperLandscape}>
          <Text style={styles.activity}>Activity</Text>
          <Layout style={styles.hintContainer}>
            <Text style={styles.hint}>Published</Text>
            <Text style={styles.hint}>Liked</Text>
            <Text style={styles.hint}>Commented</Text>
          </Layout>
          <Layout style={styles.icons}>
            <BoxIcon width="90" height="90" />
            <HeartIcon width="90" height="90" />
            <BubbleIcon width="90" height="90" />
          </Layout>
          <Layout style={styles.statisticsView}>
            <Text style={styles.numbers}>{myPosts.length}</Text>
            <Text style={styles.numbers}>{myFavourites.length}</Text>
            <Text style={styles.numbers}>{myMessages.length}</Text>
          </Layout>
        </Layout>
      </Layout>
    );
  };
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
    borderColor: colors.background,
    borderWidth: 4,
    position: 'absolute',
    top: '10%',
  },
  username: {
    marginTop: '55%',
    fontSize: 26,
    fontFamily: 'Karla_700Bold',
    color: colors.text_dark,
  },
  bio: {
    marginTop: '5%',
    fontSize: 20,
    fontFamily: 'Karla_700Bold',
    color: colors.text_dark,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    maxWidth: '80%',
    fontFamily: 'Karla_400Regular',
    color: colors.text_dark,
  },
  statisticsWrapper: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.background,
  },
  activity: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Karla_700Bold',
    marginTop: '5%',
    alignSelf: 'center',
  },
  icons: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: colors.background,
  },
  statisticsView: {
    flex: 1,
    flexDirection: 'row',
    bottom: '6%',
    justifyContent: 'space-evenly',
    backgroundColor: colors.background,
  },
  numbers: {
    marginHorizontal: '10%',
    fontFamily: 'Karla_700Bold',
  },
  hintContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: colors.background,
    marginBottom: -16,
    marginStart: '2%',
  },
  hint: {
    marginHorizontal: '10%',
    fontFamily: 'Karla_400Regular',
    fontSize: 12,
  },
  containerLandscape: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  profileWrapperLandscape: {
    width: '50%',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  avatarLandscape: {
    width: 100,
    height: 100,
    borderColor: colors.background,
    borderWidth: 4,
    position: 'absolute',
    top: '10%',
  },
  usernameLandscape: {
    marginTop: '35%',
    marginBottom: -10,
    fontSize: 24,
    fontFamily: 'Karla_700Bold',
    color: colors.text_dark,
  },
  bioLandscape: {
    marginTop: '2%',
    fontSize: 20,
    fontFamily: 'Karla_700Bold',
    color: colors.text_dark,
  },
  descriptionLandscape: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: '80%',
    fontFamily: 'Karla_400Regular',
    color: colors.text_dark,
  },
  statisticsWrapperLandscape: {
    width: '50%',
    flexDirection: 'column',
    backgroundColor: colors.background,
  },
});

Profile.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.any,
};

export default Profile;
