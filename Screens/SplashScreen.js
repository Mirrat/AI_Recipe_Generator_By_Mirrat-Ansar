import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Video } from 'expo-av';

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/butterfly.mp4')} // video using expo-av
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            // When video finishes, shows them Login screen
            navigation.replace('Login');
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  video: { flex: 1 },
});
