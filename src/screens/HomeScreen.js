import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Screen from '../components/Screen'; // default
import { Colors } from '../constants/colors'; // named
import VerseCard from '../components/VerseCard'; // default
import PulseTile from '../components/PulseTile'; // default
import TileButton from '../components/TileButton'; // default

export default function HomeScreen({ navigation }) {
  const tiles = [
    { label: 'Prayer List', emoji: '🙏', screen: 'PrayerList' },
    { label: 'Profile', emoji: '👤', screen: 'Profile' },
    { label: 'Today’s Quest', emoji: '🎯', screen: 'Quest' },
    { label: 'Progress', emoji: '📈', screen: 'Progress' },
    { label: 'Make Friends', emoji: '👥', screen: 'MakeFriends' },
    { label: 'Friends List', emoji: '📋', screen: 'FriendsList' },
  ];

  const unreadEncouragements = false; // wire to real state later

  return (
    <ScrollView>
      <Screen>
        <View style={styles.header}>
          <Text style={styles.appTitle}>The Narrow Way</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.sub}>
            Let’s grow in obedience to Christ today!
          </Text>

          <VerseCard>Your Verse…</VerseCard>

          <View style={{ height: 12 }} />
          <PulseTile
            label="Encouraging Messages"
            pulsing={unreadEncouragements}
            onPress={() => navigation.navigate('Encouragement')}
          />

          <View style={{ height: 18 }} />

          <View style={styles.grid}>
            {tiles.map((t) => (
              <View key={t.label} style={styles.gridItem}>
                <TileButton
                  label={t.label}
                  emoji={t.emoji}
                  onPress={() => navigation.navigate(t.screen)}
                />
              </View>
            ))}
          </View>
        </View>
      </Screen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 4, paddingHorizontal: 16 },
  appTitle: { fontSize: 22, fontWeight: '800', color: '#000' },

  body: { paddingHorizontal: 16, paddingTop: 6 },
  greeting: { fontSize: 32, fontWeight: '800', color: Colors.button },
  sub: {
    color: Colors.text,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '600',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 14,
  },
});
