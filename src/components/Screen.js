// import React from 'react';
// import { View, StyleSheet, Platform, StatusBar } from 'react-native';
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import { Colors } from '../constants/colors';
// import SunRays from './SunRays';

// const BASE_HEADER_HEIGHT = 56; // visual header height beneath the OS area

// export default function Screen({ children, showBack, onBack }) {
//   const navigation = useNavigation();
//   const insets = useSafeAreaInsets();

//   const canGoBack = navigation?.canGoBack?.() ?? false;
//   const shouldShowBack = typeof showBack === 'boolean' ? showBack : canGoBack;
//   // const handleBack = onBack || (() => navigation.goBack());

//   // Make Android status bar float over content for consistent math
//   // (iOS already handles this with safe areas)
//   React.useEffect(() => {
//     if (Platform.OS === 'android') {
//       StatusBar.setTranslucent(true);
//       StatusBar.setBackgroundColor('transparent');
//       StatusBar.setBarStyle?.('dark-content');
//     }
//   }, []);

//   const headerPaddingTop = insets.top; // OS area
//   const headerHeight = headerPaddingTop + BASE_HEADER_HEIGHT;

//   return (
//     <SafeAreaView style={styles.safe} edges={['left', 'right']}>
//       <View style={styles.container}>
//         <SunRays />

//         <View style={styles.content}>{children}</View>
//       </View>

//       {/* </View> */}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: Colors.background },
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     position: 'relative',
//   },
//   header: {
//     justifyContent: 'center',
//     alignItems: 'flex-end', // arrow on the right
//     paddingRight: 16,
//     // no overflow: hidden; let the sun glow peek
//     zIndex: 1,
//   },
//   content: { flex: 1, zIndex: 1 },
// });

// src/components/Screen.js
import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import SunRays from './SunRays';

const BASE_HEADER_HEIGHT = 56; // visual header height beneath the OS area

export default function Screen({
  children,
  showBack,
  onBack,
  keyboardOffset, // optional override if a screen has a taller custom header
  dismissOnTap = true, // tap background to dismiss keyboard
}) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const canGoBack = navigation?.canGoBack?.() ?? false;
  const shouldShowBack = typeof showBack === 'boolean' ? showBack : canGoBack;

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle?.('dark-content');
    }
  }, []);

  const headerPaddingTop = insets.top; // OS area (status bar / notch)
  const headerHeight = headerPaddingTop + BASE_HEADER_HEIGHT;

  // Offset the keyboard by your header so inputs aren't hidden beneath it.
  const kbo =
    typeof keyboardOffset === 'number' ? keyboardOffset : headerHeight;

  const body = (
    <View style={styles.container}>
      <SunRays pointerEvents="none" />
      <View style={styles.content}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={kbo}
      >
        {dismissOnTap ? (
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            {body}
          </TouchableWithoutFeedback>
        ) : (
          body
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    position: 'relative',
  },
  content: { flex: 1, zIndex: 1 },
});
