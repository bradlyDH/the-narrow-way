// src/screens/SplashScreen.js
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import SunRays from '../components/SunRays';
import AnimatedLogo from '../components/AnimatedLogo';

export default function SplashScreenView({
  load, // async boot function (e.g., ensureSessionAndProfile)
  onFinish, // called after fade-out
  animationMs = 1800, // matches AnimatedLogo reveal speed
  minVisibleMs = 900, // keep visible long enough to perceive animation
  maxWaitMs = 8000, // hard timeout so we always leave splash
}) {
  const [done, setDone] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let mounted = true;

    const withTimeout = (p, ms) =>
      Promise.race([
        (typeof p === 'function' ? p() : p)?.catch?.(() => {}),
        new Promise((res) => setTimeout(res, ms)),
      ]);

    (async () => {
      const t0 = Date.now();

      // Run your boot work with a hard timeout
      if (load) {
        await withTimeout(load, maxWaitMs);
      }

      // Align with animation length and minimum visible duration
      const elapsed = Date.now() - t0;
      const hold = Math.max(0, Math.max(minVisibleMs, animationMs) - elapsed);

      setTimeout(() => {
        if (!mounted) return;
        Animated.timing(opacity, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start(() => {
          if (!mounted) return;
          setDone(true);
          onFinish?.();
        });
      }, hold);
    })();

    return () => {
      mounted = false;
    };
  }, [animationMs, load, maxWaitMs, minVisibleMs, onFinish, opacity]);

  if (done) return null;

  return (
    <Animated.View style={[styles.root, { opacity }]}>
      {/* Solid fallback background so you always see something */}
      <View style={styles.fallbackBg} />

      {/* Animated gradient background (won’t block touches; sits behind logo) */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <SunRays />
      </View>

      {/* Centered logo (uses normal layout, no absolute tricks) */}
      <View style={styles.center}>
        <AnimatedLogo
          height={96}
          text="The Narrow Way"
          textColor="#FFFFFF"
          strokeColor="#FFFFFF"
          glowColor="#FFD700"
          useGradient={false}
          showGrid={false}
          showBeam={true}
          showGlow={true}
          revealDurationMs={animationMs}
          loopDelayMs={900}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  fallbackBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000', // hard black fallback
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
