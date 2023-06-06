import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MessagePage from './MessagePage';
import LoginPage from './LoginPage';
import IstoricCitiriPage from './IstoricCitiri';
import CitiriMedicalePage from './CitiriMedicale';

const Stack = createStackNavigator();

const HomePage = ({ navigation }) => {
  const tableData = [
    { key: 'Citiri medicale', component: CitiriMedicalePage },
    { key: 'Istoric citiri', component: IstoricCitiriPage },
    { key: 'Mesaje', component: MessagePage },
    { key: 'Log Out', component: LoginPage }
  ];

  const logout = async () => {
    try {
      // Remove JWT token from local storage
      await AsyncStorage.removeItem('token');
      // Navigate to login page
      navigation.navigate('Login');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <FlatList
          data={tableData}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (item.key === 'Log Out') {
                  logout();
                } else {
                  navigation.navigate(item.component.name);
                }
              }}>
              <Text style={styles.buttonText}>{item.key}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
};

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1F28',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1E1F28',
  },
  button: {
    backgroundColor: '#5C5EDD',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    width: windowWidth - 40,
    maxWidth: 400,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  list: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomePage;
