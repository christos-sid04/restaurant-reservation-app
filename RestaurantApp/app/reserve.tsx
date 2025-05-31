import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function ReservationScreen() {
  const { restaurantId } = useLocalSearchParams();
  const [token, setToken] = useState('');

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [people, setPeople] = useState('');

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem('token');
      setToken(savedToken || '');
    };
    loadToken();
  }, []);

  const handleReserve = async () => {
    const selectedDate = date.toISOString().split('T')[0];
    const selectedTime = date.toTimeString().split(':').slice(0, 2).join(':');
    const numberOfPeople = Number(people);

    if (!restaurantId || !selectedDate || !selectedTime || !people || isNaN(numberOfPeople)) {
      Alert.alert('Please fill in all fields correctly');
      return;
    }

    console.log('Submitting reservation:', {
      restaurant_id: Number(restaurantId),
      date: selectedDate,
      time: selectedTime,
      people_count: numberOfPeople,
    });

    try {
      const response = await fetch('http://192.168.1.193:3000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurant_id: Number(restaurantId),
          date: selectedDate,
          time: selectedTime,
          people_count: numberOfPeople, // ✅ fixed
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('✅ Reservation confirmed!');
      } else {
        Alert.alert(data.message || 'Reservation failed');
      }
    } catch (error) {
      console.error('Reservation error:', error);
      Alert.alert('Could not connect to server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reserve at Restaurant #{restaurantId}</Text>

      <Text style={styles.label}>Select Date:</Text>
      <Button title={date.toDateString()} onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selected) => {
            setShowDatePicker(false);
            if (selected) setDate(selected);
          }}
        />
      )}

      <Text style={styles.label}>Select Time:</Text>
      <Button title={date.toTimeString().slice(0, 5)} onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selected) => {
            setShowTimePicker(false);
            if (selected) setDate(selected);
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

      <Button title="Confirm Reservation" onPress={handleReserve} color="#007AFF" />
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
