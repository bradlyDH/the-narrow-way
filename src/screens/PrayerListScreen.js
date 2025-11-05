import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import { Colors } from '../constants/colors';

export default function PrayerListScreen({ navigation }) {
  return (
    // 👇 Automatically includes sun-rays and back arrow in upper-right
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Prayer Requests 🙏</Text>
        <Text style={styles.subtitle}>
          Philippians 4:6 — make your requests known to God.
        </Text>
        <Text style={{ color: Colors.text }}>Form and list will go here.</Text>
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
