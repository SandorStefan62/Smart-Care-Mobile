import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

function IstoricCitiri() {
  const [readings, setReadings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    try {
      const response = await axios.get('http://192.168.1.102:3000/api/medical-readings');
      if (response.status === 200) {
        setReadings(response.data);
        setError(null);
      } else {
        setError('Failed to fetch readings');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch readings');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };


  const renderReadingItem = ({ item }) => {
    const formattedTimestamp = formatTimestamp(item.timestamp);

    return (
      <TouchableOpacity style={styles.readingItem}>
        <Text style={styles.date}>{formattedTimestamp}</Text>
        <View style={styles.readingData}>
          <Text style={styles.readingText}>Tensiune: {item.tensiune}</Text>
          <Text style={styles.readingText}>Greutate: {item.greutate}</Text>
          <Text style={styles.readingText}>Temperatura: {item.temperatura}</Text>
          <Text style={styles.readingText}>Glicemie: {item.glicemie}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Istoric Citiri</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={readings}
          renderItem={renderReadingItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1F28',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  list: {
    width: '100%',
    marginTop: 20,
  },
  readingItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#3C3F4D',
    borderRadius: 10,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  readingData: {
    marginTop: 10,
  },
  readingText: {
    color: '#FFFFFF',
  },
  error: {
    color: '#FF0000',
    marginTop: 20,
  },
});

export default IstoricCitiri;
