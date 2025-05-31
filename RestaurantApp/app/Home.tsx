import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/login' as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Restaurant App! 🍽️</Text>

      <Button title="View Restaurants" onPress={() => router.push('/(tabs)/restaurants' as never)} />
      <View style={styles.spacer} />
      <Button title="My Reservations" onPress={() => router.push('/(tabs)/MyReservations' as never)} />
      <View style={styles.spacer} />
      <Button title="Log Out" color="#FF3B30" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
  spacer: { height: 20 },
});
