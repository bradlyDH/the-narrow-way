// // // // src/components/AnimatedLogo.js
// // // import React, { useEffect, useMemo, useRef } from 'react';
// // // import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
// // // import Svg, {
// // //   Circle,
// // //   Defs,
// // //   G,
// // //   Line,
// // //   LinearGradient,
// // //   RadialGradient,
// // //   Stop,
// // //   Text as SvgText,
// // //   Rect,
// // // } from 'react-native-svg';

// // // const ACircle = Animated.createAnimatedComponent(Circle);
// // // const ARect = Animated.createAnimatedComponent(Rect);
// // // const AG = Animated.createAnimatedComponent(G);

// // // export default function AnimatedLogo({
// // //   height = 48,
// // //   text = 'The Narrow Way',

// // //   // colors
// // //   textColor = '#FFFFFF',
// // //   strokeColor = '#FFFFFF',
// // //   glowColor = '#60a5fa',
// // //   bgColor = '#000000',

// // //   // visuals
// // //   useGradient = false,
// // //   showGrid = true,
// // //   showBeam = true,
// // //   showGlow = true,

// // //   // timing
// // //   revealDurationMs = 1500,
// // //   loopDelayMs = 900,

// // //   // sizing
// // //   compact = true,
// // //   style = {},
// // // }) {
// // //   // ----- geometry -----
// // //   const vbW = 800,
// // //     vbH = 200;
// // //   const width = height * (vbW / vbH);
// // //   const fontSize = compact ? height * 0.64 : height * 0.74;
// // //   const scale = width / vbW;
// // //   const strokeW = Math.max(1, 2 * scale);
// // //   const dy = Platform.OS === 'android' ? Math.round(fontSize * 0.12) : 0;

// // //   // ----- animation values (JS driver) -----
// // //   const progress = useRef(new Animated.Value(0)).current; // 0 → 1
// // //   const gridOpacity = useRef(new Animated.Value(0)).current;
// // //   const beamOpacity = useRef(new Animated.Value(0)).current;

// // //   // derived positions/sizes
// // //   const beamCx = progress.interpolate({
// // //     inputRange: [0, 1],
// // //     outputRange: [0, vbW],
// // //   });

// // //   // base text permanent reveal (cover wipe above text)
// // //   const coverX = progress.interpolate({
// // //     inputRange: [0, 1],
// // //     outputRange: [0, vbW],
// // //   });
// // //   const coverW = progress.interpolate({
// // //     inputRange: [0, 1],
// // //     outputRange: [vbW, 0],
// // //   });

// // //   // text opacity (prevents any outline ghosting before beam)
// // //   const textOpacity = progress.interpolate({
// // //     inputRange: [0, 0.05, 0.25, 1],
// // //     outputRange: [0, 0, 1, 1],
// // //     extrapolate: 'clamp',
// // //   });

// // //   // glow band (top SVG only) — width around beam
// // //   const glowBandPx = 140; // tweak band thickness
// // //   const half = glowBandPx / 2;

// // //   // Left cover hides glow left of (beam - half)
// // //   const glowLeftW = progress.interpolate({
// // //     inputRange: [0, 1],
// // //     outputRange: [0, Math.max(0, vbW - half)],
// // //   });

// // //   // Right cover hides glow right of (beam + half)
// // //   const glowRightX = progress.interpolate({
// // //     inputRange: [0, 1],
// // //     outputRange: [half, vbW + half],
// // //   });
// // //   const glowRightW = progress.interpolate({
// // //     inputRange: [0, 1],
// // //     outputRange: [vbW - half, 0],
// // //   });

// // //   // subtle breathing for glow intensity
// // //   const glowBreathOpacity = progress.interpolate({
// // //     inputRange: [0, 0.25, 0.5, 0.75, 1],
// // //     outputRange: [0.0, 0.7, 0.55, 0.35, 0.0],
// // //   });

// // //   // paint servers
// // //   const ids = useMemo(
// // //     () => ({
// // //       strokeGrad: 'Logo_strokeGrad_final',
// // //       beamGrad: 'Logo_beamGrad_final',
// // //     }),
// // //     []
// // //   );

// // //   // ----- animation loop -----
// // //   useEffect(() => {
// // //     const reset = () => {
// // //       progress.setValue(0);
// // //       gridOpacity.setValue(0);
// // //       beamOpacity.setValue(0);
// // //     };

