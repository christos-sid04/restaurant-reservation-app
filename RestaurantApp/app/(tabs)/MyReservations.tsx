import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const options = {
  tabBarLabel: 'My Reservations',
};

type Reservation = {
  reservation_id: number;
  restaurant_name: string;
  date: string;
  time: string;
  people_count: number;
};

export default function MyReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [token, setToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchReservations = async () => {
      const savedToken = await AsyncStorage.getItem('token');
      setToken(savedToken || '');

      try {
        const res = await fetch('http://192.168.1.193:3000/api/user/reservations', {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });
        const data: Reservation[] = await res.json();
        setReservations(data);
      } catch (err) {
        console.error('Fetch error:', err);
        Alert.alert('Could not load reservations');
      }
    };

    fetchReservations();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://192.168.1.193:3000/api/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setReservations(prev => prev.filter(r => r.reservation_id !== id));
        Alert.alert('Reservation deleted');
      } else {
        const errData = await res.json();
        Alert.alert(errData.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error deleting reservation');
    }
  };

  const renderItem = ({ item }: { item: Reservation }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.restaurant_name}</Text>
      <Text>{item.date} at {item.time}</Text>
      <Text>People: {item.people_count}</Text>
      <View style={styles.buttonGroup}>
        <View style={styles.button}>
          <Button
            title="Edit"
            color="#007AFF"
            onPress={() =>
              router.push({
                pathname: '/EditReservation',
                params: { id: item.reservation_id.toString() },
              })
            }
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Cancel"
            color="#FF3B30"
            onPress={() => handleDelete(item.reservation_id)}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Reservations</Text>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.reservation_id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: { flex: 1, marginHorizontal: 4 },
});
