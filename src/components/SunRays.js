// src/components/SunRays.js
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PALETTE = [
  '#E3F2FD',
  '#BBDEFB',
  '#90CAF9',
  '#64B5F6',
  '#42A5F5',
  '#2196F3',
  '#1E88E5',
  '#1976D2',
  '#1565C0',
  '#0D47A1',
];

// helper: rotate the palette for the second layer
const rotate = (arr, n) => arr.slice(n).concat(arr.slice(0, n));

export default function SunRays() {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = () => {
      Animated.sequence([
        Animated.timing(fade, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true, // animates opacity on the native thread
        }),
        Animated.timing(fade, {
          toValue: 0,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]).start(loop);
    };
    loop();
  }, [fade]);

  // Two gradients with slightly different directions + rotated colors
  const colorsA = PALETTE;
  const colorsB = rotate(PALETTE, 3);

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Base gradient */}
      <LinearGradient
        colors={colorsA}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }} // diagonal sweep
        style={styles.gradient}
      />

      {/* Animated overlay gradient (cross-fades in/out) */}
      <Animated.View style={[styles.gradient, { opacity: fade }]}>
        <LinearGradient
          colors={colorsB}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }} // opposite diagonal for motion contrast
          style={styles.gradient}
        />
      </Animated.View>

      {/* Optional super-subtle veil to keep text readable; tweak or remove */}
      <View style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject },
  gradient: { ...StyleSheet.absoluteFillObject },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    opacity: 0.03,
  },
});
