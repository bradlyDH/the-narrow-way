// src/components/AppHeader.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export default function AppHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>The Narrow Way</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 0, // safe area + spacing
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: 'transparent', // keeps your gradient visible
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
});
