import React, {useState, useEffect} from 'react';
import {StyleSheet, Alert, ScrollView, Dimensions} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {PropTypes} from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// Import from ui Kitten Library
import {
  Button,
  Text,
  Layout,
  CheckBox,
  Modal,
  Card,
} from '@ui-kitten/components';

// Api import
import {checkUserName, signUp} from '../../hooks/ApiHooks';

// App component import
import FormInput from './FormInput';
import {FormButton, PasswordButton} from '../elements/AppButton';
import ErrorMessage from '../elements/ErrorMessage';

// Styling import
import {colors} from '../../utils';

// Import screen orientation
import screenOrientation from '../../components/screenOrientation';

const SignupForm = ({setFormToggle}) => {
  // Terms checkbox
  const [checked, setChecked] = useState(false);
  const [visible, setVisible] = useState(false);
  // Password visible
  const [shown, setShown] = useState(true);
  const togglePassword = () => {
    setShown(!shown);
  };
  const [confirmShown, setConfirmShown] = useState(true);
  const toggleConfirm = () => {
    setConfirmShown(!confirmShown);
  };

  // Screen orientation
  const [orientation, setOrientation] = useState(
    screenOrientation.isPortrait() ? 'portrait' : 'landscape'
  );

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    if (!checked) {
      Alert.alert('Please read Terms and Conditions');
      return;
    }
    try {
      delete data.confirmPassword;
      const userData = await signUp(data);
      if (userData) {
        Alert.alert('Success', 'Successfully signed up.');
        setFormToggle(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    Dimensions.addEventListener('change', () => {
      setOrientation(screenOrientation.isPortrait() ? 'portrait' : 'landscape');
    });
  }, []);

  if (orientation === 'portrait') {
    return (
      <KeyboardAwareScrollView>
        <Layout style={styles.layout}>
          <Layout style={styles.textContainer}>
            <Text category="h5" style={styles.titleRegister}>
              Create account
            </Text>
            <Text category="s1" style={styles.textWelcome}>
              Find the stuffs in need or earn some extra income now
            </Text>
          </Layout>
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'This is required.'},
              minLength: {
                value: 3,
                message: 'Username has to be at least 3 characters.',
              },
              validate: async (value) => {
                try {
                  const available = await checkUserName(value);
                  if (available) {
                    return true;
                  } else {
                    return 'Username is already taken.';
                  }
                } catch (error) {
                  console.error(error);
                }
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <FormInput
                style={styles.input}
                iconName="person-outline"
                name="Username"
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                textEntry={false}
              />
            )}
            name="username"
          />

          <ErrorMessage
            error={errors?.username}
            message={errors?.username?.message}
          />

          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'This is required.'},
              pattern: {
                value: /\S+@\S+\.\S+$/,
                message: 'Not valid email.',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <FormInput
                style={styles.input}
                iconName="email-outline"
                name="Email"
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                textEntry={false}
              />
            )}
            name="email"
          />

          <ErrorMessage error={errors?.email} message={errors?.email?.message} />

          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'This field cannot be empty'},
              pattern: {
                /**
                 *  Password criteria
                 *  Minimum length 8 , atlease 1 digit
                 *  Atleast 1 upper case of lower case character
                 */
                value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
                message: 'Min 8 characters, uppercase & number',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Layout style={styles.passwordWrap}>
                <FormInput
                  style={styles.passwordInput}
                  iconName="lock-outline"
                  name="Password"
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  textEntry={shown}
                />
                <PasswordButton onPress={togglePassword} iconName={shown? "eye-outline" : "eye-off-2-outline"} style={styles.passwordBtn}></PasswordButton>
              </Layout>
            )}
            name="password"
          />

          <ErrorMessage
            error={errors?.password}
            message={errors?.password?.message}
          />

          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'This field cannot be empty'},
              validate: (value) => {
                const {password} = getValues();
                if (value === password) {
                  return true;
                } else {
                  return 'Passwords do not match.';
                }
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Layout style={styles.passwordWrap}>
                <FormInput
                style={styles.passwordInput}
                iconName="lock-outline"
                name="Confirm password"
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                textEntry={confirmShown}
                />
                <PasswordButton onPress={toggleConfirm} iconName={confirmShown? "eye-outline" : "eye-off-2-outline"} style={styles.passwordBtn}></PasswordButton>
              </Layout>
            )}
            name="confirmPassword"
          />

          <ErrorMessage
            error={errors?.confirmPassword}
            message={errors?.confirmPassword?.message}
          />

          <CheckBox
            style={styles.checkBox}
            checked={checked}
            onChange={(nextChecked) => setChecked(nextChecked)}
          >
            <Text style={styles.Terms} onPress={() => setVisible(true)}>
              I accept Terms and Condition
            </Text>
            <Modal
              visible={visible}
              backdropStyle={styles.backdrop}
              onBackdropPress={() => setVisible(false)}
            >
              <Card style={styles.modal} disabled={true}>
                <ScrollView>
                  <Text style={styles.text}>
                    This agreement is between you the [“User” or “you”] and
                    PreOwned [“we or us or our”] If you do not agree with all of
                    the provisions of this agreement, you cannot use the Services.
                  </Text>
                  <Text style={styles.text}>
                    To remove any doubt, in the event of any conflict or
                    discrepancy between these Terms and conditions and any other
                    provisions and/or terms and/or otherwise between PreOwned and
                    you, the provisions and the terms of these Terms of Use will
                    prevail. Please feel free to contact us with any questions
                    regarding the content of this agreement.
                  </Text>
                  <Text style={styles.text}>
                    - Seller: those who upload their second hand product on our
                    portal in order to sell it.
                  </Text>
                  <Text style={styles.text}>
                    - Buyers: those who visit the portal in order to consult and
                    buy certain second-hand products.
                  </Text>
                  <Text style={styles.text}>
                    Sellers and Buyers users will be identified in the rest of
                    this legal document with the word “User/s”. PreOwned reserves
                    the right to update the Terms and Conditions at any time
                    without notice to the user.
                  </Text>
                  <Text style={styles.text}>
                    This document represents the full and final agreement of the
                    parties regarding these Terms and Conditions. In particular,
                    it contains each and every legal and usage clause that the
                    user must comply with during the entire period of use of our
                    services.
                  </Text>
                  <Button
                    style={styles.dismissBtn}
                    onPress={() => setVisible(false)}
                  >
                    DISMISS
                  </Button>
                </ScrollView>
              </Card>
            </Modal>
          </CheckBox>

          <FormButton
            style={styles.button}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            text="Sign Up"
          />
        </Layout>
      </KeyboardAwareScrollView>
    );
  } else {
    return (
      <KeyboardAwareScrollView>
        <Layout style={styles.layoutLandscape}>
          <Layout style={styles.textContainerLandscape}>
            <Text category="h5" style={styles.titleRegister}>
              Create account
            </Text>
            <Text category="s1" style={styles.textWelcomeLandscape}>
              Find the stuffs in need or earn some extra income now
            </Text>
          </Layout>
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'This is required.'},
              minLength: {
                value: 3,
                message: 'Username has to be at least 3 characters.',
              },
              validate: async (value) => {
                try {
                  const available = await checkUserName(value);
                  if (available) {
                    return true;
                  } else {
                    return 'Username is already taken.';
                  }
                } catch (error) {
                  console.error(error);
                }
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <FormInput
                style={[styles.input, {marginTop: -20}]}
                iconName="person-outline"
                name="Username"
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                textEntry={false}
              />
            )}
            name="username"
          />

          <ErrorMessage
            error={errors?.username}
            message={errors?.username?.message}
          />

          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'This is required.'},
              pattern: {
                value: /\S+@\S+\.\S+$/,
                message: 'Not valid email.',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <FormInput
                style={styles.input}
                iconName="email-outline"
                name="Email"
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                textEntry={false}
              />
            )}
            name="email"
          />

          <ErrorMessage error={errors?.email} message={errors?.email?.message} />

          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'This field cannot be empty'},
              pattern: {
                /**
                 *  Password criteria
                 *  Minimum length 8 , atlease 1 digit
                 *  Atleast 1 upper case of lower case character
                 */
                value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
                message: 'Min 8 characters, uppercase & number',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Layout style={styles.passwordWrap}>
                <FormInput
                  style={styles.passwordInput}
                  iconName="lock-outline"
                  name="Password"
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  textEntry={shown}
                />
                <PasswordButton onPress={togglePassword} iconName={shown? "eye-outline" : "eye-off-2-outline"} style={styles.passwordBtn}></PasswordButton>
              </Layout>
            )}
            name="password"
          />

          <ErrorMessage
            error={errors?.password}
            message={errors?.password?.message}
          />

          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'This field cannot be empty'},
              validate: (value) => {
                const {password} = getValues();
                if (value === password) {
                  return true;
                } else {
                  return 'Passwords do not match.';
                }
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Layout style={styles.passwordWrap}>
                <FormInput
                style={styles.passwordInput}
                iconName="lock-outline"
                name="Confirm password"
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                textEntry={confirmShown}
                />
                <PasswordButton onPress={toggleConfirm} iconName={confirmShown? "eye-outline" : "eye-off-2-outline"} style={styles.passwordBtn}></PasswordButton>
              </Layout>
            )}
            name="confirmPassword"
          />

          <ErrorMessage
            error={errors?.confirmPassword}
            message={errors?.confirmPassword?.message}
          />

          <CheckBox
            style={styles.checkBox}
            checked={checked}
            onChange={(nextChecked) => setChecked(nextChecked)}
          >
            <Text style={styles.Terms} onPress={() => setVisible(true)}>
              I accept Terms and Condition
            </Text>
            <Modal
              visible={visible}
              backdropStyle={styles.backdrop}
              onBackdropPress={() => setVisible(false)}
            >
              <Card style={styles.modalLandscape} disabled={true}>
                <ScrollView>
                  <Text style={styles.text}>
                    This agreement is between you the [“User” or “you”] and
                    PreOwned [“we or us or our”] If you do not agree with all of
                    the provisions of this agreement, you cannot use the Services.
                  </Text>
                  <Text style={styles.text}>
                    To remove any doubt, in the event of any conflict or
                    discrepancy between these Terms and conditions and any other
                    provisions and/or terms and/or otherwise between PreOwned and
                    you, the provisions and the terms of these Terms of Use will
                    prevail. Please feel free to contact us with any questions
                    regarding the content of this agreement.
                  </Text>
                  <Text style={styles.text}>
                    - Seller: those who upload their second hand product on our
                    portal in order to sell it.
                  </Text>
                  <Text style={styles.text}>
                    - Buyers: those who visit the portal in order to consult and
                    buy certain second-hand products.
                  </Text>
                  <Text style={styles.text}>
                    Sellers and Buyers users will be identified in the rest of
                    this legal document with the word “User/s”. PreOwned reserves
                    the right to update the Terms and Conditions at any time
                    without notice to the user.
                  </Text>
                  <Text style={styles.text}>
                    This document represents the full and final agreement of the
                    parties regarding these Terms and Conditions. In particular,
                    it contains each and every legal and usage clause that the
                    user must comply with during the entire period of use of our
                    services.
                  </Text>
                  <Button
                    style={styles.dismissBtnLandscape}
                    onPress={() => setVisible(false)}
                  >
                    DISMISS
                  </Button>
                </ScrollView>
              </Card>
            </Modal>
          </CheckBox>

          <FormButton
            style={styles.button}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            text="Sign Up"
          />
        </Layout>
      </KeyboardAwareScrollView>
    );
  };
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.background,
  },
  button: {
    top: '-2%',
    bottom: 30,
  },
  passwordWrap: {
    marginTop: 10,
    backgroundColor: colors.primary,
  },
  passwordInput: {
    marginBottom: 0,
  },
  input: {
    marginTop: 10,
  },
  checkBox: {
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 10,
  },
  dismissBtn: {
    marginTop: 20,
    borderRadius: 15,
  },
  passwordBtn: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 15,
    height: 20,
  },
  modal: {
    marginTop: Platform.OS === 'android' ? '20%' : '25%',
    borderRadius: 15,
    marginVertical: '5%',
    backgroundColor: colors.primary,
  },
  layout: {
    marginTop: '15%',
    height: '100%',
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    bottom: 20,
  },
  Terms: {
    textAlign: 'left',
    fontFamily: 'Karla_700Bold',
  },
  text: {
    lineHeight: 21,
    padding: 5,
    fontWeight: '500',
    fontSize: 14,
    fontFamily: 'Karla',
  },
  textWelcome: {
    textAlign: 'center',
    fontFamily: 'Karla',
    fontSize: 16,
    paddingHorizontal: 10,
    marginBottom: -30,
  },
  titleRegister: {
    textAlign: 'center',
    fontFamily: 'Karla_700Bold',
  },
  textContainer: {
    backgroundColor: 'transparent',
    marginTop: '10%',
    marginBottom: '12%',
  },
  layoutLandscape: {
    marginTop: 5,
    height: '100%',
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  textContainerLandscape: {
    backgroundColor: 'transparent',
    marginBottom: '12%',
  },
  textWelcomeLandscape: {
    textAlign: 'center',
    fontFamily: 'Karla',
    fontSize: 16,
  },
  modalLandscape: {
    height: 400,
    marginHorizontal: 50,
    borderRadius: 15,
    backgroundColor: colors.primary,
  },
  dismissBtnLandscape: {
    alignSelf: 'center',
    width: 300,
    marginTop: 10,
    borderRadius: 15,
  },
});

SignupForm.propTypes = {
  setFormToggle: PropTypes.func,
};

export default SignupForm;
