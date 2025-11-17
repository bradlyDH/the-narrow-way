import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { Colors } from '../constants/colors';

export default function TileButton({ label, onPress, emoji, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.tile}
    >
      <View style={styles.inner}>
        {emoji ? (
          <Text
            // Separate text for emoji; no custom font on Android
            style={[
              styles.emoji,
              Platform.select({ android: { fontFamily: undefined } }),
            ]}
            allowFontScaling={false}
          >
            {emoji}
          </Text>
        ) : null}
        <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: Colors.button,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    opacity: 0.85,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  inner: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: 28,
    lineHeight: 32,
    includeFontPadding: false,
    textAlign: 'center',
  },

  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
  },
});
