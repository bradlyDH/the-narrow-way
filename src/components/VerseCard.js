import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export default function VerseCard({ children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transprent',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    opacity: 0.85,
  },
  text: { color: '#000000ff', fontSize: 16, fontWeight: '600' },
});
