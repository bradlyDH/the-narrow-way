// src/components/PulseTile.js
import React, { useEffect, useRef, memo, useState } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  Pressable,
  View,
  AccessibilityInfo,
} from 'react-native';
import { Colors } from '../constants/colors';
// import * as Haptics from 'expo-haptics'; // optional

function PulseTile({
  label,
  onPress,
  pulsing = false,
  count = 0,
  disabled = false,
  style,
  testID = 'pulse-tile',
  accessibilityLabel,
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const halo = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let sub;
    AccessibilityInfo?.isReduceMotionEnabled?.()
      .then(setReduceMotion)
      .catch(() => {});
    sub = AccessibilityInfo?.addEventListener?.(
      'reduceMotionChanged',
      setReduceMotion
    );
    return () => sub?.remove?.();
  }, []);

  useEffect(() => {
    // stop any running animations when disabled or motion reduced
    const shouldPulse = pulsing && !disabled && !reduceMotion;
    if (!shouldPulse) {
      scale.stopAnimation();
      halo.stopAnimation();
      scale.setValue(1);
      halo.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.04,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.0,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(halo, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(halo, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulsing, disabled, reduceMotion, scale, halo]);

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
    <View style={[styles.wrap, style]}>
      {pulsing && !disabled && !reduceMotion && (
        <Animated.View
          accessible={false}
          pointerEvents="none"
          style={[styles.halo, haloStyle]}
        />
      )}

      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          testID={testID}
          onPress={onPress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          accessibilityLabel={
            accessibilityLabel ?? (count > 0 ? `${label}, ${count} new` : label)
          }
          android_ripple={{ borderless: false }}
          hitSlop={8}
          style={({ pressed }) => [
            styles.tile,
            pressed && { opacity: 0.92 },
            disabled && { opacity: 0.6 },
          ]}
        >
          <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
            {label}
          </Text>

          {count > 0 && (
            <View style={styles.badge} pointerEvents="none">
              <Text style={styles.badgeText}>
                {count > 99 ? '99+' : String(count)}
              </Text>
            </View>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default memo(PulseTile);

const TILE_RADIUS = 18;
const HALO_OUTSET = 6;

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  halo: {
    position: 'absolute',
    left: -HALO_OUTSET,
    right: -HALO_OUTSET,
    top: -HALO_OUTSET,
    bottom: -HALO_OUTSET,
    borderRadius: TILE_RADIUS + HALO_OUTSET, // keep corners aligned
    backgroundColor: Colors.button,
    zIndex: 0,
  },
  tile: {
    minHeight: 54,
    minWidth: 44, // ensure touch target
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: TILE_RADIUS,
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
