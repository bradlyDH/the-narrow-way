import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import SunRays from '../components/SunRays';

const Tile = ({ label, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.tile}>
    <Text style={styles.tileText}>{label}</Text>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const tiles = [
    { label: 'Prayer List 🙏', route: 'PrayerList' },
    { label: 'Profile 👤', route: 'Profile' },
    { label: "Today’s Quest 🎯", route: 'Quest' },
    { label: 'Progress 📈', route: 'Progress' },
    { label: 'Make Friends 🌎', route: 'MakeFriends' },
    { label: 'Friends List 📋', route: 'FriendsList' },
  ];

  return (
    <View style={styles.container}>
      <SunRays />
      <Text style={styles.greeting}>Good morning</Text>
      <Text style={styles.sub}>Let’s grow in obedience to Christ today!</Text>
      <View style={styles.verseTile}><Text style={styles.verseText}>Your Verse…</Text></View>
      <View style={styles.encTile}><Text style={styles.encText}>Encouraging Messages</Text></View>
      <View style={styles.grid}>
        {tiles.map(t => <Tile key={t.label} label={t.label} onPress={() => navigation.navigate(t.route)} />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.background },
  greeting: { fontSize: 28, fontWeight: '700', color: Colors.tile },
  sub: { color: Colors.text, marginBottom: 12 },
  verseTile: { backgroundColor: Colors.tile, padding: 14, borderRadius: 14, marginBottom: 10 },
  verseText: { color: '#fff' },
  encTile: { backgroundColor: Colors.accent, padding: 14, borderRadius: 14, marginBottom: 10 },
  encText: { color: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: { backgroundColor: Colors.button, padding: 14, borderRadius: 14, width: '48%' },
  tileText: { color: '#fff', fontWeight: '600' }
});
