import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './LoginPage';
import Home from "./Home"
import CitiriMedicalePage from './CitiriMedicale';
import MessagePage from './MessagePage';
import IstoricCitiriPage from './IstoricCitiri';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: null }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: null }} />
        <Stack.Screen name="CitiriMedicale" component={CitiriMedicalePage} options={{ headerShown: null }} />
        <Stack.Screen name="MessagePage" component={MessagePage} options={{ headerShown: null }} />
        <Stack.Screen name="IstoricCitiri" component={IstoricCitiriPage} options={{ headerShown: null }} />
        {/* add other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

