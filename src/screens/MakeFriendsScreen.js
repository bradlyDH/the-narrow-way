// import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import { Colors } from '../constants/colors';
// import SunRays from '../components/SunRays';
// import BackArrow from '../components/BackArrow';

// export default function MakeFriendsScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <SunRays />
//       <BackArrow onPress={() => navigation.goBack()} />
//       <ScrollView contentContainerStyle={styles.content}>
//         <Text style={styles.title}>Find Your Friends!</Text>
//         <Text style={styles.subtitle}>Proverbs 27:17</Text>
//         <Text style={{ color: Colors.text }}>Search by short User ID.</Text>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.background },
//   content: { padding: 16, gap: 12 },
//   title: { fontSize: 28, fontWeight: '700', color: Colors.tile },
//   subtitle: { fontSize: 16, color: Colors.text }
// });

import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import { Colors } from '../constants/colors';

export default function MakeFriendsScreen({ navigation }) {
  return (
    // 👇 Handles sun-rays & back arrow automatically in upper-right
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Find Your Friends!</Text>
        <Text style={styles.subtitle}>Proverbs 27:17</Text>
        <Text style={{ color: Colors.text }}>Search by short User ID.</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.button,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
  },
});
