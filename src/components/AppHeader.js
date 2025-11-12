// // // // // // // // src/components/AppHeader.js
// // // // // // // import React from 'react';
// // // // // // // import { View, Text, StyleSheet } from 'react-native';
// // // // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // // // import AnimatedLogo from '../components/AnimatedLogo';

// // // // // // // /**
// // // // // // //  * Small app-wide header that simply shows the title.
// // // // // // //  * No back arrow; works on all screens.
// // // // // // //  */
// // // // // // // export default function AppHeader() {
// // // // // // //   return (
// // // // // // //     // <SafeAreaView edges={['top']} style={styles.safeTop}>
// // // // // // //     //   <View style={styles.container}>
// // // // // // //     //     <Text style={styles.title}>The Narrow Way</Text>
// // // // // // //     //   </View>
// // // // // // //     // </SafeAreaView>

// // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // //       <AnimatedLogo />
// // // // // // //     </SafeAreaView>
// // // // // // //   );
// // // // // // // }

// // // // // // // const styles = StyleSheet.create({
// // // // // // //   safeTop: {
// // // // // // //     backgroundColor: 'transparent',
// // // // // // //   },
// // // // // // //   container: {
// // // // // // //     paddingHorizontal: 16,
// // // // // // //     paddingBottom: 20,
// // // // // // //     paddingTop: 10,
// // // // // // //     justifyContent: 'center',
// // // // // // //     alignItems: 'center',
// // // // // // //   },
// // // // // // //   title: {
// // // // // // //     fontSize: 24,
// // // // // // //     fontWeight: '800',
// // // // // // //     color: '#000',
// // // // // // //   },
// // // // // // // });

// // // // // // // src/components/AppHeader.js
// // // // // // import React from 'react';
// // // // // // import { View, StyleSheet } from 'react-native';
// // // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // // import AnimatedLogo from '../components/AnimatedLogo';

// // // // // // export default function AppHeader() {
// // // // // //   return (
// // // // // //     <SafeAreaView edges={['top']} style={styles.safe}>
// // // // // //       <View style={styles.container}>
// // // // // //         <AnimatedLogo
// // // // // //           height={68}
// // // // // //           // textColor="#fff"
// // // // // //           // strokeColor="#fff"
// // // // // //           // useGradient={false}
// // // // // //         />
// // // // // //       </View>
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // }

// // // // // // const styles = StyleSheet.create({
// // // // // //   safeTop: {
// // // // // //     backgroundColor: '#fff',
// // // // // //   },
// // // // // //   container: {
// // // // // //     backgroundColor: '#fff',
// // // // // //     height: 60, // clean, predictable header height
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // // });

// // // // // // src/components/AppHeader.js
// // // // // import React from 'react';
// // // // // import { View, StyleSheet, useColorScheme } from 'react-native';
// // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // import AnimatedLogo from '../components/AnimatedLogo';

// // // // // export default function AppHeader() {
// // // // //   const scheme = useColorScheme();
// // // // //   const isDark = scheme === 'dark';

// // // // //   // Choose a background. Dark -> black-ish so the logo renders white.
// // // // //   const bg = isDark ? '#0B0F1A' : '#FFFFFF';

