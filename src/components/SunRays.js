// src/components/SunRays.js
import React, { useEffect, useMemo, useRef, memo, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  AccessibilityInfo,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const DEFAULT_PALETTE = ['#E9F1FF', '#CFE1FF', '#B4CDFF'];
const rotate = (arr, n) =>
  arr.length ? arr.slice(n).concat(arr.slice(0, n)) : arr;

function SunRays({
  style,
  palette = DEFAULT_PALETTE,
  durationMs = 6000,
  overlayOpacity = 0.03,
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const animRef = useRef(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Guard: ensure we always have at least one color
  const colorsA = palette && palette.length ? palette : DEFAULT_PALETTE;
  const colorsB = useMemo(() => {
    const len = colorsA.length || 1;
    return rotate(colorsA, 3 % len);
  }, [colorsA]);

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
    if (reduceMotion) {
      animRef.current?.stop?.();
      fade.setValue(0);
      return;
    }
    const seq = Animated.sequence([
      Animated.timing(fade, {
        toValue: 1,
        duration: durationMs,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 0,
        duration: durationMs,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    ]);
    const loop = Animated.loop(seq);
    animRef.current = loop;
    loop.start();
    return () => loop.stop();
  }, [fade, durationMs, reduceMotion]);

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.container, style]}
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <LinearGradient
        colors={colorsA}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      <Animated.View style={[styles.gradient, { opacity: fade }]}>
        <LinearGradient
          colors={colorsB}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>
      <View style={[styles.overlay, { opacity: overlayOpacity }]} />
    </View>
  );
}

export default memo(SunRays);

const styles = StyleSheet.create({
  container: {},
  gradient: { ...StyleSheet.absoluteFillObject },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
});
