import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../constants/colors';
import SunRays from '../components/SunRays';
import BackArrow from '../components/BackArrow';

export default function MakeFriendsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <SunRays />
      <BackArrow onPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Find Your Friends!</Text>
        <Text style={styles.subtitle}>Proverbs 27:17</Text>
        <Text style={{ color: Colors.text }}>Search by short User ID.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.tile },
  subtitle: { fontSize: 16, color: Colors.text }
});
