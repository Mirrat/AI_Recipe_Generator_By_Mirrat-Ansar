import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';

export default function RecipeScreen({ navigation }) {
  const [ingredients, setIngredients] = useState('');
  const [excludeFilter, setExcludeFilter] = useState('');
  const [results, setResults] = useState(null);

  // Local IP and port
  const FLASK_URL = 'http://192.168.1.36:5000/api/recipes';

  const fetchRecipes = async () => {
    try {
      const response = await fetch(FLASK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `ingredients=${encodeURIComponent(ingredients)}`,
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  // Filtering recipes based on exclusion 
  const filteredRecipes =
    results && results.recipes
      ? results.recipes.filter((recipe) => {
          if (!excludeFilter.trim()) return true;
          const exclusions = excludeFilter.split(',').map((ex) => ex.trim().toLowerCase());
          const extraStr = recipe.extra_ingredients
            ? recipe.extra_ingredients.join(' ').toLowerCase()
            : '';
          return !exclusions.some((ex) => extraStr.includes(ex));
        })
      : [];

  return (
    <ImageBackground
      source={require('../assets/tomato.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        
        <View style={styles.topContainer}>
          <View style={styles.inputBox}>
            <Text style={styles.title}>Recipe Finder</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter ingredients, e.g. bread,butter,cheese"
              value={ingredients}
              onChangeText={setIngredients}
            />
            <TextInput
              style={styles.input}
              placeholder="Dietary Exclusions (e.g., sugar, oil)"
              value={excludeFilter}
              onChangeText={setExcludeFilter}
            />
            <Button title="Get Recipes" onPress={fetchRecipes} />
          </View>
        </View>

        
        <View style={styles.bottomContainer}>
          <ScrollView contentContainerStyle={styles.resultsScroll}>
            {results && (
              <View style={styles.results}>
                {filteredRecipes.length > 0 ? (
                  filteredRecipes.map((recipe, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.recipeItem}
                      onPress={() => navigation.navigate('RecipeDetail', { recipe })}
                    >
                      <Text style={styles.recipeTitle}>
                        {idx + 1}. {recipe.name} requires {recipe.extra_count} extra ingredients:
                      </Text>
                      {recipe.extra_ingredients && recipe.extra_ingredients.length > 0 ? (
                        recipe.extra_ingredients.map((ing, i) => (
                          <Text key={i} style={styles.extraIngredient}>
                            - {ing}
                          </Text>
                        ))
                      ) : (
                        <Text style={styles.extraIngredient}>No extra ingredients provided.</Text>
                      )}
                      <Text style={styles.instructions}>{recipe.instructions}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noRecipes}>No recipes match your filters.</Text>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  topContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {
    width: '90%',
    backgroundColor: 'rgba(30, 29, 29, 0.9)', 
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  bottomContainer: {
    flex: 1.3,
  },
  resultsScroll: {
    padding: 20,
  },
  results: {
    paddingBottom: 40,
  },
  recipeItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  recipeTitle: { fontWeight: 'bold', fontSize: 18 },
  extraIngredient: { fontSize: 16, marginLeft: 10 },
  instructions: { marginTop: 5, fontStyle: 'italic', fontSize: 16 },
  noRecipes: { fontSize: 16, textAlign: 'center', marginTop: 20, color: '#fff' },
});
