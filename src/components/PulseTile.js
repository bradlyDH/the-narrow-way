// src/components/PulseTile.js
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';

export default function PulseTile({
  label,
  onPress,
  pulsing = false,
  count = 0, // NEW: show unread badge
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const halo = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!pulsing) {
      scale.stopAnimation();
      halo.stopAnimation();
      scale.setValue(1);
      halo.setValue(0);
      return;
    }

    // Keep animations JS-driven to avoid the “moved to native” warning
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.04,
            duration: 900,
            useNativeDriver: false,
          }),
          Animated.timing(scale, {
            toValue: 1.0,
            duration: 900,
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(halo, {
            toValue: 1,
            duration: 900,
            useNativeDriver: false,
          }),
          Animated.timing(halo, {
            toValue: 0,
            duration: 900,
            useNativeDriver: false,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulsing, scale, halo]);

  const haloStyle = {
    opacity: halo.interpolate({
      inputRange: [0, 1],
      outputRange: [0.15, 0.45],
    }),
    transform: [
      {
        scale: halo.interpolate({
          inputRange: [0, 1],
          outputRange: [1.02, 1.08],
        }),
      },
    ],
  };

  return (
    <View style={styles.wrap}>
      {/* Glowing halo behind the tile when pulsing */}
      {pulsing && (
        <Animated.View pointerEvents="none" style={[styles.halo, haloStyle]} />
      )}

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.9}
          style={styles.tile}
        >
          <Text style={styles.text}>{label}</Text>

          {count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {count > 99 ? '99+' : String(count)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  halo: {
    position: 'absolute',
    left: -6,
    right: -6,
    top: -6,
    bottom: -6,
    borderRadius: 18,
    backgroundColor: Colors.button,
    zIndex: 0,
  },
  tile: {
    minHeight: 54, // slimmer tile
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    opacity: 0.9,
    justifyContent: 'center',
  },
  text: { color: '#fff', fontWeight: '800', fontSize: 16 },
  badge: {
    position: 'absolute',
    right: 10,
    top: 8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: '#ff4757',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontWeight: '800', fontSize: 12 },
});
