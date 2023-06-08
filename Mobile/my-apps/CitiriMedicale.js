import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function CitiriMedicale({ navigation }) {
  const [tensiune, setTensiune] = useState('');
  const [greutate, setGreutate] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [glicemie, setGlicemie] = useState('');
  const [idColectiePacient, setIdColectiePacient] = useState('');
  const [idPacient, setIdPacient] = useState('');
  const [acc, setAcc] = useState('');
  const [dateIngrijitor, setDateIngrijitor] = useState({});

  // useEffect(() => {

  // }, []);

  const getIngrijitor = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch("https://server-ip2023.herokuapp.com/api/get-ingrijitor", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json();
      //console.log(data);
      setDateIngrijitor(data.data);
      setIdPacient(data.data.id_pacient);
    } catch (error) {
      console.error("eroare ingrijitor");
    }
  }

  const verifyToken = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch("https://server-ip2023.herokuapp.com/api/verifytoken", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.ok) {
        console.log("OK");
        const data = await response.json();
        //console.log(data);
        if (data.data.id_pacient) {
          setIdPacient(data.data.id_pacient);
          setAcc('Pacient');
        } else {

          setAcc('Ingrijitor');
        }

      } else {
        console.log("NOK");
      }
    } catch (error) {
      console.error(error);
    }
  }

  verifyToken();

  if (acc !== 'pacient') {
    getIngrijitor();
  }

  const getIdColectie = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`https://server-ip2023.herokuapp.com/api/get-pacient-details/${idPacient}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.ok) {
        console.log("OK");
        const data = await response.json();
        console.log(data);
        setIdColectiePacient(data.data.id_colectie);
      } else {
        console.log("NOK");
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
    }
  }

  getIdColectie();

  const handleSubmit = async () => {

    try {
      // Validate the input data
      if (!tensiune || !greutate || !temperatura || !glicemie) {
        throw new Error('All fields are required');
      }

      // Check if the tensiune field contains a slash ("/")
      // if (!tensiune.includes('/')) {
      //   throw new Error('Invalid format for Tensiune. Use the format "120/80".');
      // }

      // Parse and validate greutate
      const parsedGreutate = parseFloat(greutate);
      if (isNaN(parsedGreutate)) {
        throw new Error('Invalid value for Greutate. Please enter a numeric value.');
      }

      // Parse and validate temperatura
      const parsedTemperatura = parseFloat(temperatura);
      if (isNaN(parsedTemperatura)) {
        throw new Error('Invalid value for Temperatura. Please enter a numeric value.');
      }

      // Parse and validate glicemie
      const parsedGlicemie = parseFloat(glicemie);
      if (isNaN(parsedGlicemie)) {
        throw new Error('Invalid value for Glicemie. Please enter a numeric value.');
      }

      // Get the current date and time
      const currentDate = new Date();
      const timestamp = currentDate.toISOString();
      const token = await AsyncStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const data = {
        TA: tensiune,
        greutate: parsedGreutate,
        temp_corp: parsedTemperatura,
        glicemie: parsedGlicemie,
        //timestamp: timestamp,
      };
      const localData = {
        tensiune: tensiune,
        greutate: parsedGlicemie,
        temperatura: parsedTemperatura,
        glicemie: parsedGlicemie,
        timestamp: timestamp
      }
      const response = await axios.put(`https://server-ip2023.herokuapp.com/api/update-date-colectate/${idColectiePacient}`, data, config);
      const localResponse = await axios.post(`http://192.168.133.117:3000/api/medical-readings`, localData, config);
      console.log('Success:', response);
      console.log('Success:', localResponse);
      // You could also navigate to a different page or display a success message

    } catch (error) {
      console.error('Error:', error);
      // Display an error message to the user
      Alert.alert('Error', error.message);
    }

    navigation.goBack();
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adauga citiri medicale</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="heart-pulse" size={24} color="#FFFFFF" />
        <Text style={styles.label}>Tensiune:</Text>
        <TextInput
          style={styles.input}
          value={tensiune}
          onChangeText={setTensiune}
          keyboardType="default"
          placeholder="e.g. 120/80"
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="weight-kilogram" size={24} color="#FFFFFF" />
        <Text style={styles.label}>Greutate:</Text>
        <TextInput
          style={styles.input}
          value={greutate}
          onChangeText={setGreutate}
          keyboardType="decimal-pad"
          placeholder="e.g. 75.5"
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="thermometer" size={24} color="#FFFFFF" />
        <Text style={styles.label}>Temperatura:</Text>
        <TextInput
          style={styles.input}
          value={temperatura}
          onChangeText={setTemperatura}
          keyboardType="decimal-pad"
          placeholder="e.g. 36.5"
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="blood-bag" size={24} color="#FFFFFF" />
        <Text style={styles.label}>Glicemie:</Text>
        <TextInput
          style={styles.input}
          value={glicemie}
          onChangeText={setGlicemie}
          keyboardType="decimal-pad"
          placeholder="e.g. 120"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Adauga</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={goBack}>
        <Text style={styles.buttonText}>Inapoi</Text>
      </TouchableOpacity>
    </View>
  );
}


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


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
