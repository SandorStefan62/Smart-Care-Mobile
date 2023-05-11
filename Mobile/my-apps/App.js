import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './LoginPage';
import Home from "./Home"

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: null }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: null }} />
        {/* add other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

