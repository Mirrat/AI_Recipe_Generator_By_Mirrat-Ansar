import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function StarRating({ rating, onRate }) {
  // shows 5 star rating option
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.starContainer}>
      {stars.map((star) => (
        <TouchableOpacity key={star} onPress={() => onRate(star)}>
          <Text style={styles.star}>
            {star <= rating ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  starContainer: { flexDirection: 'row' },
  star: { fontSize: 24, marginHorizontal: 5, color: '#FFD700' }, // Gold color stars
});
