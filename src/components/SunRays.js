// src/components/SunRays.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '../constants/colors';

// Using SunRays.js as the animated background component
export default function SunRays({ source }) {
  return (
    <View style={styles.container} pointerEvents="none">
      <Image
        source={source || require('../../assets/backgrounds/sunrays.gif')}
        style={styles.background}
        contentFit="cover"
        transition={500}
      />
      {/* Optional overlay for readability */}
      <View style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    opacity: 0.05, // subtle tint to soften or brighten the GIF
  },
});
