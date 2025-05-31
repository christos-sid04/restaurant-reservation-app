import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Restaurant = {
  restaurant_id: number;
  name: string;
  location: string;
  description: string;
};

export default function RestaurantListScreen() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://192.168.1.193:3000/api/restaurants');
        const data = await response.json();
        console.log('Restaurant data:', data);

        if (response.ok) {
          setRestaurants(data);
        } else {
          Alert.alert('Failed to fetch restaurants');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        Alert.alert('Could not connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽️ Restaurants</Text>

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.restaurant_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/reserve',
                params: { restaurantId: item.restaurant_id.toString() },
              })
            }
          >
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.address}>{item.location}</Text>
              <Text>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  card: { backgroundColor: '#f2f2f2', padding: 16, borderRadius: 10, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: 'bold' },
  address: { fontSize: 16, color: '#555' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
