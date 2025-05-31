import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

export default function EditReservation() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [token, setToken] = useState('');
  const [date, setDate] = useState(new Date());
  const [people, setPeople] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const loadTokenAndFetch = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken || '');

      try {
        const res = await fetch(`http://192.168.1.193:3000/api/user/reservations`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        const data = await res.json();
        const currentReservation = data.find((r: any) => r.reservation_id === Number(id));
        if (currentReservation) {
          const fullDate = new Date(`${currentReservation.date}T${currentReservation.time}`);
          setDate(fullDate);
          setPeople(currentReservation.people_count.toString());
        } else {
          Alert.alert('Reservation not found.');
          router.back();
        }
      } catch (error) {
        console.error('Fetch error:', error);
        Alert.alert('Failed to load reservation');
      }
    };

    loadTokenAndFetch();
  }, []);

  const handleUpdate = async () => {
    const selectedDate = date.toISOString().split('T')[0];
    const selectedTime = date.toTimeString().split(':').slice(0, 2).join(':');
    const numberOfPeople = Number(people);

    if (!selectedDate || !selectedTime || !numberOfPeople) {
      Alert.alert('All fields are required');
      return;
    }

    try {
      const res = await fetch(`http://192.168.1.193:3000/api/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          people_count: numberOfPeople,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        Alert.alert('Reservation updated successfully!');
        router.replace('/(tabs)/MyReservations');
      } else {
        Alert.alert(result.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Network error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Reservation</Text>

      <Text style={styles.label}>Date:</Text>
      <Button title={date.toDateString()} onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Time:</Text>
      <Button title={date.toTimeString().slice(0, 5)} onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setDate(selectedTime);
          }}
        />
      )}

      <Text style={styles.label}>Number of People:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 2"
        keyboardType="numeric"
        value={people}
        onChangeText={setPeople}
      />

      <Button title="Update Reservation" onPress={handleUpdate} color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 24, textAlign: 'center', fontWeight: 'bold' },
  label: { fontSize: 16, marginTop: 20, marginBottom: 8 },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
  },
});
