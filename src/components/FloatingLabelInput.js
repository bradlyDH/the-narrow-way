import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, TextInput, Animated, StyleSheet } from 'react-native';

export default function FloatingLabelInput({
  label,
  value,
  onChangeText,
  multiline = false,
  autoGrow = true, // NEW: auto expand to fit content
  minLines = 3, // NEW: minimum lines when multiline
  maxLines,
  inputStyle,
  containerStyle,
  ...rest
}) {
  const focused = useRef(false);
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const baseLineHeight = 20; // keep in sync with styles.multiline.lineHeight
  const verticalPadding = 4; // from styles.multiline.paddingTop (simplified)
  const lineHeight =
    (inputStyle?.lineHeight ?? styles.multiline.lineHeight) || baseLineHeight;

  // Compute min/max heights from line counts
  const minHeight = useMemo(
    () =>
      multiline
        ? Math.max(110, minLines * lineHeight + verticalPadding * 2)
        : 48,
    [multiline, minLines, lineHeight]
  );
  const maxHeight = useMemo(
    () =>
      multiline && maxLines
        ? maxLines * lineHeight + verticalPadding * 2
        : undefined,
    [multiline, maxLines, lineHeight]
  );

  const [contentHeight, setContentHeight] = useState(minHeight);

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

  // Height style if autoGrow is enabled
  const dynamicHeightStyle =
    multiline && autoGrow
      ? {
          height: Math.max(
            minHeight,
            Math.min(maxHeight ?? Number.MAX_SAFE_INTEGER, contentHeight)
          ),
        }
      : {};

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.Text
        style={[
          styles.label,
          {
            top: labelTop,
            fontSize: labelSize,
            opacity: labelOpacity,
          },
        ]}
        pointerEvents="none"
      >
        {label}
      </Animated.Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => {
          focused.current = true;
          Animated.timing(anim, {
            toValue: 1,
            duration: 140,
            useNativeDriver: false,
          }).start();
        }}
        onBlur={() => {
          focused.current = false;
          Animated.timing(anim, {
            toValue: value ? 1 : 0,
            duration: 140,
            useNativeDriver: false,
          }).start();
        }}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'auto'}
        style={[styles.input, multiline && styles.multiline, inputStyle]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#e9eef3',
    borderRadius: 12,
    minHeight: 48,
    paddingTop: 18, // room for label
    paddingHorizontal: 14,
  },
  label: {
    position: 'absolute',
    left: 14,
    color: '#6b7b8c',
    fontWeight: '700',
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
    minHeight: 110,
    paddingTop: 4,
    lineHeight: 20,
  },
});