// // //     const run = () => {
// // //       Animated.sequence([
// // //         Animated.timing(gridOpacity, {
// // //           toValue: showGrid ? 0.06 : 0,
// // //           duration: 250,
// // //           easing: Easing.out(Easing.quad),
// // //           useNativeDriver: false,
// // //         }),
// // //         Animated.parallel([
// // //           Animated.timing(progress, {
// // //             toValue: 1,
// // //             duration: revealDurationMs,
// // //             easing: Easing.inOut(Easing.cubic),
// // //             useNativeDriver: false,
// // //           }),
// // //           showBeam
// // //             ? Animated.sequence([
// // //                 Animated.timing(beamOpacity, {
// // //                   toValue: 1,
// // //                   duration: 120,
// // //                   useNativeDriver: false,
// // //                 }),
// // //                 Animated.delay(Math.max(200, revealDurationMs - 200)),
// // //                 Animated.timing(beamOpacity, {
// // //                   toValue: 0,
// // //                   duration: 220,
// // //                   useNativeDriver: false,
// // //                 }),
// // //               ])
// // //             : Animated.delay(0),
// // //         ]),
// // //         Animated.delay(loopDelayMs),
// // //       ]).start(() => {
// // //         reset();
// // //         run();
// // //       });
// // //     };

// // //     reset();
// // //     run();

// // //     return () => {
// // //       [progress, gridOpacity, beamOpacity].forEach((v) => v.stopAnimation());
// // //     };
// // //   }, [
// // //     beamOpacity,
// // //     gridOpacity,
// // //     loopDelayMs,
// // //     progress,
// // //     revealDurationMs,
// // //     showBeam,
// // //     showGrid,
// // //   ]);

// // //   return (
// // //     <View
// // //       style={[styles.wrapper, { height, width }, style]}
// // //       pointerEvents="none"
// // //     >
// // //       {/* ========= BASE LAYER: outline + fill + cover wipe (permanent reveal) ========= */}
// // //       <Svg width={width} height={height} viewBox={`0 0 ${vbW} ${vbH}`}>
// // //         <Defs>
// // //           <LinearGradient id={ids.strokeGrad} x1="0%" y1="0%" x2="100%">
// // //             <Stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
// // //             <Stop offset="50%" stopColor="#93c5fd" stopOpacity="1" />
// // //             <Stop offset="100%" stopColor="#dbeafe" stopOpacity="1" />
// // //           </LinearGradient>
// // //         </Defs>

// // //         {/* subtle grid */}
// // //         {showGrid && (
// // //           <AG opacity={gridOpacity}>
// // //             {Array.from({ length: 20 }).map((_, i) => (
// // //               <Line
// // //                 key={`v-${i}`}
// // //                 x1={i * 40}
// // //                 y1="0"
// // //                 x2={i * 40}
// // //                 y2={vbH}
// // //                 stroke="#2a2f3a"
// // //                 strokeWidth="0.7"
// // //               />
// // //             ))}
// // //             {Array.from({ length: 10 }).map((_, i) => (
// // //               <Line
// // //                 key={`h-${i}`}
// // //                 x1="0"
// // //                 y1={i * 20}
// // //                 x2={vbW}
// // //                 y2={i * 20}
// // //                 stroke="#2a2f3a"
// // //                 strokeWidth="0.7"
// // //               />
// // //             ))}
// // //           </AG>
// // //         )}

// // //         {/* OUTLINE + FILL grouped under animated opacity (prevents pre-beam ghosting) */}
// // //         <AG opacity={textOpacity}>
// // //           <SvgText
// // //             x={vbW / 2}
// // //             y={vbH / 2}
// // //             dy={dy}
// // //             textAnchor="middle"
// // //             fill="none"
// // //             stroke={useGradient ? `url(#${ids.strokeGrad})` : strokeColor}
// // //             strokeWidth={strokeW}
// // //             strokeLinecap="round"
// // //             strokeLinejoin="round"
// // //             fontSize={fontSize}
// // //             letterSpacing={0}
// // //           >
// // //             {text}
// // //           </SvgText>

// // //           <SvgText
// // //             x={vbW / 2}
// // //             y={vbH / 2}
// // //             dy={dy}
// // //             textAnchor="middle"
// // //             fill={textColor}
// // //             fontSize={fontSize}
// // //             letterSpacing={0}
// // //           >
// // //             {text}
// // //           </SvgText>
// // //         </AG>

