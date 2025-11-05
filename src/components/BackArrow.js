import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

const SIZE = 40;

export default function BackArrow({ onPress }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Back"
      onPress={onPress}
      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
      style={styles.touch}
      activeOpacity={0.8}
    >
      <MaskedView
        maskElement={
          <View style={styles.iconBox}>
            <Ionicons name="arrow-back-circle" size={36} color="#000" />
          </View>
        }
      >
        <LinearGradient
          colors={['#8f86edff', '#0466c8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientBox, { borderRadius: SIZE / 2 }]}
        />
      </MaskedView>
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
  gradientBox: {
    width: SIZE,
    height: SIZE,
    paddingBottom: 50,
  },
  iconBox: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
