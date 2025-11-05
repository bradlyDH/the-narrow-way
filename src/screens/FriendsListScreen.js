import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../constants/colors';
import SunRays from '../components/SunRays';
import BackArrow from '../components/BackArrow';
import Screen from '../components/Screen';

export default function FriendsListScreen({ navigation }) {
  return (
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Friends List 📋</Text>
        <Text style={styles.subtitle}>Your community of encouragement</Text>
        <Text style={{ color: Colors.text }}>Alphabetical friend tiles…</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.tile },
  subtitle: { fontSize: 16, color: Colors.text },
});
