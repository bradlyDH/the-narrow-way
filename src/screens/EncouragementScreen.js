import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import { Colors } from '../constants/colors';

export default function EncouragementScreen({ navigation }) {
  return (
    // 👇 Automatically shows sun-rays and back arrow in upper-right corner
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Send Encouragement 💬</Text>
        <Text style={styles.subtitle}>
          Choose who you’re lifting up, then pick a message.
        </Text>
        <Text style={{ color: Colors.text }}>
          Search & template picker goes here…
        </Text>
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
