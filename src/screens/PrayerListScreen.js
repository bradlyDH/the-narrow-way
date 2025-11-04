import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../constants/colors';
import SunRays from '../components/SunRays';
import BackArrow from '../components/BackArrow';

export default function PrayerListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <SunRays />
      <BackArrow onPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Prayer Requests 🙏</Text>
        <Text style={styles.subtitle}>Philippians 4:6 — make your requests known to God.</Text>
        <Text style={{ color: Colors.text }}>Form and list will go here.</Text>
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
