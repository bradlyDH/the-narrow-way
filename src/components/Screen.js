// // // // // src/components/Screen.js
// // // // import React from 'react';
// // // // import {
// // // //   View,
// // // //   StyleSheet,
// // // //   Platform,
// // // //   StatusBar,
// // // //   Keyboard,
// // // //   TouchableWithoutFeedback,
// // // //   KeyboardAvoidingView,
// // // // } from 'react-native';
// // // // import {
// // // //   SafeAreaView,
// // // //   useSafeAreaInsets,
// // // // } from 'react-native-safe-area-context';
// // // // import { useNavigation } from '@react-navigation/native';
// // // // import { Colors } from '../constants/colors';
// // // // import SunRays from './SunRays';

// // // // const BASE_HEADER_HEIGHT = 56; // visual header height beneath the OS area

// // // // export default function Screen({
// // // //   children,
// // // //   showBack,
// // // //   onBack,
// // // //   keyboardOffset, // optional override if a screen has a taller custom header
// // // //   dismissOnTap = true, // tap background to dismiss keyboard
// // // // }) {
// // // //   const navigation = useNavigation();
// // // //   const insets = useSafeAreaInsets();

// // // //   const canGoBack = navigation?.canGoBack?.() ?? false;
// // // //   const shouldShowBack = typeof showBack === 'boolean' ? showBack : canGoBack;

// // // //   React.useEffect(() => {
// // // //     if (Platform.OS === 'android') {
// // // //       StatusBar.setTranslucent(true);
// // // //       StatusBar.setBackgroundColor('transparent');
// // // //       StatusBar.setBarStyle?.('dark-content');
// // // //     }
// // // //   }, []);

// // // //   const headerPaddingTop = insets.top; // OS area (status bar / notch)
// // // //   const headerHeight = headerPaddingTop + BASE_HEADER_HEIGHT;

// // // //   // Offset the keyboard by your header so inputs aren't hidden beneath it.
// // // //   const kbo =
// // // //     typeof keyboardOffset === 'number' ? keyboardOffset : headerHeight;

// // // //   const body = (
// // // //     <View style={styles.container}>
// // // //       <SunRays pointerEvents="none" />
// // // //       <View style={styles.content}>{children}</View>
// // // //     </View>
// // // //   );

// // // //   return (
// // // //     <SafeAreaView style={styles.safe} edges={['left', 'right']}>
// // // //       <KeyboardAvoidingView
// // // //         style={{ flex: 1 }}
// // // //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // // //         keyboardVerticalOffset={kbo}
// // // //       >
// // // //         {dismissOnTap ? (
// // // //           <TouchableWithoutFeedback
// // // //             onPress={Keyboard.dismiss}
// // // //             accessible={false}
// // // //           >
// // // //             {body}
// // // //           </TouchableWithoutFeedback>
// // // //         ) : (
// // // //           body
// // // //         )}
// // // //       </KeyboardAvoidingView>
// // // //     </SafeAreaView>
// // // //   );
// // // // }

// // // // const styles = StyleSheet.create({
// // // //   safe: { flex: 1, backgroundColor: Colors.background },
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: Colors.background,
// // // //     position: 'relative',
// // // //   },
// // // //   content: { flex: 1, zIndex: 1 },
// // // // });

// // // // src/components/Screen.js
// // // import React from 'react';
// // // import {
// // //   View,
// // //   StyleSheet,
// // //   Platform,
// // //   StatusBar,
// // //   Keyboard,
// // //   KeyboardAvoidingView,
// // //   Pressable,
// // // } from 'react-native';
// // // import {
// // //   SafeAreaView,
// // //   useSafeAreaInsets,
// // // } from 'react-native-safe-area-context';
// // // import { useNavigation } from '@react-navigation/native';
// // // import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
// // // import { Colors } from '../constants/colors';
// // // import SunRays from './SunRays';

// // // // Match AppHeader.styles.container.height
// // // const BASE_HEADER_HEIGHT = 76; // visual header height beneath the OS area
// // // const FLOAT_GAP = 16; // your tab bar's bottom offset

// // // export default function Screen({
// // //   children,
// // //   showBack,
// // //   onBack,
// // //   keyboardOffset, // optional override if a screen has a taller custom header
// // //   dismissOnTap = true, // tap empty background to dismiss keyboard
// // // }) {
// // //   const navigation = useNavigation();
// // //   const insets = useSafeAreaInsets();
// // //   const tabBarHeight = useBottomTabBarHeight?.() ?? 0; // 0 when not inside a Tab

// // //   const canGoBack = navigation?.canGoBack?.() ?? false;
// // //   const shouldShowBack = typeof showBack === 'boolean' ? showBack : canGoBack;

// // //   React.useEffect(() => {
// // //     if (Platform.OS === 'android') {
// // //       StatusBar.setTranslucent(true);
// // //       StatusBar.setBackgroundColor('transparent');
// // //       StatusBar.setBarStyle?.('dark-content');
// // //     }
// // //   }, []);

// // //   const headerPaddingTop = insets.top; // OS area (status bar / notch)
// // //   const headerHeight = headerPaddingTop + BASE_HEADER_HEIGHT;

