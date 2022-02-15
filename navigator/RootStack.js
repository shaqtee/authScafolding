import React from 'react';
import { Color } from '../components/style';

/* react navigation */
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

/* screen */
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Welcome from '../screens/Welcome';

/* asyncStorage */
import { CredentialsContext } from '../components/CredentialsContext';

const Stack = createStackNavigator();

const RootStack = () => {
  return (
    <CredentialsContext.Consumer>
      {function ({ storedCredentials }) {
        //console.log(storedCredentials);
        return (
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: 'transparent',
                },
                headerTintColor: Color.tertiary,
                headerTransparent: true,
                headerTitle: '',
              }}
              initialRouteName="Login"
            >
              {storedCredentials ? (
                <Stack.Screen options={{ headerTintColor: Color.primary }} name="Welcome" component={Welcome} />
              ) : (
                <>
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="Signup" component={Signup} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        );
      }}
    </CredentialsContext.Consumer>
  );
};

export default RootStack;
