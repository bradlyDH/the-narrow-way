// // src/components/AppHeader.js
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { Colors } from '../constants/colors';

// export default function AppHeader() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>The Narrow Way</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//     paddingTop: 0, // safe area + spacing
//     paddingBottom: 12,
//     paddingHorizontal: 16,
//     backgroundColor: 'transparent', // keeps your gradient visible
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '#fff',
//   },
// });

// // src/components/AppHeader.js
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import AnimatedLogo from '../components/AnimatedLogo';

// /**
//  * Small app-wide header that simply shows the title.
//  * No back arrow; works on all screens.
//  */
// export default function AppHeader() {
//   return (
//     // <SafeAreaView edges={['top']} style={styles.safeTop}>
//     //   <View style={styles.container}>
//     //     <Text style={styles.title}>The Narrow Way</Text>
//     //   </View>
//     // </SafeAreaView>

//     <SafeAreaView style={styles.container}>
//       <AnimatedLogo />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeTop: {
//     backgroundColor: 'transparent',
//   },
//   container: {
//     paddingHorizontal: 16,
//     paddingBottom: 20,
//     paddingTop: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '800',
//     color: '#000',
//   },
// });

// src/components/AppHeader.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedLogo from '../components/AnimatedLogo';

export default function AppHeader() {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.container}>
        <AnimatedLogo height={68} textColor="#ffffff" useGradient={true} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeTop: {
    backgroundColor: '#000',
  },
  container: {
    backgroundColor: '#000',
    height: 60, // clean, predictable header height
    justifyContent: 'center',
    alignItems: 'center',
  },
});