// // //   // Offset the keyboard by your header so inputs aren't hidden beneath it.
// // //   const kbo =
// // //     typeof keyboardOffset === 'number' ? keyboardOffset : headerHeight;

// // //   // tabBarHeight already includes insets.bottom on iOS.
// // //   // Give content enough room above the floating pill WITHOUT double-counting the inset:
// // //   const extraBottom =
// // //     tabBarHeight > 0
// // //       ? Math.max(0, tabBarHeight - insets.bottom) + FLOAT_GAP
// // //       : 0;

// // //   // Push content below the always-on AppHeader, and fill bottom inset
// // //   const containerStyle = React.useMemo(
// // //     () => [
// // //       styles.container,
// // //       {
// // //         paddingTop: headerHeight,
// // //         // Safe-area + (tab bar height + its floating gap) when inside a tab
// // //         paddingBottom: insets.bottom + extraBottom,
// // //       },
// // //     ],
// // //     [headerHeight, insets.bottom, tabBarHeight, extraBottom]
// // //   );

// // //   return (
// // //     // include bottom so background color paints into the nav bar area
// // //     <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
// // //       <KeyboardAvoidingView
// // //         style={{ flex: 1 }}
// // //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // //         keyboardVerticalOffset={kbo}
// // //       >
// // //         <View style={containerStyle}>
// // //           {/* Animated background, never intercept touches */}
// // //           <SunRays pointerEvents="none" />

// // //           {/* Background-only tap catcher: doesn't block scroll/pan on children */}
// // //           {dismissOnTap && (
// // //             <Pressable
// // //               style={StyleSheet.absoluteFill}
// // //               pointerEvents="box-only"
// // //               onPress={Keyboard.dismiss}
// // //             />
// // //           )}

// // //           {/* Actual screen content (your ScrollView / lists go here) */}
// // //           <View style={styles.content}>{children}</View>
// // //         </View>
// // //       </KeyboardAvoidingView>
// // //     </SafeAreaView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   safe: { flex: 1, backgroundColor: Colors.background },
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: Colors.background,
// // //     position: 'relative',
// // //   },
// // //   content: { flex: 1, zIndex: 1 },
// // // });

// // // src/components/Screen.js
// // import React from 'react';
// // import {
// //   View,
// //   StyleSheet,
// //   Platform,
// //   StatusBar,
// //   Keyboard,
// //   KeyboardAvoidingView,
// //   Pressable,
// // } from 'react-native';
// // import {
// //   SafeAreaView,
// //   useSafeAreaInsets,
// // } from 'react-native-safe-area-context';
// // import { useNavigation } from '@react-navigation/native';
// // import { Colors } from '../constants/colors';
// // import SunRays from './SunRays';

// // // Match AppHeader.styles.container.height
// // const BASE_HEADER_HEIGHT = 76;

// // export default function Screen({
// //   children,
// //   showBack,
// //   onBack,
// //   keyboardOffset,
// //   dismissOnTap = true,
// // }) {
// //   const navigation = useNavigation();
// //   const insets = useSafeAreaInsets();

// //   React.useEffect(() => {
// //     if (Platform.OS === 'android') {
// //       StatusBar.setTranslucent(true);
// //       StatusBar.setBackgroundColor('transparent');
// //       StatusBar.setBarStyle?.('dark-content');
// //     }
// //   }, []);

// //   const headerHeight = insets.top + BASE_HEADER_HEIGHT;
// //   const kbo =
// //     typeof keyboardOffset === 'number' ? keyboardOffset : headerHeight;

// //   const containerStyle = React.useMemo(
// //     () => [
// //       styles.container,
// //       {
// //         paddingTop: headerHeight,
// //         paddingBottom: insets.bottom, // just safe area, tab bar is in layout now
// //       },
// //     ],
// //     [headerHeight, insets.bottom]
// //   );

// //   return (
// //     <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
// //       <KeyboardAvoidingView
// //         style={{ flex: 1 }}
// //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //         keyboardVerticalOffset={kbo}
// //       >
// //         <View style={containerStyle}>
// //           <SunRays pointerEvents="none" />

// //           {dismissOnTap && (
// //             <Pressable
// //               style={StyleSheet.absoluteFill}
// //               pointerEvents="box-only"
// //               onPress={Keyboard.dismiss}
// //             />
// //           )}

// //           <View style={styles.content}>{children}</View>
// //         </View>
// //       </KeyboardAvoidingView>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   safe: { flex: 1, backgroundColor: Colors.background },
// //   container: {
// //     flex: 1,
// //     backgroundColor: Colors.background,
// //     position: 'relative',
// //   },
// //   content: { flex: 1, zIndex: 1 },
// // });

// // // src/components/Screen.js
// // import React from 'react';
// // import {
// //   View,
// //   StyleSheet,
// //   Platform,
// //   StatusBar,
// //   Keyboard,
// //   KeyboardAvoidingView,
// //   Pressable,
// // } from 'react-native';
// // import {
// //   SafeAreaView,
// //   useSafeAreaInsets,
// // } from 'react-native-safe-area-context';
// // import { useNavigation } from '@react-navigation/native';
// // import { Colors } from '../constants/colors';
// // import SunRays from './SunRays';

