// src/components/AppHeader.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import AnimatedLogo from '../components/AnimatedLogo';
import SunRays from '../components/SunRays';
import { Colors } from '../constants/colors';

export default function AppHeader() {
  const navigation = useNavigation();

  const goProfile = () => {
    // Root stack header sits above tabs; target the nested Home stack -> Profile
    navigation.navigate('MainTabs', {
      screen: 'Home',
      params: { screen: 'Profile' },
    });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeTop}>
      <View style={styles.container}>
        {/* Animated gradient background behind the header */}
        <SunRays pointerEvents="none" />

        {/* Profile chip (top-left) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={goProfile}
          style={styles.profileBtn}
        >
          <Ionicons name="person-outline" size={18} color="#fff" />
          {/* <Text style={styles.profileText}>Profile</Text> */}
        </TouchableOpacity>

        {/* Centered animated title */}
        <AnimatedLogo
          height={80}
          text="The Narrow Way"
          textColor="#fff"
          strokeColor="#fff"
          glowColor="#FFD700"
          useGradient={false}
          showGrid={false}
          showBeam={true}
          showGlow={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeTop: {
    backgroundColor: Colors.background, // blends with screen background
  },
  container: {
    position: 'relative',
    height: 76, // a bit taller to fit the chip comfortably
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },

  // Small rounded chip anchored at the top-left
  profileBtn: {
    position: 'absolute',
    left: 12,
    top: 14,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.button, // matches your card tone
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,

    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,

    zIndex: 2,
  },
  profileText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
