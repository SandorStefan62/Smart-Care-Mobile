import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function LoginPage({ navigation }) {
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
        // Navigate to home page
        navigation.navigate('Home');
      } else if (response.status === 401) {
        setError('Email sau parola incorecta!');
      } else {
        setError('A intervenit o eroare. Va rugam sa incercati din nou.');
      }
    } catch (error) {
      console.error(error);
      setError('A intervenit o eroare. Va rugam sa verificati conexiunea la internet.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Autentificare</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="email-outline" size={24} color="#FFFFFF" />
        <Text style={styles.label}>Email:</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock-outline" size={24} color="#FFFFFF" />
        <Text style={styles.label}>Parola:</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry={true} />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Autentificare</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Inregistrare')}>
        <Text style={styles.buttonText}>Inregistrare</Text>
      </TouchableOpacity>
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
    backgroundColor: '#1E1F28',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3C3F4D',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: windowWidth - 40,
    maxWidth: 400,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 5,
    flexShrink: 1,
    },
    input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 5,
    },
    button: {
    backgroundColor: '#5C5EDD',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: windowWidth - 40,
    maxWidth: 400,
    },
    buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    },
    error: {
    color: '#FF6347',
    marginTop: 10,
    textAlign: 'center',
    },
    });
    
    export default LoginPage;