// // const BASE_HEADER_HEIGHT = 76; // match AppHeader height

// // export default function Screen({
// //   children,
// //   showBack,
// //   onBack,
// //   keyboardOffset,
// //   dismissOnTap = true,
// // }) {
// //   const navigation = useNavigation();
// //   const insets = useSafeAreaInsets();

// //   React.useEffect(() => {
// //     if (Platform.OS === 'android') {
// //       StatusBar.setTranslucent(true);
// //       StatusBar.setBackgroundColor('transparent');
// //       StatusBar.setBarStyle?.('dark-content');
// //     }
// //   }, []);

// //   const headerHeight = insets.top + BASE_HEADER_HEIGHT;
// //   const kbo =
// //     typeof keyboardOffset === 'number' ? keyboardOffset : headerHeight;

// //   const containerStyle = React.useMemo(
// //     () => [
// //       styles.container,
// //       {
// //         paddingTop: headerHeight,
// //         // 🔑 no bottom padding here – tab navigator handles bottom inset
// //         paddingBottom: 0,
// //       },
// //     ],
// //     [headerHeight]
// //   );

// //   return (
// //     // 🔑 do NOT claim the bottom safe area here; let Tab.Navigator own it
// //     <SafeAreaView style={styles.safe} edges={['left', 'right']}>
// //       <KeyboardAvoidingView
// //         style={{ flex: 1 }}
// //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //         keyboardVerticalOffset={kbo}
// //       >
// //         <View style={containerStyle}>
// //           <SunRays pointerEvents="none" />

// //           {dismissOnTap && (
// //             <Pressable
// //               style={StyleSheet.absoluteFill}
// //               pointerEvents="box-only"
// //               onPress={Keyboard.dismiss}
// //             />
// //           )}

// //           <View style={styles.content}>{children}</View>
// //         </View>
// //       </KeyboardAvoidingView>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   safe: { flex: 1, backgroundColor: Colors.background },
// //   container: {
// //     flex: 1,
// //     backgroundColor: Colors.background,
// //     position: 'relative',
// //   },
// //   content: { flex: 1, zIndex: 1 },
// // });

// // src/components/Screen.js
// import React from 'react';
// import {
//   View,
//   StyleSheet,
//   Platform,
//   StatusBar,
//   Keyboard,
//   KeyboardAvoidingView,
//   Pressable,
// } from 'react-native';
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import { Colors } from '../constants/colors';
// import SunRays from './SunRays';

// const BASE_HEADER_HEIGHT = 76; // match AppHeader height

// export default function Screen({
//   children,
//   showBack, // (kept for parity; not used here)
//   onBack, // (kept for parity; not used here)
//   keyboardOffset, // optional extra offset if you need it
//   dismissOnTap = true,
// }) {
//   const navigation = useNavigation();
//   const insets = useSafeAreaInsets();

//   React.useEffect(() => {
//     if (Platform.OS === 'android') {
//       StatusBar.setTranslucent(true);
//       StatusBar.setBackgroundColor('transparent');
//       StatusBar.setBarStyle?.('dark-content');
//     }
//   }, []);

//   // We don't claim bottom inset here — tabs own it.
//   // We *do* respect the top inset to sit below any notch/statusbar.
//   const headerHeight = insets.top + BASE_HEADER_HEIGHT;
//   const kbo =
//     typeof keyboardOffset === 'number' ? keyboardOffset : headerHeight;

//   const containerStyle = React.useMemo(
//     () => [
//       styles.container,
//       {
//         // Your background stays intact
//         paddingTop: headerHeight,
//         // 🔑 no bottom padding here – Tab Navigator owns bottom space
//         paddingBottom: 0,
//       },
//     ],
//     [headerHeight]
//   );

//   return (
//     // 🔑 Do NOT claim bottom safe area here; avoids a lingering white slab
//     <SafeAreaView style={styles.safe} edges={['left', 'right']}>
//       <KeyboardAvoidingView
//         style={styles.kav}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={kbo}
//       >
//         <View style={containerStyle}>
//           {/* Background / decorative layer */}
//           <SunRays pointerEvents="none" style={StyleSheet.absoluteFill} />

//           {/* Optional global tap-to-dismiss overlay */}
//           {dismissOnTap && (
//             <Pressable
//               style={StyleSheet.absoluteFill}
//               pointerEvents="box-only"
//               onPress={Keyboard.dismiss}
//             />
//           )}

//           {/* Foreground content (your screens) */}
//           <View style={styles.content}>{children}</View>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: Colors.background, // ✅ keep your app background
//   },
//   kav: {
//     flex: 1,
//     backgroundColor: Colors.background, // ✅ protect background during KAV shifts
//   },
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background, // ✅ consistent with your theme
//     position: 'relative',
//   },
//   content: {
//     flex: 1,
//     zIndex: 1,
//     // no extra background here; let parent show through
//   },
// });

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
