import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'; // import AsyncStorage
import { MaterialCommunityIcons } from '@expo/vector-icons';

function CitiriMedicale({ onBack }) {
  const [tensiune, setTensiune] = useState('');
  const [greutate, setGreutate] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [glicemie, setGlicemie] = useState('');

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // use AsyncStorage instead of localStorage
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const data = { tensiune, greutate, temperatura, glicemie };
      const response = await axios.post('/api/medical-readings', data, config);
      console.log('Success:', response);
      // You could also navigate to a different page or display a success message
    } catch (error) {
      console.error('Error:', error);
      // You could display an error message to the user
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adauga citiri medicale</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="heart-pulse" size={24} color="#FFFFFF" />
        <Text style={styles.label}>Tensiune:</Text>
        <TextInput style={styles.input} value={tensiune} onChangeText={setTensiune} keyboardType="numeric" />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="weight" size={24} color="#FFFFFF" />
        <Text style={styles.label}>Greutate:</Text>
        <TextInput style={styles.input} value={greutate} onChangeText={setGreutate} keyboardType="numeric" />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="thermometer" size={24} color="#FFFFFF" />
        <Text style={styles.label}>Temperatura:</Text>
        <TextInput style={styles.input} value={temperatura} onChangeText={setTemperatura} keyboardType="numeric" />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="test-tube" size={24} color="#FFFFFF" />
        <Text style={styles.label}>Glicemie:</Text>
        <TextInput style={styles.input} value={glicemie} onChangeText={setGlicemie} keyboardType="numeric" />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Trimite</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onBack}>
        <Text style={styles.buttonText}>Inapoi</Text>
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
    flex: 1,
    },
    input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 5,
    flex: 1.5,
    height: 40,
    marginLeft: 10,
    },
    button: {
    backgroundColor: '#5C5EDD',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: windowWidth - 40,
    maxWidth: 400,
    },
    buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    },
    });
    
    export default CitiriMedicale;
