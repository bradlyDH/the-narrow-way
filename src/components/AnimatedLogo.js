// // src/components/AnimatedLogo.js
// import React, { useEffect, useRef } from 'react';
// import { Dimensions, Animated, Easing, View, StyleSheet } from 'react-native';
// import Svg, {
//   Defs,
//   LinearGradient,
//   RadialGradient,
//   Stop,
//   Text as SvgText,
//   Circle,
//   G,
//   Line,
// } from 'react-native-svg';

// const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);
// const AnimatedCircle = Animated.createAnimatedComponent(Circle);
// const AnimatedG = Animated.createAnimatedComponent(G);

// const { width: screenWidth } = Dimensions.get('window');

// export default function AnimatedLogo({
//   width = Math.min(screenWidth * 0.9, 520),
//   height = 64,
// }) {
//   const strokeDashoffset = useRef(new Animated.Value(1200)).current;
//   const strokeOpacity = useRef(new Animated.Value(0)).current;
//   const fillOpacity = useRef(new Animated.Value(0)).current;
//   const beamOpacity = useRef(new Animated.Value(0)).current;
//   const beamCx = useRef(new Animated.Value(80)).current;
//   const gridOpacity = useRef(new Animated.Value(0)).current;
//   const rotateX = useRef(new Animated.Value(45)).current;
//   const scale = useRef(new Animated.Value(0.94)).current;

//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.parallel([
//           Animated.timing(gridOpacity, {
//             toValue: 0.08,
//             duration: 400,
//             easing: Easing.out(Easing.quad),
//             useNativeDriver: false,
//           }),
//           Animated.timing(strokeOpacity, {
//             toValue: 1,
//             duration: 250,
//             easing: Easing.out(Easing.quad),
//             useNativeDriver: false,
//           }),
//           Animated.timing(strokeDashoffset, {
//             toValue: 0,
//             duration: 2000,
//             easing: Easing.out(Easing.cubic),
//             useNativeDriver: false,
//           }),
//           Animated.timing(rotateX, {
//             toValue: 0,
//             duration: 800,
//             easing: Easing.out(Easing.cubic),
//             useNativeDriver: true,
//           }),
//           Animated.timing(scale, {
//             toValue: 1,
//             duration: 800,
//             easing: Easing.out(Easing.cubic),
//             useNativeDriver: true,
//           }),
//         ]),
//         Animated.parallel([
//           Animated.timing(beamOpacity, {
//             toValue: 1,
//             duration: 200,
//             useNativeDriver: false,
//           }),
//           Animated.timing(beamCx, {
//             toValue: 720,
//             duration: 1700,
//             easing: Easing.inOut(Easing.quad),
//             useNativeDriver: false,
//           }),
//         ]),
//         Animated.parallel([
//           Animated.timing(beamOpacity, {
//             toValue: 0,
//             duration: 250,
//             useNativeDriver: false,
//           }),
//           Animated.timing(fillOpacity, {
//             toValue: 1,
//             duration: 350,
//             useNativeDriver: false,
//           }),
//         ]),
//         Animated.delay(1200), // idle before next loop
//       ])
//     );

//     // Reset before each loop iteration
//     const reset = () => {
//       strokeDashoffset.setValue(1200);
//       strokeOpacity.setValue(0);
//       fillOpacity.setValue(0);
//       beamOpacity.setValue(0);
//       beamCx.setValue(80);
//       gridOpacity.setValue(0);
//       rotateX.setValue(45);
//       scale.setValue(0.94);
//     };
//     reset();
//     loop.start();

//     return () => loop.stop();
//   }, [
//     beamCx,
//     beamOpacity,
//     fillOpacity,
//     gridOpacity,
//     rotateX,
//     scale,
//     strokeDashoffset,
//     strokeOpacity,
//   ]);

//   const rotateXDeg = rotateX.interpolate({
//     inputRange: [0, 90],
//     outputRange: ['0deg', '90deg'],
//   });

//   // Keep a consistent viewBox so the strokeDash length is reasonable
//   const vbW = 800;
//   const vbH = 200;
//   const scaleFactor = width / vbW;
//   const fontSize = 64; // looks right for header height ~64–72

//   return (
//     <View style={[styles.wrapper, { height }]} pointerEvents="none">
//       <Animated.View
//         style={{
//           transform: [{ perspective: 900 }, { rotateX: rotateXDeg }, { scale }],
//         }}
//       >
//         <Svg width={width} height={height} viewBox={`0 0 ${vbW} ${vbH}`}>
//           <Defs>
//             <LinearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
//               <Stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
//               <Stop offset="50%" stopColor="#93c5fd" stopOpacity="1" />
//               <Stop offset="100%" stopColor="#dbeafe" stopOpacity="1" />
//             </LinearGradient>
//             <RadialGradient id="beamGrad">
//               <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
//               <Stop offset="55%" stopColor="#60a5fa" stopOpacity="0.6" />
//               <Stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
//             </RadialGradient>
//           </Defs>

//           {/* subtle grid */}
//           <AnimatedG opacity={gridOpacity}>
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
//           </AnimatedG>

//           {/* sweeping beam */}
//           <AnimatedCircle
//             r="18"
//             cy={vbH / 2}
//             cx={beamCx}
//             fill="url(#beamGrad)"
//             opacity={beamOpacity}
//           />

