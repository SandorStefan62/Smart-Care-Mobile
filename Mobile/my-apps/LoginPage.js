import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

function LoginPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://192.168.1.102:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.status === 200) {
        // Successful login
        setError(null);
        // Store JWT token in local storage
        await AsyncStorage.setItem('token', data.token);
        // Navigate to home page
        navigation.navigate('Home');
      } else if (response.status === 401) {
        // Incorrect username or password
        setError('Incorrect email or password');
      } else {
        // Other error
        setError('Something went wrong');
      }
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.middleContainer}>
        <View style={styles.header}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Smart-Care</Text>
          </View>
        </View>
        <View style={styles.body}>
          {/* <Text style={styles.title}>Login</Text> */}
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCompleteType="email"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCompleteType="password"
          />
          <View style={styles.buffer}></View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          {/* {error && <Text style={styles.error}>{error}</Text>}
          <Text>Don't have an saccount? <Text style={styles.link}>Sign up</Text></Text> */}
        </View>
      </View>
    </View>
  );
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0B2447'
  },
  middleContainer: {
    height: windowHeight * 0.7,
    width: windowWidth * 0.8,
    borderRadius: 10,
    backgroundColor: '#576CBC'
  },
  header: {
    height: '15%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#19376D',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerContainer: {
    height: '50%',
    width: '92%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A5D7E8'
  },
  headerText: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white'
  },
  body: {
    flex: 1,
    height: '85%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  buffer: {
    height: '30%'
  },
  button: {
    width: '50%',
    backgroundColor: '#19376D',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  link: {
    color: '#0084ff',
  },
});

export default LoginPage;
