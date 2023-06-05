import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';

axios.defaults.baseURL = 'http://192.168.1.229:3000';

function MessagePage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    try {
      const response = await axios.post('/api/login', {
        email: 'user1@example.com',
        password: 'password1',
      });
      const { token } = response.data;
      setToken(token);
      console.log(token);
      setError(null);
      fetchMessageHistory(token);
      console.log(token);
    } catch (error) {
      console.error('Failed to fetch token:', error.message);
      setError('Failed to fetch token. Please try again later.');
    }
  };

  const fetchMessageHistory = async () => {
    try {
      if (!token) {
        setError('Token not found. Please login again.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('/api/messages', config);
      setMessages(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch message history:', error.message);
      setError('Failed to fetch message history. Please try again later.');
    }
  };

  const sendMessage = async () => {
    try {
      if (!token) {
        setError('Token not found. Please login again.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const sender = 'user1@example.com';
      const recipient = 'user2@example.com';
      await axios.post('/api/messages', { sender, recipient, content: newMessage }, config);
      fetchMessageHistory();
      setNewMessage('');
      setError(null);
    } catch (error) {
      console.error('Failed to send message:', error.message);
      console.log(token);
      setError('Failed to send message. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.messageContainer}>
        {messages.map((message) => (
          <Text key={message.id} style={styles.messageText}>
            {message.content}
          </Text>
        ))}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
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
  error: {
    color: 'red',
    marginBottom: 10,
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  messageText: {
    fontSize: 18,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MessagePage;
