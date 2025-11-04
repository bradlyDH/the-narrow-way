import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export default function BackArrow({ onPress }) {
  return (
    <TouchableOpacity accessibilityLabel="Back" onPress={onPress} style={styles.container}>
      <Text style={styles.arrow}>←</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', right: 16, top: 8, padding: 8 },
  arrow: { fontSize: 24, color: Colors.backArrow, fontWeight: '700' }
});
