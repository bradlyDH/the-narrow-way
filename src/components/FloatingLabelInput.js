// src/components/FloatingLabelInput.js
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, TextInput, Animated, StyleSheet, Platform } from 'react-native';

export default function FloatingLabelInput({
  label,
  value,
  onChangeText,
  multiline = false,
  autoGrow = true, // expand to fit content
  minLines = 3,
  maxLines, // optional visual cap
  inputStyle,
  containerStyle,
  placeholder,
  placeholderTextColor = 'rgba(0,0,0,0.35)',
  // ✨ NEW: customizable animated label colors
  labelColorRest = '#6b7b8c',
  labelColorFocused = '#010312ff',
  scrollEnabled: scrollEnabledProp,
  ...rest
}) {
  const focused = useRef(false);
  const [isFocused, setIsFocused] = useState(false);
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const { scrollEnabled: scrollEnabedProp, ...inputRest } = rest;

  // keep in sync with styles.multiline.lineHeight
  const baseLineHeight = 20;
  const verticalPad = 12; // padding + label clearance buffer

  // figure out the effective lineHeight (allow override via inputStyle)
  const lineHeight =
    (inputStyle?.lineHeight ?? styles.multiline.lineHeight) || baseLineHeight;

  const minHeight = useMemo(
    () => (multiline ? Math.max(minLines * lineHeight + verticalPad, 110) : 48),
    [multiline, minLines, lineHeight]
  );

  const maxHeight = useMemo(
    () =>
      multiline && maxLines ? maxLines * lineHeight + verticalPad : undefined,
    [multiline, maxLines, lineHeight]
  );

  const [contentHeight, setContentHeight] = useState(minHeight);

  // animate floating label (position/size/opacity)
  useEffect(() => {
    Animated.timing(anim, {
      toValue: focused.current || !!value ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const labelTop = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 6],
  });
  const labelSize = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });
  const labelOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  // ✨ NEW: animate label color between rest ↔ focused
  const labelColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      hexToRgbString(labelColorRest),
      hexToRgbString(labelColorFocused),
    ],
  });

  // >>> IMPORTANT: apply computed height to the TextInput when autoGrow
  const dynamicHeightStyle =
    multiline && autoGrow
      ? {
          height: Math.max(
            minHeight,
            Math.min(maxHeight ?? Number.POSITIVE_INFINITY, contentHeight)
          ),
        }
      : {};

  // Only show placeholder when focused AND empty (prevents overlap with floating label)
  const effectivePlaceholder = useMemo(
    () => (isFocused && !value ? placeholder : undefined),
    [isFocused, value, placeholder]
  );

  const effectiveScrollEnabled =
    typeof scrollEnabledProp === 'boolean'
      ? scrollEnabledProp
      : multiline
      ? !autoGrow
      : false;

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.Text
        style={[
          styles.label,
          {
            top: labelTop,
            fontSize: labelSize,
            opacity: labelOpacity,
            color: labelColor, // ✨ animated color
          },
        ]}
        pointerEvents="none"
        numberOfLines={1}
      >
        {label}
      </Animated.Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => {
          focused.current = true;
          setIsFocused(true);
          Animated.timing(anim, {
            toValue: 1,
            duration: 140,
            useNativeDriver: false,
          }).start();
        }}
        onBlur={() => {
          focused.current = false;
          setIsFocused(false);
          Animated.timing(anim, {
            toValue: value ? 1 : 0,
            duration: 140,
            useNativeDriver: false,
          }).start();
        }}
        multiline={multiline}
        // let the input expand instead of scrolling internally
        scrollEnabled={effectiveScrollEnabled}
        textAlignVertical={multiline ? 'top' : 'auto'}
        onContentSizeChange={(e) => {
          if (!multiline || !autoGrow) return;
          const h = e?.nativeEvent?.contentSize?.height ?? 0;
          const padded = h + (Platform.OS === 'android' ? 2 : 0);
          setContentHeight(padded);
        }}
        enablesReturnKeyAutomatically={true}
        underlineColorAndroid="transparent"
        placeholder={effectivePlaceholder}
        placeholderTextColor={placeholderTextColor}
        style={[
          styles.input,
          multiline && styles.multiline,
          inputStyle,
          dynamicHeightStyle, // <<< APPLY height here
        ]}
        {...rest}
      />
    </View>
  );
}

// Helper: ensure Animated can interpolate color strings reliably
function hexToRgbString(hex) {
  // supports '#rrggbb' or '#rgb'
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#e9eef3',
    borderRadius: 12,
    minHeight: 48,
    paddingTop: 18, // room for the floating label
    paddingHorizontal: 14,
  },
  label: {
    position: 'absolute',
    left: 14,
    fontWeight: '700',
    // If you ever see overlap artifacts, uncomment next line so label "cuts" through
    // backgroundColor: '#e9eef3',
  },
  input: {
    color: '#1b2140',
    fontWeight: '700',
    fontSize: 16,
    padding: 0,
    margin: 0,
    minHeight: 28,
  },
  multiline: {
    lineHeight: 20,
    paddingTop: 4,
    alignSelf: 'stretch',
  },
});
