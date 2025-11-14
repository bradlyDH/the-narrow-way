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
  strokeColor = '#c9f64cff',
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
