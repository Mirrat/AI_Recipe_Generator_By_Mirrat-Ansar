import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, ImageBackground } from 'react-native';
import StarRating from './StarRating'; 

export default function RecipeDetailScreen({ route }) {
  const { recipe } = route.params;
  const [rating, setRating] = useState(0);

  // star to rate the recipe
  const handleRate = (star) => {
    setRating(star);
   
  };

  return (
    <ImageBackground
      source={require('../assets/salt.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.overlay}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.count}>
          Requires {recipe.extra_count} extra ingredients:
        </Text>

        {recipe.extra_ingredients && recipe.extra_ingredients.length > 0 ? (
          recipe.extra_ingredients.map((ing, idx) => (
            <Text key={idx} style={styles.ingredient}>
              - {ing}
            </Text>
          ))
        ) : (
          <Text style={styles.ingredient}>No extra ingredients found.</Text>
        )}

        <Text style={styles.instructions}>{recipe.instructions}</Text>

        <Text style={styles.ratingTitle}>Rate this recipe:</Text>
        <StarRating rating={rating} onRate={handleRate} />
        <Text style={styles.currentRating}>Your rating: {rating} out of 5</Text>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  
  overlay: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'rgba(33, 33, 33, 0.8)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',           
  },
  count: {
    fontSize: 16,
    marginBottom: 5,
    color: '#fff',           
  },
  ingredient: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 2,
    color: '#fff',           
  },
  instructions: {
    marginTop: 15,
    fontStyle: 'italic',
    fontSize: 16,
    color: '#fff',           
  },
  ratingTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',       
  },
  currentRating: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',           
  },
});
