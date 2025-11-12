// // src/components/FloatingLabelInput.js
// import React, { useEffect, useRef, useState, useMemo } from 'react';
// import { View, TextInput, Animated, StyleSheet, Platform } from 'react-native';

// export default function FloatingLabelInput({
//   label,
//   value,
//   onChangeText,
//   multiline = false,
//   autoGrow = true, // expand to fit content
//   minLines = 3,
//   maxLines, // optional cap; if hit, the input becomes scrollable
//   inputStyle,
//   containerStyle,
//   ...rest
// }) {
//   const focused = useRef(false);
//   const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

//   useEffect(() => {
//     Animated.timing(anim, {
//       toValue: focused.current || !!value ? 1 : 0,
//       duration: 160,
//       useNativeDriver: false,
//     }).start();
//   }, [value]);

//   const labelTop = anim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [18, 6],
//   });
//   const labelSize = anim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [16, 12],
//   });
//   const labelOpacity = anim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.6, 1],
//   });

//   // --- sizing for multiline ---
//   const baseFontSize = inputStyle?.fontSize ?? styles.input.fontSize;
//   const baseLineHeight = inputStyle?.lineHeight ?? styles.multiline.lineHeight; // 20
//   const topPadding = styles.container.paddingTop; // 18 (room for label)
//   const verticalPadding = styles.multiline.paddingTop ?? 0; // 4

//   const lineHeight = Math.max(baseLineHeight, baseFontSize + 2);
//   const minHeight = useMemo(
//     () =>
//       multiline
//         ? Math.max(110, minLines * lineHeight + verticalPadding + 4)
//         : 48,
//     [multiline, minLines, lineHeight, verticalPadding]
//   );
//   const maxHeight = useMemo(
//     () =>
//       multiline && maxLines
//         ? maxLines * lineHeight + verticalPadding + 4
//         : undefined,
//     [multiline, maxLines, lineHeight, verticalPadding]
//   );

//   const [contentHeight, setContentHeight] = useState(minHeight);

//   const dynamicHeightStyle =
//     multiline && autoGrow
//       ? {
//           height: Math.max(
//             minHeight,
//             Math.min(maxHeight ?? Number.MAX_SAFE_INTEGER, contentHeight)
//           ),
//         }
//       : {};

//   // when the text layout changes, grow/shrink
//   const handleContentSizeChange = (e) => {
//     if (!multiline) return;
//     const h = e?.nativeEvent?.contentSize?.height ?? 0;
//     // iOS needs a tiny buffer, Android is fine; add + topPadding to avoid label overlap
//     const buffer = Platform.OS === 'ios' ? 6 : 2;
//     setContentHeight(Math.ceil(h + buffer));
//   };

//   return (
//     <View style={[styles.container, containerStyle]}>
//       <Animated.Text
//         style={[
//           styles.label,
//           { top: labelTop, fontSize: labelSize, opacity: labelOpacity },
//         ]}
//         pointerEvents="none"
//       >
//         {label}
//       </Animated.Text>

//       <TextInput
//         value={value}
//         onChangeText={onChangeText}
//         onContentSizeChange={handleContentSizeChange}
//         onFocus={() => {
//           focused.current = true;
//           Animated.timing(anim, {
//             toValue: 1,
//             duration: 140,
//             useNativeDriver: false,
//           }).start();
//         }}
//         onBlur={() => {
//           focused.current = false;
//           Animated.timing(anim, {
//             toValue: value ? 1 : 0,
//             duration: 140,
//             useNativeDriver: false,
//           }).start();
//         }}
//         multiline={multiline}
//         // prevent internal clipping; let the input grow until maxLines, then scroll
//         scrollEnabled={
//           multiline &&
//           !!maxLines &&
//           !!autoGrow &&
//           contentHeight >= (maxHeight ?? 0)
//         }
//         textAlignVertical={multiline ? 'top' : 'auto'}
//         style={[
//           styles.input,
//           multiline && styles.multiline,
//           inputStyle,
//           dynamicHeightStyle, // <-- APPLY IT HERE
//         ]}
//         {...rest}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     position: 'relative',
//     backgroundColor: '#e9eef3',
//     borderRadius: 12,
//     minHeight: 48,
//     paddingTop: 18, // room for label
//     paddingHorizontal: 14,
//   },
//   label: {
//     position: 'absolute',
//     left: 14,
//     color: '#6b7b8c',
//     fontWeight: '700',
//   },
//   input: {
//     color: '#1b2140',
//     fontWeight: '700',
//     fontSize: 16,
//     padding: 0,
//     margin: 0,
//     minHeight: 28,
//   },
//   multiline: {
//     minHeight: 110,
//     paddingTop: 4,
//     lineHeight: 20, // keep >= fontSize + 2
//   },
// });

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
  ...rest
}) {
  const focused = useRef(false);
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

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

  // animate floating label
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

  // >>> IMPORTANT: apply computed height to the TextInput when autoGrow
  const dynamicHeightStyle =
    multiline && autoGrow
      ? {
          // clamp between minHeight and maxHeight (if provided)
          height: Math.max(
            minHeight,
            Math.min(maxHeight ?? Number.POSITIVE_INFINITY, contentHeight)
          ),
        }
      : {};

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.Text
        style={[
          styles.label,
          { top: labelTop, fontSize: labelSize, opacity: labelOpacity },
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
        // >>> IMPORTANT: let the input expand instead of scrolling internally
        scrollEnabled={multiline ? !autoGrow : false}
        textAlignVertical={multiline ? 'top' : 'auto'}
        // >>> IMPORTANT: update height when content size changes
        onContentSizeChange={(e) => {
          if (!multiline || !autoGrow) return;
          const h = e?.nativeEvent?.contentSize?.height ?? 0;
          // add a tiny buffer to avoid oscillation on Android
          const padded = h + (Platform.OS === 'android' ? 2 : 0);
          setContentHeight(padded);
        }}
        // iOS sometimes needs this to calculate height correctly when wrapping
        enablesReturnKeyAutomatically={true}
        underlineColorAndroid="transparent"
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
    // base sizes; actual height is driven by dynamicHeightStyle
    lineHeight: 20,
    paddingTop: 4,
    // make sure it uses full width
    alignSelf: 'stretch',
  },
});
