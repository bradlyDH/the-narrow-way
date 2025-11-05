import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import { Colors } from '../constants/colors';

export default function QuestScreen({ navigation }) {
  return (
    // 👇 Screen provides the sun-rays + back arrow automatically (upper-right)
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Today’s Quest 🎯</Text>
        <Text style={styles.subtitle}>
          Practice Faith, Love, Patience, Kindness.
        </Text>
        <Text style={{ color: Colors.text }}>
          Daily 3-question flow placeholder…
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