//           {/* stroke outline draw */}
//           <AnimatedSvgText
//             x={vbW / 2}
//             y={vbH / 2}
//             textAnchor="middle"
//             dominantBaseline="middle"
//             fill="none"
//             // stroke="url(#strokeGrad)"
//             stroke="#000000"
//             strokeWidth={2 * scaleFactor}
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeDasharray="1200"
//             strokeDashoffset={strokeDashoffset}
//             fontSize={fontSize}
//             fontFamily="System"
//             letterSpacing={3}
//             opacity={strokeOpacity}
//           >
//             The Narrow Way
//           </AnimatedSvgText>

//           {/* final fill */}
//           <AnimatedSvgText
//             x={vbW / 2}
//             y={vbH / 2}
//             textAnchor="middle"
//             dominantBaseline="middle"
//             fill="#ffffff"
//             // fill="#000000"
//             fontSize={fontSize}
//             fontFamily="System"
//             letterSpacing={3}
//             opacity={fillOpacity}
//           >
//             The Narrow Way
//           </AnimatedSvgText>
//         </Svg>
//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   wrapper: {
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'visible',
//   },
// });

// src/components/AnimatedLogo.js
import React, { useEffect, useRef } from 'react';
import { Dimensions, Animated, Easing, View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Text as SvgText,
  Circle,
  G,
  Line,
} from 'react-native-svg';

const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

const { width: screenWidth } = Dimensions.get('window');

export default function AnimatedLogo({
  width = Math.min(screenWidth * 0.9, 520),
  height = 64,
  text = 'The Narrow Way',
  textColor = '#ffffff', // ← final fill color (white default)
  useGradient = true, // ← outline uses gradient if true
  strokeColor = '#ffffff', // ← outline color when gradient is off
}) {
  const strokeDashoffset = useRef(new Animated.Value(1200)).current;
  const strokeOpacity = useRef(new Animated.Value(0)).current;
  const fillOpacity = useRef(new Animated.Value(0)).current;
  const beamOpacity = useRef(new Animated.Value(0)).current;
  const beamCx = useRef(new Animated.Value(80)).current;
  const gridOpacity = useRef(new Animated.Value(0)).current;
  const rotateX = useRef(new Animated.Value(45)).current;
  const scale = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(gridOpacity, {
            toValue: 0.08,
            duration: 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(strokeOpacity, {
            toValue: 1,
            duration: 250,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(strokeDashoffset, {
            toValue: 0,
            duration: 2000,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
          }),
          Animated.timing(rotateX, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(beamOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(beamCx, {
            toValue: 720,
            duration: 1700,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(beamOpacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
          }),
          Animated.timing(fillOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: false,
          }),
        ]),
        Animated.delay(1200),
      ])
    );

    const reset = () => {
      strokeDashoffset.setValue(1200);
      strokeOpacity.setValue(0);
      fillOpacity.setValue(0);
      beamOpacity.setValue(0);
      beamCx.setValue(80);
      gridOpacity.setValue(0);
      rotateX.setValue(45);
      scale.setValue(0.94);
    };

    reset();
    loop.start();
    return () => loop.stop();
  }, [
    beamCx,
    beamOpacity,
    fillOpacity,
    gridOpacity,
    rotateX,
    scale,
    strokeDashoffset,
    strokeOpacity,
  ]);

  const rotateXDeg = rotateX.interpolate({
    inputRange: [0, 90],
    outputRange: ['0deg', '90deg'],
  });

  const vbW = 800;
  const vbH = 200;
  const scaleFactor = width / vbW;
  const fontSize = 64;

  return (
    <View style={[styles.wrapper, { height }]} pointerEvents="none">
      <Animated.View
        style={{
          transform: [{ perspective: 900 }, { rotateX: rotateXDeg }, { scale }],
        }}
      >
        <Svg width={width} height={height} viewBox={`0 0 ${vbW} ${vbH}`}>
          <Defs>
            {/* gradient for outline draw */}
            <LinearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
              <Stop offset="50%" stopColor="#93c5fd" stopOpacity="1" />
              <Stop offset="100%" stopColor="#dbeafe" stopOpacity="1" />
            </LinearGradient>
            {/* soft sweeping beam */}
            <RadialGradient id="beamGrad">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <Stop offset="55%" stopColor="#60a5fa" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* subtle grid */}
          <AnimatedG opacity={gridOpacity}>
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
          </AnimatedG>

          {/* sweeping beam */}
          <AnimatedCircle
            r="18"
            cy={vbH / 2}
            cx={beamCx}
            fill="url(#beamGrad)"
            opacity={beamOpacity}
          />

          {/* outline draw */}
          <AnimatedSvgText
            x={vbW / 2}
            y={vbH / 2}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="none"
            stroke={useGradient ? 'url(#strokeGrad)' : strokeColor} // ← gradient or solid
            strokeWidth={2 * scaleFactor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1200"
            strokeDashoffset={strokeDashoffset}
            fontSize={fontSize}
            fontFamily="System"
            letterSpacing={3}
            opacity={strokeOpacity}
          >
            {text}
          </AnimatedSvgText>

          {/* final fill */}
          <AnimatedSvgText
            x={vbW / 2}
            y={vbH / 2}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill={textColor} // ← final text color
            fontSize={fontSize}
            fontFamily="System"
            letterSpacing={3}
            opacity={fillOpacity}
          >
            {text}
          </AnimatedSvgText>
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
});
