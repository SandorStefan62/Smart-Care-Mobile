import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './LoginPage';
import Home from "./Home"
import CitiriMedicalePage from './CitiriMedicale';
import MessagePage from './MessagePage';
import IstoricCitiriPage from './IstoricCitiri';
import ChangePassPage from './ChangePassPage';
import AlarmPage from './AlarmPage';
import RecomandariPage from './RecomandariPage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: null }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: null }} />
        <Stack.Screen name="CitiriMedicale" component={CitiriMedicalePage} options={{ headerShown: null }} />
        <Stack.Screen name="IstoricCitiri" component={IstoricCitiriPage} options={{ headerShown: null }} />
        <Stack.Screen name="ChangePassPage" component={ChangePassPage} options={{ headerShown: null }} />
        <Stack.Screen name="AlarmPage" component={AlarmPage} options={{ headerShown: null }} />
        <Stack.Screen name="RecomandariPage" component={RecomandariPage} options={{ headerShown: null }} />
        {/* add other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

