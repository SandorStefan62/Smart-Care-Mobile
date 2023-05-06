import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

function LoginPage( {navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
  
    const handleSubmit = async () => {
      try {
        const response = await fetch('http://192.168.1.229:3000/api/login', {
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
          // Navigate to home pagey
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
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
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
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        {error && <Text style={styles.error}>{error}</Text>}
        <Text>Don't have an saccount? <Text style={styles.link}>Sign up</Text></Text>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      padding: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
    },
    button: {
      backgroundColor: '#0084ff',
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
  