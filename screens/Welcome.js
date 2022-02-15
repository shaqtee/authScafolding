import React, { useContext, useState } from 'react';
import {
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledButton,
  ButtonText,
  Line,
  WelcomeContainer,
  Avatar,
  WelcomeImage,
} from '../components/style';
import { StatusBar } from 'expo-status-bar';
import { CredentialsContext } from '../components/CredentialsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Welcome = ({ navigation, route }) => {
  const [hidePassword, setHidePassword] = useState(true);
  //const { fullname, email } = route.params[0];
  //console.log(route.params);
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
  const { fullname, email } = storedCredentials[0] || { fullname: '', email: '' };
  //console.log(storedCredentials[0]);

  const clearLogin = async () => {
    await AsyncStorage.removeItem('MyAppCredentials')
      .then(() => {
        setStoredCredentials('');
      })
      .catch((error) => console.log(error));
  };

  const checkAsyncKey = async () => {
    let arr = {};
    try {
      arr = { key: await AsyncStorage.getAllKeys() };
      console.log(arr);
    } catch (error) {}
  };
  console.log(checkAsyncKey());

  return (
    <>
      <StatusBar style="light" />
      <InnerContainer>
        <WelcomeImage resizeMode="cover" source={require('../assets/img/img3.png')} />
        <WelcomeContainer>
          <PageTitle welcome={true}>Welcome! {fullname || 'none'}</PageTitle>
          <SubTitle welcome={true}>{email || 'none'}</SubTitle>
          <StyledFormArea>
            <Avatar resizeMode="cover" source={require('../assets/img/img1.png')} />
            <Line />
            <StyledButton onPress={clearLogin}>
              <ButtonText>Logout</ButtonText>
            </StyledButton>
          </StyledFormArea>
        </WelcomeContainer>
      </InnerContainer>
    </>
  );
};

export default Welcome;
