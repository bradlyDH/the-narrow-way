import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';

export default function PulseTile({ label, onPress, pulsing = false }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pulsing) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.03,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulsing]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={styles.tile}
      >
        <Text style={styles.text}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    aspectRatio: 2.5,
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
  },
  text: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
