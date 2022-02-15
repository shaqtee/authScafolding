import React, { useState, useContext } from 'react';
import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledTextInput,
  StyledInputLabel,
  LeftIcon,
  RightIcon,
  StyledButton,
  ButtonText,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
  Color,
} from '../components/style';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';

import { Formik } from 'formik';
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';
import Constants from 'expo-constants';

import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import axios from 'axios';

/* asyncStorage */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../components/CredentialsContext';

const Login = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
  //console.log(useContext(CredentialsContext));

  const handleLogin = async (credentials, setSubmitting) => {
    handleMessage(null);
    //console.log(credentials.email, credentials.password);

    try {
      await fetch('http://192.168.0.11/adi_API/auth.php?op=view', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'name=' + credentials.email + '&password=' + credentials.password,
      })
        .then((result) => result.json())
        .then((result) => {
          //console.log(result);
          if (result.status === 'success') {
            let data = result.data;
            //console.log(data);
            //navigation.navigate('Welcome', { ...data });
            persistLogin({ ...data });
            setSubmitting(false);
          } else if (result.status === 'failed') {
            handleMessage('Make sure your username & password is correct.');
            setSubmitting(false);
          }
        })
        .catch((error) => {
          setSubmitting(false);
          handleMessage('An error occured. Check your network and try again');
        });
    } catch (error) {
      console.log(error);
      setSubmitting(false);
    }
  };

  const handleMessage = (message, type = 'Failed') => {
    setMessage(message);
    setMessageType(type);
  };

  const persistLogin = (credentials, message = '', status = '') => {
    AsyncStorage.setItem('MyAppCredentials', JSON.stringify(credentials))
      .then(() => {
        handleMessage(message, status);
        setStoredCredentials(credentials);
      })
      .catch((error) => {
        console.log(error);
        handleMessage('Persisting login failed');
      });
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer style={{ marginTop: 40 }}>
        <StatusBar style="light" backgroundColor={Color.brand} />
        <InnerContainer>
          <PageLogo resizeMode="contain" source={require('../assets/img/img1.png')} />
          <PageTitle>بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ</PageTitle>
          <SubTitle>Account Login</SubTitle>

          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={(values, { setSubmitting }) => {
              if (values.email == '' || values.password == '') {
                handleMessage('Please fill all the fields');
                setSubmitting(false);
              } else {
                handleLogin(values, setSubmitting);
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
              <StyledFormArea>
                <MyTextInput
                  label="Email Address"
                  icon="mail"
                  placeholder="shaqtee@gmail.com"
                  placeholderTextColor={Color.darkLight}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                />

                <MyTextInput
                  label="Password"
                  icon="lock"
                  placeholder="************"
                  placeholderTextColor={Color.darkLight}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />

                <MsgBox type={messageType}>{message}</MsgBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Login</ButtonText>
                  </StyledButton>
                )}

                {isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator size="large" color={Color.red} />
                  </StyledButton>
                )}

                <Line />

                <StyledButton google={true}>
                  <Fontisto name="google" color={Color.primary} size={25} />
                  <ButtonText google={true}>Sign in with Google</ButtonText>
                </StyledButton>

                <ExtraView>
                  <ExtraText>Don't have an account already?</ExtraText>

                  <TextLink onPress={() => navigation.navigate('Signup')}>
                    <TextLinkContent>Signup</TextLinkContent>
                  </TextLink>
                </ExtraView>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  //console.log(props);
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} color={Color.brand} size={30} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props}></StyledTextInput>
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} color={Color.darkLight} size={30} />
        </RightIcon>
      )}
    </View>
  );
};

export default Login;