// // //         {/* Permanent reveal wipe (slides right; reveals text behind it) */}
// // //         <ARect x={coverX} y="0" width={coverW} height={vbH} fill={bgColor} />
// // //       </Svg>

// // //       {/* ========= TOP LAYER: beam + beam-locked glow (never hides base text) ========= */}
// // //       <Svg
// // //         width={width}
// // //         height={height}
// // //         viewBox={`0 0 ${vbW} ${vbH}`}
// // //         style={StyleSheet.absoluteFill}
// // //       >
// // //         <Defs>
// // //           <RadialGradient id={ids.beamGrad} cx="50%" cy="50%" r="50%">
// // //             <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
// // //             <Stop offset="55%" stopColor={glowColor} stopOpacity="0.6" />
// // //             <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
// // //           </RadialGradient>
// // //         </Defs>

// // //         {/* beam (above base) */}
// // //         {showBeam ? (
// // //           <ACircle
// // //             r="18"
// // //             cy={vbH / 2}
// // //             cx={beamCx}
// // //             fill={`url(#${ids.beamGrad})`}
// // //             opacity={beamOpacity}
// // //           />
// // //         ) : null}

// // //         {/* glow text (thick/soft) */}
// // //         {showGlow ? (
// // //           <>
// // //             <SvgText
// // //               x={vbW / 2}
// // //               y={vbH / 2}
// // //               dy={dy}
// // //               textAnchor="middle"
// // //               fill="none"
// // //               stroke={glowColor}
// // //               strokeWidth={strokeW * 5}
// // //               strokeOpacity="0.22"
// // //               fontSize={fontSize}
// // //               letterSpacing={0}
// // //               style={{ opacity: glowBreathOpacity }}
// // //             >
// // //               {text}
// // //             </SvgText>

