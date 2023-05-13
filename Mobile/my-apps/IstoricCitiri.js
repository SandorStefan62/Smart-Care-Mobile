import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function IstoricCitiriPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Istoric Citiri page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default IstoricCitiriPage;