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
    backgroundColor: Colors.tile,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
