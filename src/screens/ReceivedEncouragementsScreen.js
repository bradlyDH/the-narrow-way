import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import { Colors } from '../constants/colors';

export default function ReceivedEncouragementsScreen({ navigation }) {
  return (
    // 👇 Automatically includes banner + upper-right back arrow
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Received Encouragements</Text>
        <Text style={styles.subtitle}>
          These will be permanently deleted after 30 days.
        </Text>
        <Text style={{ color: Colors.text }}>Inbox list here…</Text>
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
