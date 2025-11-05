import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

export default function BackArrow({ onPress }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Back"
      onPress={onPress}
      style={styles.touch}
      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
    >
      <Ionicons name="chevron-back" size={28} color={Colors.backArrow} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Ensure ~44x44 target even if icon is smaller
  touch: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