// // //             {/* Band covers that confine the glow to a window around the beam */}
// // //             <ARect x={0} y={0} width={glowLeftW} height={vbH} fill={bgColor} />
// // //             <ARect
// // //               x={glowRightX}
// // //               y={0}
// // //               width={glowRightW}
// // //               height={vbH}
// // //               fill={bgColor}
// // //             />
// // //           </>
// // //         ) : null}
// // //       </Svg>
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   wrapper: {
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     overflow: 'visible',
// // //   },
// // // });

// // // src/components/AnimatedLogo.js
// // import React, { useEffect, useMemo, useRef } from 'react';
// // import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
// // import Svg, {
// //   Circle,
// //   Defs,
// //   G,
// //   Line,
// //   LinearGradient,
// //   RadialGradient,
// //   Stop,
// //   Text as SvgText,
// //   Rect,
// //   ClipPath,
// // } from 'react-native-svg';

// // const ACircle = Animated.createAnimatedComponent(Circle);
// // const ARect = Animated.createAnimatedComponent(Rect);
// // const AG = Animated.createAnimatedComponent(G);

// // export default function AnimatedLogo({
// //   height = 48,
// //   text = 'The Narrow Way',

// //   // Colors
// //   textColor = '#FFFFFF',
// //   strokeColor = '#FFFFFF',
// //   glowColor = '#60a5fa',
// //   bgColor = '#000000',

// //   // Visuals
// //   useGradient = false,
// //   showGrid = true,
// //   showBeam = true,
// //   showGlow = true,

// //   // Timing
// //   revealDurationMs = 4000,
// //   loopDelayMs = 900,

// //   // Sizing
// //   compact = true,
// //   style = {},
// // }) {
// //   // ---- geometry ----
// //   const vbW = 800,
// //     vbH = 200;
// //   const width = height * (vbW / vbH);
// //   const fontSize = compact ? height * 0.64 : height * 0.74;
// //   const scale = width / vbW;
// //   const strokeW = Math.max(1, 2 * scale);
// //   const dy = Platform.OS === 'android' ? Math.round(fontSize * 0.12) : 0;

// //   // ---- animated values ----
// //   const progress = useRef(new Animated.Value(0)).current; // 0 → 1 sweep
// //   const gridOpacity = useRef(new Animated.Value(0)).current;
// //   const beamOpacity = useRef(new Animated.Value(0)).current;

// //   // derived
// //   const beamCx = progress.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [0, vbW],
// //   });
// //   const coverX = progress.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [0, vbW],
// //   });
// //   const coverW = progress.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [vbW, 0],
// //   });

// //   // Text opacity (prevents faint pre-beam outline)
// //   const textOpacity = progress.interpolate({
// //     inputRange: [0, 0.04, 0.12, 1],
// //     outputRange: [0, 0, 1, 1],
// //     extrapolate: 'clamp',
// //   });

// //   // Glow band clip width around beam (glow only; base text stays visible)
// //   const glowBandPx = 140; // widen/narrow the band to taste
// //   const glowBandLeftX = Animated.add(
// //     beamCx,
// //     new Animated.Value(-glowBandPx / 2)
// //   );

// //   const ids = useMemo(
// //     () => ({
// //       strokeGrad: 'logo_strokeGrad',
// //       beamGrad: 'logo_beamGrad',
// //       glowClip: 'logo_glowClip',
// //     }),
// //     []
// //   );

// //   // ---- loop ----
// //   useEffect(() => {
// //     const reset = () => {
// //       progress.setValue(0);
// //       gridOpacity.setValue(0);
// //       beamOpacity.setValue(0);
// //     };
// //     const run = () => {
// //       Animated.sequence([
// //         Animated.timing(gridOpacity, {
// //           toValue: showGrid ? 0.06 : 0,
// //           duration: 250,
// //           easing: Easing.out(Easing.quad),
// //           useNativeDriver: false,
// //         }),
// //         Animated.parallel([
// //           Animated.timing(progress, {
// //             toValue: 1,
// //             duration: revealDurationMs,
// //             easing: Easing.inOut(Easing.cubic),
// //             useNativeDriver: false,
// //           }),
// //           showBeam
// //             ? Animated.sequence([
// //                 Animated.timing(beamOpacity, {
// //                   toValue: 1,
// //                   duration: 120,
// //                   useNativeDriver: false,
// //                 }),
// //                 Animated.delay(Math.max(200, revealDurationMs - 200)),
// //                 Animated.timing(beamOpacity, {
// //                   toValue: 0,
// //                   duration: 220,
// //                   useNativeDriver: false,
// //                 }),
// //               ])
// //             : Animated.delay(0),
// //         ]),
// //         Animated.delay(loopDelayMs),
// //       ]).start(() => {
// //         reset();
// //         run();
// //       });
// //     };
// //     reset();
// //     run();
// //     return () =>
// //       [progress, gridOpacity, beamOpacity].forEach((v) => v.stopAnimation());
// //   }, [
// //     beamOpacity,
// //     gridOpacity,
// //     loopDelayMs,
// //     progress,
// //     revealDurationMs,
// //     showBeam,
// //     showGrid,
// //   ]);

// //   return (
// //     <View
// //       style={[styles.wrapper, { height, width }, style]}
// //       pointerEvents="none"
// //     >
// //       {/* ===== BASE: outline + fill; permanent reveal via cover wipe ===== */}
// //       <Svg width={width} height={height} viewBox={`0 0 ${vbW} ${vbH}`}>
// //         <Defs>
// //           <LinearGradient id={ids.strokeGrad} x1="0%" y1="0%" x2="100%">
// //             <Stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
// //             <Stop offset="50%" stopColor="#93c5fd" stopOpacity="1" />
// //             <Stop offset="100%" stopColor="#dbeafe" stopOpacity="1" />
// //           </LinearGradient>
// //         </Defs>

// //         {showGrid && (
// //           <AG opacity={gridOpacity}>
// //             {Array.from({ length: 20 }).map((_, i) => (
// //               <Line
// //                 key={`v-${i}`}
// //                 x1={i * 40}
// //                 y1="0"
// //                 x2={i * 40}
// //                 y2={vbH}
// //                 stroke="#2a2f3a"
// //                 strokeWidth="0.7"
// //               />
// //             ))}
// //             {Array.from({ length: 10 }).map((_, i) => (
// //               <Line
// //                 key={`h-${i}`}
// //                 x1="0"
// //                 y1={i * 20}
// //                 x2={vbW}
// //                 y2={i * 20}
// //                 stroke="#2a2f3a"
// //                 strokeWidth="0.7"
// //               />
// //             ))}
// //           </AG>
// //         )}

// //         {/* Group opacity removes pre-beam ghosting; cover then unveils permanently */}
// //         <AG opacity={textOpacity}>
// //           {/* Outline */}
// //           <SvgText
// //             x={vbW / 2}
// //             y={vbH / 2}
// //             dy={dy}
// //             textAnchor="middle"
// //             fill="none"
// //             stroke={useGradient ? `url(#${ids.strokeGrad})` : strokeColor}
// //             strokeWidth={strokeW}
// //             strokeLinecap="round"
// //             strokeLinejoin="round"
// //             fontSize={fontSize}
// //             letterSpacing={0}
// //           >
// //             {text}
// //           </SvgText>
// //           {/* Fill */}
// //           <SvgText
// //             x={vbW / 2}
// //             y={vbH / 2}
// //             dy={dy}
// //             textAnchor="middle"
// //             fill={textColor}
// //             fontSize={fontSize}
// //             letterSpacing={0}
// //           >
// //             {text}
// //           </SvgText>
// //         </AG>

// //         {/* Cover wipe (drawn last on base SVG) */}
// //         <ARect x={coverX} y="0" width={coverW} height={vbH} fill={bgColor} />
// //       </Svg>

// //       {/* ===== TOP: beam + glow (glow clipped to a band; never hides base text) ===== */}
// //       <Svg
// //         width={width}
// //         height={height}
// //         viewBox={`0 0 ${vbW} ${vbH}`}
// //         style={StyleSheet.absoluteFill}
// //       >
// //         <Defs>
// //           <RadialGradient id={ids.beamGrad} cx="50%" cy="50%" r="50%">
// //             <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
// //             <Stop offset="55%" stopColor={glowColor} stopOpacity="0.6" />
// //             <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
// //           </RadialGradient>

// //           {/* Glow band clip: animated rect centered on the beam */}
// //           <ClipPath id={ids.glowClip}>
// //             <ARect x={glowBandLeftX} y={0} width={glowBandPx} height={vbH} />
// //           </ClipPath>
// //         </Defs>

// //         {/* Beam on top */}
// //         {showBeam && (
// //           <ACircle
// //             r="18"
// //             cy={vbH / 2}
// //             cx={beamCx}
// //             fill={`url(#${ids.beamGrad})`}
// //             opacity={beamOpacity}
// //           />
// //         )}

// //         {/* Glow text, clipped to band so it only shows near the beam */}
// //         {showGlow && (
// //           <G clipPath={`url(#${ids.glowClip})`}>
// //             <SvgText
// //               x={vbW / 2}
// //               y={vbH / 2}
// //               dy={dy}
// //               textAnchor="middle"
// //               fill="none"
// //               stroke={glowColor}
// //               strokeWidth={strokeW * 5}
// //               strokeOpacity="0.22"
// //               fontSize={fontSize}
// //               letterSpacing={0}
// //             >
// //               {text}
// //             </SvgText>
// //           </G>
// //         )}
// //       </Svg>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   wrapper: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     overflow: 'visible',
// //   },
// // });

// import React, { useEffect, useMemo, useRef } from 'react';
// import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
// import MaskedView from '@react-native-masked-view/masked-view';
// import Svg, {
//   Circle,
//   Defs,
//   G,
//   Line,
//   LinearGradient,
//   RadialGradient,
//   Stop,
//   Text as SvgText,
// } from 'react-native-svg';

// const ACircle = Animated.createAnimatedComponent(Circle);
// const AG = Animated.createAnimatedComponent(G);

// export default function AnimatedLogo({
//   height = 48,
//   text = 'The Narrow Way',

//   // Colors
//   textColor = '#FFFFFF',
//   strokeColor = '#FFFFFF',
//   glowColor = '#60a5fa',

//   // Visuals
//   useGradient = false,
//   showGrid = true,
//   showBeam = true,
//   showGlow = true,

//   // Timing
//   revealDurationMs = 1500,
//   loopDelayMs = 900,

//   // Sizing
//   compact = true,
//   style = {},
// }) {
//   // ----- geometry -----
//   const vbW = 800,
//     vbH = 200; // SVG viewBox
//   const width = height * (vbW / vbH); // RN pixels
//   const fontSize = compact ? height * 0.64 : height * 0.74;
//   const scale = width / vbW;
//   const strokeW = Math.max(1, 2 * scale);
//   const dy = Platform.OS === 'android' ? Math.round(fontSize * 0.12) : 0;

//   // ----- animation values -----
//   const progress = useRef(new Animated.Value(0)).current; // 0 → 1 sweep
//   const gridOpacity = useRef(new Animated.Value(0)).current;
//   const beamOpacity = useRef(new Animated.Value(0)).current;

//   // Derived
//   const beamCx = progress.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, vbW],
//   });
//   const maskW = progress.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, width],
//   });

//   // Subtle “no ghost pre-beam” fade-in (optional; can be 1 always)
//   const textOpacity = progress.interpolate({
//     inputRange: [0, 0.04, 0.12, 1],
//     outputRange: [0, 0, 1, 1],
//     extrapolate: 'clamp',
//   });

//   const ids = useMemo(
//     () => ({
//       strokeGrad: 'logo_strokeGrad_masked',
//       beamGrad: 'logo_beamGrad_masked',
//     }),
//     []
//   );

//   // ----- loop -----
//   useEffect(() => {
//     const reset = () => {
//       progress.setValue(0);
//       gridOpacity.setValue(0);
//       beamOpacity.setValue(0);
//     };
//     const run = () => {
//       Animated.sequence([
//         Animated.timing(gridOpacity, {
//           toValue: showGrid ? 0.06 : 0,
//           duration: 250,
//           easing: Easing.out(Easing.quad),
//           useNativeDriver: false,
//         }),
//         Animated.parallel([
//           Animated.timing(progress, {
//             toValue: 1,
//             duration: revealDurationMs,
//             easing: Easing.inOut(Easing.cubic),
//             useNativeDriver: false,
//           }),
//           showBeam
//             ? Animated.sequence([
//                 Animated.timing(beamOpacity, {
//                   toValue: 1,
//                   duration: 120,
//                   useNativeDriver: false,
//                 }),
//                 Animated.delay(Math.max(200, revealDurationMs - 200)),
//                 Animated.timing(beamOpacity, {
//                   toValue: 0,
//                   duration: 220,
//                   useNativeDriver: false,
//                 }),
//               ])
//             : Animated.delay(0),
//         ]),
//         Animated.delay(loopDelayMs),
//       ]).start(() => {
//         reset();
//         run();
//       });
//     };
//     reset();
//     run();
//     return () =>
//       [progress, gridOpacity, beamOpacity].forEach((v) => v.stopAnimation());
//   }, [
//     beamOpacity,
//     gridOpacity,
//     loopDelayMs,
//     progress,
//     revealDurationMs,
//     showBeam,
//     showGrid,
//   ]);

//   return (
//     <View
//       style={[styles.wrapper, { height, width }, style]}
//       pointerEvents="none"
//     >
//       {/* ========= BASE SVG (grid only, optional) ========= */}
//       {showGrid && (
//         <Svg
//           width={width}
//           height={height}
//           viewBox={`0 0 ${vbW} ${vbH}`}
//           style={StyleSheet.absoluteFill}
//         >
//           <AG opacity={gridOpacity}>
//             {Array.from({ length: 20 }).map((_, i) => (
//               <Line
//                 key={`v-${i}`}
//                 x1={i * 40}
//                 y1="0"
//                 x2={i * 40}
//                 y2={vbH}
//                 stroke="#2a2f3a"
//                 strokeWidth="0.7"
//               />
//             ))}
//             {Array.from({ length: 10 }).map((_, i) => (
//               <Line
//                 key={`h-${i}`}
//                 x1="0"
//                 y1={i * 20}
//                 x2={vbW}
//                 y2={i * 20}
//                 stroke="#2a2f3a"
//                 strokeWidth="0.7"
//               />
//             ))}
//           </AG>
//         </Svg>
//       )}

//       {/* ========= MASKED TEXT: reveals over ANY background ========= */}
//       <MaskedView
//         style={StyleSheet.absoluteFill}
//         maskElement={
//           <Animated.View
//             style={{ width: maskW, height, backgroundColor: 'white' }}
//           />
//         }
//       >
//         <Svg width={width} height={height} viewBox={`0 0 ${vbW} ${vbH}`}>
//           <Defs>
//             <LinearGradient id={ids.strokeGrad} x1="0%" y1="0%" x2="100%">
//               <Stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
//               <Stop offset="50%" stopColor="#93c5fd" stopOpacity="1" />
//               <Stop offset="100%" stopColor="#dbeafe" stopOpacity="1" />
//             </LinearGradient>
//           </Defs>

//           {/* Outline + Fill (fully opaque; masking handles reveal) */}
//           <AG opacity={textOpacity}>
//             <SvgText
//               x={vbW / 2}
//               y={vbH / 2}
//               dy={dy}
//               textAnchor="middle"
//               fill="none"
//               stroke={useGradient ? `url(#${ids.strokeGrad})` : strokeColor}
//               strokeWidth={strokeW}
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               fontSize={fontSize}
//               letterSpacing={0}
//             >
//               {text}
//             </SvgText>
//             <SvgText
//               x={vbW / 2}
//               y={vbH / 2}
//               dy={dy}
//               textAnchor="middle"
//               fill={textColor}
//               fontSize={fontSize}
//               letterSpacing={0}
//             >
//               {text}
//             </SvgText>
//           </AG>
//         </Svg>
//       </MaskedView>

//       {/* ========= TOP SVG: beam + glow (never hides base text) ========= */}
//       <Svg
//         width={width}
//         height={height}
//         viewBox={`0 0 ${vbW} ${vbH}`}
//         style={StyleSheet.absoluteFill}
//       >
//         <Defs>
//           <RadialGradient id={ids.beamGrad} cx="50%" cy="50%" r="50%">
//             <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
//             <Stop offset="55%" stopColor={glowColor} stopOpacity="0.6" />
//             <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
//           </RadialGradient>
//         </Defs>

//         {/* Beam */}
//         {showBeam && (
//           <ACircle
//             r="18"
//             cy={vbH / 2}
//             cx={beamCx}
//             fill={`url(#${ids.beamGrad})`}
//             opacity={beamOpacity}
//           />
//         )}

//         {/* Optional glow: soft stroke around the text, banded by the mask above (already localized by reveal) */}
//         {showGlow && (
//           <SvgText
//             x={vbW / 2}
//             y={vbH / 2}
//             dy={dy}
//             textAnchor="middle"
//             fill="none"
//             stroke={glowColor}
//             strokeWidth={strokeW * 5}
//             strokeOpacity="0.18"
//             fontSize={fontSize}
//             letterSpacing={0}
//           >
//             {text}
//           </SvgText>
//         )}
//       </Svg>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   wrapper: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'visible',
//   },
// });

// src/components/AnimatedLogo.js
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  RadialGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

const ACircle = Animated.createAnimatedComponent(Circle);
const AG = Animated.createAnimatedComponent(G);

export default function AnimatedLogo({
  height = 48,
  text = 'The Narrow Way',

  // colors
  textColor = '#FFFFFF',
  strokeColor = '#FFFFFF',
  glowColor = '#f2fa60ff',

  // visuals
  useGradient = false,
  showGrid = false,
  showBeam = true,
  showGlow = true,

  // timing
  revealDurationMs = 6000,
  loopDelayMs = 60000,

  // sizing
  compact = true,
  style = {},
}) {
  // --- geometry ---
  const vbW = 800,
    vbH = 200; // SVG viewBox
  const width = height * (vbW / vbH); // RN pixels
  const pxPerVB = width / vbW; // px per viewBox unit (for masks)
  const fontSize = compact ? height * 0.64 : height * 0.74;
  const strokeW = Math.max(1, 2 * pxPerVB);
  const dy = Platform.OS === 'android' ? Math.round(fontSize * 0.12) : 0;

  // --- animation values ---
  const progress = useRef(new Animated.Value(0)).current; // 0→1
  const gridOpacity = useRef(new Animated.Value(0)).current;
  const beamOpacity = useRef(new Animated.Value(0)).current;

  // Derived (SVG coords)
  const beamCxVB = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, vbW],
  });
  // Same in RN pixel space (for MaskedView band)
  const beamCxPX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  // Text reveal mask width (left→right wipe, in RN px)
  const textMaskW = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  // Glow band width (in viewBox units → convert to RN px)
  const glowBandVB = 140; // tweak band thickness
  const glowBandPX = glowBandVB * pxPerVB;

  const ids = useMemo(
    () => ({
      strokeGrad: 'logo_strokeGrad_mask',
      beamGrad: 'logo_beamGrad_mask',
    }),
    []
  );

  // --- loop ---
  useEffect(() => {
    const reset = () => {
      progress.setValue(0);
      gridOpacity.setValue(0);
      beamOpacity.setValue(0);
    };
    const run = () => {
      Animated.sequence([
        Animated.timing(gridOpacity, {
          toValue: showGrid ? 0.06 : 0,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.parallel([
          Animated.timing(progress, {
            toValue: 1,
            duration: revealDurationMs,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: false,
          }),
          showBeam
            ? Animated.sequence([
                Animated.timing(beamOpacity, {
                  toValue: 1,
                  duration: 120,
                  useNativeDriver: false,
                }),
                Animated.delay(Math.max(200, revealDurationMs - 200)),
                Animated.timing(beamOpacity, {
                  toValue: 0,
                  duration: 220,
                  useNativeDriver: false,
                }),
              ])
            : Animated.delay(0),
        ]),
        Animated.delay(loopDelayMs),
      ]).start(() => {
        reset();
        run();
      });
    };
    reset();
    run();
    return () =>
      [progress, gridOpacity, beamOpacity].forEach((v) => v.stopAnimation());
  }, [
    beamOpacity,
    gridOpacity,
    loopDelayMs,
    progress,
    revealDurationMs,
    showBeam,
    showGrid,
  ]);

  return (
    <View
      style={[styles.wrapper, { height, width }, style]}
      pointerEvents="none"
    >
      {/* ===== (optional) background grid in its own SVG ===== */}
      {showGrid && (
        <Svg
          width={width}
          height={height}
          viewBox={`0 0 ${vbW} ${vbH}`}
          style={StyleSheet.absoluteFill}
        >
          <AG opacity={gridOpacity}>
            {Array.from({ length: 20 }).map((_, i) => (
              <Line
                key={`v-${i}`}
                x1={i * 40}
                y1="0"
                x2={i * 40}
                y2={vbH}
                stroke="#2a2f3a"
                strokeWidth="0.7"
              />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <Line
                key={`h-${i}`}
                x1="0"
                y1={i * 20}
                x2={vbW}
                y2={i * 20}
                stroke="#2a2f3a"
                strokeWidth="0.7"
              />
            ))}
          </AG>
        </Svg>
      )}

      {/* ===== TEXT REVEAL (MaskedView): left→right wipe over any background ===== */}
      <MaskedView
        style={StyleSheet.absoluteFill}
        maskElement={
          <Animated.View
            style={{ width: textMaskW, height, backgroundColor: 'white' }}
          />
        }
      >
        <Svg width={width} height={height} viewBox={`0 0 ${vbW} ${vbH}`}>
          <Defs>
            <LinearGradient id={ids.strokeGrad} x1="0%" y1="0%" x2="100%">
              <Stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
              <Stop offset="50%" stopColor="#93c5fd" stopOpacity="1" />
              <Stop offset="100%" stopColor="#dbeafe" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {/* Outline + Fill (no pre-beam ghosting because mask width starts at 0) */}
          <SvgText
            x={vbW / 2}
            y={vbH / 2}
            dy={dy}
            textAnchor="middle"
            fill="none"
            stroke={useGradient ? `url(#${ids.strokeGrad})` : strokeColor}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            fontSize={fontSize}
            letterSpacing={0}
          >
            {text}
          </SvgText>
          <SvgText
            x={vbW / 2}
            y={vbH / 2}
            dy={dy}
            textAnchor="middle"
            fill={textColor}
            fontSize={fontSize}
            letterSpacing={0}
          >
            {text}
          </SvgText>
        </Svg>
      </MaskedView>

      {/* ===== TOP EFFECTS: beam + band-masked glow (separate MaskedView) ===== */}
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${vbW} ${vbH}`}
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <RadialGradient id={ids.beamGrad} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <Stop offset="55%" stopColor={glowColor} stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Beam (purely visual) */}
        {showBeam && (
          <ACircle
            r="18"
            cy={vbH / 2}
            cx={beamCxVB}
            fill={`url(#${ids.beamGrad})`}
            opacity={beamOpacity}
          />
        )}
      </Svg>

      {showGlow && (
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            // A narrow animated band centered on the beam (in RN px)
            <Animated.View
              style={{
                width: glowBandPX,
                height,
                backgroundColor: 'white',
                transform: [
                  {
                    translateX: Animated.subtract(
                      beamCxPX,
                      new Animated.Value(glowBandPX / 2)
                    ),
                  },
                ],
              }}
            />
          }
        >
          <Svg width={width} height={height} viewBox={`0 0 ${vbW} ${vbH}`}>
            {/* Glow text (only visible inside the band mask) */}
            <SvgText
              x={vbW / 2}
              y={vbH / 2}
              dy={dy}
              textAnchor="middle"
              fill="none"
              stroke={glowColor}
              strokeWidth={strokeW * 5}
              strokeOpacity="0.22"
              fontSize={fontSize}
              letterSpacing={0}
            >
              {text}
            </SvgText>
          </Svg>
        </MaskedView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
});
