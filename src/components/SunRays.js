import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export default function SunRays() {
  return <View pointerEvents="none" style={styles.rays} />;
}

const styles = StyleSheet.create({
  rays: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 160,
    height: 160,
    backgroundColor: Colors.sun,
    opacity: 0.08,
    borderRadius: 100,
  }
});
