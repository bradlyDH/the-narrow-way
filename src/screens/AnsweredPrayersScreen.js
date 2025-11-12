// src/screens/AnsweredPrayersScreen.js
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import Screen from '../components/Screen';
import { Colors } from '../constants/colors';
import { supabase } from '../supabase';

export default function AnsweredPrayersScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const userIdRef = useRef(null);

  const fmtDate = (d) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setRows([]);
        setLoading(false);
        return;
      }
      userIdRef.current = user.id;

      const { data, error } = await supabase
        .from('prayer_requests')
        .select(
          'id, title, details, created_at, last_prayed_at, answered, answered_at'
        )
        .eq('user_id', user.id)
        .eq('answered', true)
        .order('answered_at', { ascending: false });

      if (error) throw error;
      setRows(data || []);
    } catch (e) {
      console.warn('Load answered error:', e?.message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const restoreToActive = async (req) => {
    const prev = rows;
    setRows(prev.filter((r) => r.id !== req.id));

    try {
      const { error } = await supabase
        .from('prayer_requests')
        .update({ answered: false, answered_at: null })
        .eq('id', req.id)
        .eq('user_id', userIdRef.current);

      if (error) throw error;

      // ✅ Simply dismiss; PrayerListScreen's useFocusEffect will refetch
      navigation.pop(); // or navigation.goBack()
    } catch (e) {
      setRows(prev);
      Alert.alert('Error', e?.message || 'Could not restore request.');
    }
  };

  const deleteRequest = async (req) => {
    const prev = rows;
    setRows(prev.filter((r) => r.id !== req.id)); // optimistic
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .delete()
        .eq('id', req.id)
        .eq('user_id', userIdRef.current);
      if (error) throw error;
    } catch (e) {
      setRows(prev); // rollback
      Alert.alert('Error', e?.message || 'Could not delete request.');
    }
  };

  const RightActions = ({ onRestore, onDelete }) => (
    <View style={styles.swipeWrap}>
      <TouchableOpacity
        style={[styles.swipeBtn, styles.restoreBtn]}
        onPress={onRestore}
      >
        <Ionicons name="refresh" size={20} color="#fff" />
        <Text style={styles.swipeText}>Restore</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.swipeBtn, styles.deleteBtn]}
        onPress={onDelete}
      >
        <Ionicons name="trash-outline" size={20} color="#fff" />
        <Text style={styles.swipeText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    // Uses your Screen wrapper: no background changes, back arrow in upper-right
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Answered Prayers ✅</Text>
        <Text style={styles.subtitle}>Psalm 10:17 — He will hear.</Text>

        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={Colors.button} />
            <Text style={{ color: Colors.text, marginLeft: 8 }}>Loading…</Text>
          </View>
        ) : rows.length === 0 ? (
          <Text style={{ color: Colors.text }}>
            No answered prayers yet. Mark requests as answered from your Active
            list.
          </Text>
        ) : (
          rows.map((req) => (
            <Swipeable
              key={req.id}
              friction={2}
              renderRightActions={() => (
                <RightActions
                  onRestore={() => restoreToActive(req)}
                  onDelete={() =>
                    Alert.alert('Delete', 'Remove this entry?', [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => deleteRequest(req),
                      },
                    ])
                  }
                />
              )}
            >
              <View style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{req.title}</Text>
                  {!!req.details && (
                    <Text style={styles.cardSub}>{req.details}</Text>
                  )}
                  <Text style={styles.meta}>
                    Added: {fmtDate(req.created_at)} · Last prayed:{' '}
                    {fmtDate(req.last_prayed_at)}
                  </Text>
                  <Text style={styles.meta}>
                    Answered: {fmtDate(req.answered_at)}
                  </Text>
                </View>
              </View>
            </Swipeable>
          ))
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 17 },
  title: { fontSize: 32, fontWeight: '800', color: Colors.button },
  subtitle: { color: Colors.text, marginTop: 6, marginBottom: 12 },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  card: {
    backgroundColor: '#1c7293',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 4,
  },
  cardSub: { color: '#e9eef3', marginBottom: 8 },
  meta: { color: '#cfe1ee', fontSize: 12 },

  swipeWrap: {
    width: 180,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginVertical: 6,
  },
  swipeBtn: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  restoreBtn: { backgroundColor: '#5a67d8', marginBottom: 8 },
  deleteBtn: { backgroundColor: '#b00020', marginBottom: 8 },
  swipeText: { color: '#fff', fontWeight: '800', marginTop: 6 },
});
