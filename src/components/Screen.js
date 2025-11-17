// src/components/Screen.js
import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Keyboard,
  Pressable,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import SunRays from './SunRays';

const BASE_HEADER_HEIGHT = 76; // match AppHeader height

export default function Screen({
  children,
  showBack,
  onBack,
  keyboardOffset,
  dismissOnTap = true,
}) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle?.('dark-content');
    }
  }, []);

  const headerHeight = insets.top + BASE_HEADER_HEIGHT;
  const kbo =
    typeof keyboardOffset === 'number' ? keyboardOffset : headerHeight;

  const containerStyle = React.useMemo(
    () => [
      styles.container,
      {
        paddingTop: headerHeight,
        paddingBottom: 0, // Tab bar owns bottom space
      },
    ],
    [headerHeight]
  );

  // ---- ANDROID: no KeyboardAvoidingView (when using resize mode)
  if (Platform.OS === 'android') {
    return (
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <View style={containerStyle}>
          <SunRays pointerEvents="none" style={StyleSheet.absoluteFill} />
          {dismissOnTap && (
            <Pressable
              style={StyleSheet.absoluteFill}
              pointerEvents="box-only"
              onPress={Keyboard.dismiss}
            />
          )}
          <View style={styles.content}>{children}</View>
        </View>
      </SafeAreaView>
    );
  }

  // ---- iOS: keep KAV padding
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={[styles.kavShim, { paddingBottom: 0 }]}>
        <View style={[containerStyle, { paddingTop: kbo }]}>
          <SunRays pointerEvents="none" style={StyleSheet.absoluteFill} />
          {dismissOnTap && (
            <Pressable
              style={StyleSheet.absoluteFill}
              pointerEvents="box-only"
              onPress={Keyboard.dismiss}
            />
          )}
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  // acts like a simple KAV: iOS uses extra top padding (kbo), Android bypasses
  kavShim: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    position: 'relative',
  },
  content: { flex: 1, zIndex: 1 },
});
