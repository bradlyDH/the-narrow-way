// // // src/screens/SplashScreen.js
// // import React, { useEffect, useRef, useState } from 'react';
// // import { Animated, Easing, StyleSheet, View } from 'react-native';
// // import * as SplashScreen from 'expo-splash-screen';
// // import SunRays from '../components/SunRays';
// // import AnimatedLogo from '../components/AnimatedLogo';

// // // Keep the native splash visible until we fade this one out
// // SplashScreen.preventAutoHideAsync().catch(() => {});

// // export default function SplashScreenView({ onFinish }) {
// //   const fadeAnim = useRef(new Animated.Value(1)).current;
// //   const [done, setDone] = useState(false);

// //   useEffect(() => {
// //     let mounted = true;

// //     const run = async () => {
// //       // ⏱ Minimum display time for visual smoothness
// //       const minDisplay = 2000; // 2 seconds minimum
// //       const start = Date.now();

// //       // Simulate / perform your real loading tasks here
// //       await loadAppResources();

// //       const elapsed = Date.now() - start;
// //       const remaining = Math.max(0, minDisplay - elapsed);
// //       setTimeout(() => {
// //         if (!mounted) return;
// //         // Fade out animation
// //         Animated.timing(fadeAnim, {
// //           toValue: 0,
// //           duration: 800,
// //           easing: Easing.out(Easing.quad),
// //           useNativeDriver: true,
// //         }).start(async () => {
// //           setDone(true);
// //           onFinish?.();
// //           try {
// //             await SplashScreen.hideAsync();
// //           } catch {}
// //         });
// //       }, remaining);
// //     };

// //     run();
// //     return () => {
// //       mounted = false;
// //     };
// //   }, [fadeAnim, onFinish]);

// //   if (done) return null;

// //   return (
// //     <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
// //       <SunRays />
// //       <AnimatedLogo
// //         height={96}
// //         text="The Narrow Way"
// //         textColor="#FFFFFF"
// //         strokeColor="#FFFFFF"
// //         glowColor="#90CAF9"
// //         useGradient={false}
// //         showGrid={false}
// //         showBeam={true}
// //         showGlow={true}
// //       />
// //     </Animated.View>
// //   );
// // }

// // // Example "loading" function
// // async function loadAppResources() {
// //   // Replace with actual asset/font/API preloading
// //   return new Promise((resolve) => setTimeout(resolve, 1800));
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     ...StyleSheet.absoluteFillObject,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#000', // fallback if SunRays doesn’t fill fast enough
// //   },
// // });

// // src/screens/SplashScreen.js
// import React, { useEffect, useRef, useState } from 'react';
// import { Animated, Easing, StyleSheet, View } from 'react-native';
// import SunRays from '../components/SunRays';
// import AnimatedLogo from '../components/AnimatedLogo';

// export default function SplashScreenView({
//   load, // async function to prepare app (e.g., ensureSessionAndProfile)
//   onFinish, // called when splash fully fades out
//   animationMs = 1800, // match AnimatedLogo reveal speed
//   minVisibleMs = 900, // ensure users can perceive the animation
//   maxWaitMs = 8000, // hard timeout so we always proceed
// }) {
//   const [done, setDone] = useState(false);
//   const opacity = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     let mounted = true;

//     const withTimeout = (p, ms) =>
//       Promise.race([
//         p.catch(() => {}), // swallow load errors; we still proceed
//         new Promise((resolve) => setTimeout(resolve, ms)),
//       ]);

//     (async () => {
//       const t0 = Date.now();
//       // Run your boot tasks with a hard timeout
//       if (typeof load === 'function') {
//         await withTimeout(Promise.resolve(load()), maxWaitMs);
//       }
//       // Honor a minimum visible time and roughly align with the logo sweep
//       const elapsed = Date.now() - t0;
//       const hold = Math.max(0, Math.max(minVisibleMs, animationMs) - elapsed);

//       setTimeout(() => {
//         if (!mounted) return;
//         Animated.timing(opacity, {
//           toValue: 0,
//           duration: 450,
//           easing: Easing.out(Easing.quad),
//           useNativeDriver: true,
//         }).start(() => {
//           if (!mounted) return;
//           setDone(true);
//           onFinish?.();
//         });
//       }, hold);
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, [animationMs, minVisibleMs, maxWaitMs, load, onFinish, opacity]);

//   if (done) return null;

//   return (
//     <Animated.View
//       style={[StyleSheet.absoluteFill, styles.center, { opacity }]}
//       pointerEvents="none"
//     >
//       <SunRays />
//       <AnimatedLogo
//         height={96}
//         text="The Narrow Way"
//         textColor="#FFFFFF"
//         strokeColor="#FFFFFF"
//         glowColor="#90CAF9"
//         useGradient={false}
//         showGrid={false}
//         showBeam={true}
//         showGlow={true}
//         revealDurationMs={animationMs} // ← keep in sync with overlay timing
//         loopDelayMs={900}
//       />
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   center: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#000', // fallback behind SunRays
//   },
// });

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
