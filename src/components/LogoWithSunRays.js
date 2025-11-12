// src/components/LogoWithSunRays.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import SunRays from './SunRays';
import AnimatedLogo from './AnimatedLogo';

export default function LogoWithSunRays() {
  return (
    <View style={styles.container}>
      {/* Animated gradient background */}
      <SunRays />

      {/* Animated logo over it */}
      <AnimatedLogo
        height={80}
        text="The Narrow Way"
        textColor="#FFFFFF"
        strokeColor="#FFFFFF"
        glowColor="#90CAF9" // bright cyan glow fits the blue background
        bgColor="transparent" // key: let the sunrays show through!
        useGradient={false}
        showGrid={false} // optional: disable grid for a cleaner look
        showGlow={true}
        showBeam={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
