import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Button,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.193:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('✅ Registered successfully!');
        router.replace('/Home');
      } else {
        Alert.alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Error connecting to server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Register" onPress={handleRegister} color="#28a745" />
      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, marginBottom: 24, textAlign: 'center', fontWeight: 'bold' },
  input: { backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, marginBottom: 16, borderColor: '#ccc', borderWidth: 1 },
  link: { marginTop: 20, color: '#007AFF', textAlign: 'center', textDecorationLine: 'underline' },
});
