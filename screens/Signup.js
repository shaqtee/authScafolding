import React, { useState } from 'react';
import {
  StyledContainer,
  InnerContainer,
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
import { View, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';

import { Formik } from 'formik';
import { Octicons, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

/* asyncStorage */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../components/CredentialsContext';

const Signup = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));

  //API to php server
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  /* asyncStorage */
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

  //actual date of birth to be sent
  let [dob, setDob] = useState();

  const onChange = (event, selectedDate) => {
    //console.log(date + 1);
    let currentDate = selectedDate || date;
    console.log(selectedDate, date);
    setShow(false);
    setDate(currentDate);
    setDob(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  //API to php server
  const handleSignup = async (credentials, setSubmitting) => {
    handleMessage(null);
    console.log(credentials);

    try {
      await fetch('http://192.168.0.11/adi_API/auth.php?op=signup', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'data=' + JSON.stringify(credentials),
      })
        .then((result) => result.json())
        .then((result) => {
          console.log(result);
          if (result.status === 'notUnique') {
            handleMessage('Email has been used, fill another email');
          } else if (result.status === 'success') {
            let data = result.data;
            //navigation.navigate('Welcome', { ...data });
            persistLogin({ ...data });
            setSubmitting(false);
          }
          setSubmitting(false);
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
          <PageTitle>بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ</PageTitle>
          <SubTitle>Account Signup</SubTitle>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}

          <Formik
            initialValues={{ fullName: '', email: '', dateOfBirth: '', password: '', confirmPassword: '' }}
            onSubmit={(values, { setSubmitting }) => {
              values = { ...values, dateOfBirth: dob };

              //navigation.navigate('Welcome');
              if (
                values.fullName == '' ||
                values.email == '' ||
                values.dateOfBirth == '' ||
                values.password == '' ||
                values.confirmPassword == ''
              ) {
                handleMessage('Please fill all the fields');
                setSubmitting(false);
              } else if (values.password !== values.confirmPassword) {
                handleMessage('Password & its confirm dont match');
                setSubmitting(false);
              } else {
                handleSignup(values, setSubmitting);
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
              <StyledFormArea>
                <MyTextInput
                  label="Full Name"
                  icon="person"
                  placeholder="Abdulbadi"
                  placeholderTextColor={Color.darkLight}
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  value={values.fullName}
                />

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
                  label="Date of birth"
                  icon="calendar"
                  placeholder="YYYY - MM - DD"
                  placeholderTextColor={Color.darkLight}
                  onChangeText={handleChange('dateOfBirth')}
                  onBlur={handleBlur('dateOfBirth')}
                  value={dob ? dob.toDateString() : ''}
                  isDate={true}
                  editable={false}
                  showDatePicker={showDatePicker}
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

                <MyTextInput
                  label="Confirm Password"
                  icon="lock"
                  placeholder="************"
                  placeholderTextColor={Color.darkLight}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />

                <MsgBox type={messageType}>{message}</MsgBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Signup</ButtonText>
                  </StyledButton>
                )}

                {isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator size="large" color={Color.primary} />
                  </StyledButton>
                )}

                <Line />

                <ExtraView>
                  <ExtraText>Already have an account?</ExtraText>

                  <TextLink onPress={() => navigation.navigate('Login')}>
                    <TextLinkContent>Login</TextLinkContent>
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

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, isDate, showDatePicker, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} color={Color.brand} size={30} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      {!isDate && <StyledTextInput {...props} />}
      {isDate && (
        <TouchableOpacity onPress={showDatePicker}>
          <StyledTextInput {...props} />
        </TouchableOpacity>
      )}
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} color={Color.darkLight} size={30} />
        </RightIcon>
      )}
    </View>
  );
};

export default Signup;
