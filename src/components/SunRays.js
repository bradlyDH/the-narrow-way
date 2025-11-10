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

export default function SunRays({ style }) {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = () => {
      Animated.sequence([
        Animated.timing(fade, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
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

  const colorsA = PALETTE;
  const colorsB = rotate(PALETTE, 3);

  return (
    // Absolutely fill by default; pointerEvents so it never blocks touches
    <View
      style={[StyleSheet.absoluteFill, styles.container, style]}
      pointerEvents="none"
    >
      {/* Base gradient */}
      <LinearGradient
        colors={colorsA}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Animated overlay gradient (cross-fade) */}
      <Animated.View style={[styles.gradient, { opacity: fade }]}>
        <LinearGradient
          colors={colorsB}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>

      {/* Subtle veil to keep text readable */}
      <View style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    /* kept empty intentionally; absolute fill applied above */
  },
  gradient: { ...StyleSheet.absoluteFillObject },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    opacity: 0.03,
  },
});
