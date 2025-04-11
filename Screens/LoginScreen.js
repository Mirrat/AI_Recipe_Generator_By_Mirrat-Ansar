import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground } from 'react-native';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (error) {
      alert('Login error: ' + error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/leaf.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Login" onPress={handleLogin} color="#007bff" />
        <Text style={styles.text}>Don't have an account?</Text>
        <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} color="#007bff" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: 'rgba(28, 27, 27, 0.8)', 
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20, 
    color: '#fff' 
  },
  input: { 
    width: '80%', 
    borderWidth: 1, 
    borderColor: '#ccc', 
    marginBottom: 10, 
    padding: 10, 
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#000', 
  },
  text: { 
    marginTop: 20, 
    color: '#fff' 
  },
});