// // // // //   return (
// // // // //     <SafeAreaView
// // // // //       edges={['top']}
// // // // //       style={[styles.safeTop, { backgroundColor: bg }]}
// // // // //     >
// // // // //       <View style={[styles.container, { backgroundColor: bg }]}>
// // // // //         <AnimatedLogo
// // // // //           height={68}
// // // // //           // You can force colors if you want to override theme:
// // // // //           // textColor="#000"
// // // // //           // strokeColor="#fff"
// // // // //           // useGradient={false}
// // // // //         />
// // // // //       </View>
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({
// // // // //   safeTop: {
// // // // //     // backgroundColor set dynamically
// // // // //   },
// // // // //   container: {
// // // // //     // Give the logo room (>= logo height)
// // // // //     height: 72,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // // });

// // // // // src/components/AppHeader.js
// // // // import React from 'react';
// // // // import { View, StyleSheet, useColorScheme } from 'react-native';
// // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // import AnimatedLogo from './AnimatedLogo'; // same folder

// // // // export default function AppHeader() {
// // // //   const scheme = useColorScheme();
// // // //   const isDark = scheme === 'dark';
// // // //   const bg = isDark ? '#0B0F1A' : '#FFFFFF';

// // // //   return (
// // // //     <SafeAreaView
// // // //       edges={['top']}
// // // //       style={[styles.safeTop, { backgroundColor: bg }]}
// // // //     >
// // // //       <View style={[styles.container, { backgroundColor: bg }]}>
// // // //         <AnimatedLogo
// // // //           height={68}
// // // //           textColor="#ff00ff"
// // // //           strokeColor="#000000"
// // // //           useGradient={false}
// // // //           enableStrokeDraw={false}
// // // //         />
// // // //       </View>
// // // //     </SafeAreaView>
// // // //   );
// // // // }

// // // // const styles = StyleSheet.create({
// // // //   safeTop: {
// // // //     // backgroundColor is set dynamically
// // // //   },
// // // //   container: {
// // // //     // height >= logo height to avoid clipping
// // // //     height: 72,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // // });

// // // // src/components/AppHeader.js
// // // import React from 'react';
// // // import { View, StyleSheet } from 'react-native';
// // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // import AnimatedLogo from './AnimatedLogo';

// // // export default function AppHeader() {
// // //   const bg = '#000000'; // force BLACK so white text is visible

// // //   return (
// // //     <SafeAreaView
// // //       edges={['top']}
// // //       style={[styles.safeTop, { backgroundColor: bg }]}
// // //     >
// // //       <View style={[styles.container, { backgroundColor: bg }]}>
// // //         <AnimatedLogo
// // //           height={68}
// // //           text="The Narrow Way"
// // //           textColor="#FFFFFF" // white fill
// // //           strokeColor="#FFFFFF" // white outline
// // //           useGradient={false} // solid stroke (no blue gradient)
// // //           showGrid={false} // optional
// // //           showBeam={true} // you saw this working already
// // //           enableStrokeDraw={false} // keep off until text is confirmed
// // //           safeMode={true} // ✅ keep safe until confirmed visible
// // //         />
// // //       </View>
// // //     </SafeAreaView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   safeTop: {},
// // //   container: {
// // //     height: 72, // ≥ logo height
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // // });

// // // src/components/AppHeader.js
// // import React from 'react';
// // import { View, StyleSheet } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import AnimatedLogo from './AnimatedLogo';

// // export default function AppHeader() {
// //   const bg = '#000000'; // black header

// //   return (
// //     <SafeAreaView
// //       edges={['top']}
// //       style={[styles.safeTop, { backgroundColor: bg }]}
// //     >
// //       <View style={[styles.container, { backgroundColor: bg }]}>
// //         <AnimatedLogo
// //           height={68}
// //           text="The Narrow Way"
// //           textColor="#FFFFFF"
// //           strokeColor="#FFFFFF"
// //           useGradient={false}
// //           showGrid={false}
// //           showBeam={true}
// //           enableStrokeDraw={false}
// //           safeMode={true}
// //         />
// //       </View>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   safeTop: {},
// //   container: {
// //     height: 72,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// // });

// // src/components/AppHeader.js
// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import AnimatedLogo from './AnimatedLogo';

// export default function AppHeader() {
//   const bg = '#000000'; // black header for high contrast

//   return (
//     <SafeAreaView
//       edges={['top']}
//       style={[styles.safeTop, { backgroundColor: bg }]}
//     >
//       <View style={[styles.container, { backgroundColor: bg }]}>
//         // AppHeader.js // src/components/AppHeader.js
//         <AnimatedLogo
//           height={68}
//           text="The Narrow Way"
//           textColor="#FFFFFF"
//           strokeColor="#FFFFFF"
//           bgColor="#000000" // <- must match header background
//           useGradient={false}
//           showGrid={true}
//           showBeam={true}
//           revealDurationMs={1500}
//           loopDelayMs={900}
//         />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeTop: {},
//   container: {
//     height: 72,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// src/components/AppHeader.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedLogo from '../components/AnimatedLogo';
import SunRays from '../components/SunRays';

export default function AppHeader() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeTop}>
      <View style={styles.container}>
        <SunRays />
        <AnimatedLogo
          height={80}
          text="The Narrow Way"
          textColor="#fff"
          strokeColor="#fff"
          glowColor="#90CAF9"
          useGradient={false}
          showGrid={false}
          showBeam={true}
          showGlow={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeTop: {
    backgroundColor: '#fff', // header background
  },
  container: {
    // backgroundColor: '#000', // match bgColor in AnimatedLogo
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
});
