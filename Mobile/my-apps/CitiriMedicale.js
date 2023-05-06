import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

function CitiriMedicalePage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    setMessages([...messages, message]);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Citiri medicale page</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message here..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
      <View style={styles.messageContainer}>
        {messages.map((message, index) => (
          <Text key={index} style={styles.message}>
            {message}
          </Text>
        ))}
      </View>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  messageContainer: {
    marginTop: 20,
  },
  message: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default CitiriMedicalePage;
