// import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import { Colors } from '../constants/colors';
// import SunRays from '../components/SunRays';
// import BackArrow from '../components/BackArrow';

// export default function AnsweredPrayersScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <SunRays />
//       <BackArrow onPress={() => navigation.goBack()} />
//       <ScrollView contentContainerStyle={styles.content}>
//         <Text style={styles.title}>Answered Prayers</Text>
//         <Text style={styles.subtitle}>Psalm 10:17 — He will hear.</Text>
//         <Text style={{ color: Colors.text }}>List of answered prayers…</Text>
//       </ScrollView>
//     </View>
//   );
// }
import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import { Colors } from '../constants/colors';

export default function AnsweredPrayersScreen({ navigation }) {
  return (
    // 👇 Automatically includes the top banner, rays, and back arrow in upper-right
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Answered Prayers</Text>
        <Text style={styles.subtitle}>Psalm 10:17 — He will hear.</Text>
        <Text style={{ color: Colors.text }}>List of answered prayers…</Text>
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
