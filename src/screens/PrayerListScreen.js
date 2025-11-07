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
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRoute } from '@react-navigation/native'; // ✅ ADDED

import Screen from '../components/Screen';
import FloatingLabelInput from '../components/FloatingLabelInput';
import { Colors } from '../constants/colors';
import { supabase } from '../supabase';

export default function PrayerListScreen({ navigation }) {
  const route = useRoute(); // ✅ ADDED

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [requests, setRequests] = useState([]);

  const userIdRef = useRef(null);

  // --- helpers (UPDATED)
  const todayLocalDate = () => {
    const d = new Date(); // local time
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`; // YYYY-MM-DD
  };

  // Robust formatter for 'YYYY-MM-DD' or ISO timestamp
  const fmtDate = (d) => {
    if (!d) return '—';
    const s = String(d);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      // Display local without Date() timezone shifts
      const [yy, mm, dd] = s.split('-');
      return `${Number(mm)}/${Number(dd)}/${yy}`;
    }
    try {
      return new Date(s).toLocaleDateString();
    } catch {
      return s;
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setRequests([]);
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
        .eq('answered', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (e) {
      console.warn('Load prayers error:', e?.message);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ✅ ADDED: Refetch whenever screen gains focus or when Answered screen
  // navigates back with { refreshAt } after a restore.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        if (active) {
          await load();
        }
      })();
      return () => {
        active = false;
      };
    }, [load, route.params?.refreshAt])
  );

  // --- actions
  const onAdd = async () => {
    const clean = (s) => (s && s.trim().length ? s.trim() : '');
    const t = clean(title);
    const d = clean(details);

    if (!t) {
      Alert.alert('Title required', 'Please enter a request title.');
      return;
    }

    setAdding(true);
    try {
      const optimistic = {
        id: `tmp_${Date.now()}`,
        title: t,
        details: d,
        created_at: new Date().toISOString(),
        last_prayed_at: null,
        answered: false,
        answered_at: null,
      };
      setRequests((prev) => [optimistic, ...prev]);

      const { data, error } = await supabase
        .from('prayer_requests')
        .insert({
          user_id: userIdRef.current,
          title: t,
          details: d,
        })
        .select()
        .single();

      if (error) throw error;

      // replace optimistic with real row
      setRequests((prev) => [
        data,
        ...prev.filter((r) => r.id !== optimistic.id),
      ]);
      setTitle('');
      setDetails('');
    } catch (e) {
      // rollback optimistic
      setRequests((prev) =>
        prev.filter((r) => !String(r.id).startsWith('tmp_'))
      );
      Alert.alert('Error', e?.message || 'Failed to add request.');
    } finally {
      setAdding(false);
    }
  };

  const markPrayedToday = async (req) => {
    const today = todayLocalDate(); // UPDATED: local date

    // optimistic
    const prev = requests;
    const updated = prev.map((r) =>
      r.id === req.id ? { ...r, last_prayed_at: today } : r
    );
    setRequests(updated);

    try {
      const { error } = await supabase
        .from('prayer_requests')
        .update({ last_prayed_at: today }) // UPDATED: local YYYY-MM-DD
        .eq('id', req.id)
        .eq('user_id', userIdRef.current);
      if (error) throw error;
    } catch (e) {
      setRequests(prev); // rollback
      Alert.alert('Error', e?.message || 'Could not mark as prayed.');
    }
  };

  const markAnswered = async (req) => {
    // optimistic: remove from list
    const prev = requests;
    setRequests(prev.filter((r) => r.id !== req.id));

    try {
      const { error } = await supabase
        .from('prayer_requests')
        .update({
          answered: true,
          answered_at: new Date().toISOString(),
        })
        .eq('id', req.id)
        .eq('user_id', userIdRef.current);

      if (error) throw error;
    } catch (e) {
      setRequests(prev); // rollback
      Alert.alert('Error', e?.message || 'Could not mark as answered.');
    }
  };

  const deleteRequest = async (req) => {
    const prev = requests;
    setRequests(prev.filter((r) => r.id !== req.id));
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .delete()
        .eq('id', req.id)
        .eq('user_id', userIdRef.current);
      if (error) throw error;
    } catch (e) {
      setRequests(prev);
      Alert.alert('Error', e?.message || 'Could not delete request.');
    }
  };

  // --- swipe actions
  const RightActions = ({ onAnswered, onDelete }) => {
    return (
      <View style={styles.swipeWrap}>
        <TouchableOpacity
          style={[styles.swipeBtn, styles.answeredBtn]}
          onPress={onAnswered}
        >
          <Ionicons name="checkmark-done" size={20} color="#fff" />
          <Text style={styles.swipeText}>Answered</Text>
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
  };

  // --- render
  return (
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Prayer Requests 🙏</Text>
        <Text style={styles.subtitle}>
          Philippians 4:6 — “do not be anxious about anything, but in everything
          by prayer and supplication with thanksgiving let your requests be made
          known to God.”
        </Text>

        {/* Form */}
        <View style={{ marginTop: 10 }}>
          <FloatingLabelInput
            label="Request Title"
            value={title}
            onChangeText={setTitle}
          />
          <View style={{ height: 12 }} />
          <FloatingLabelInput
            label="Details"
            value={details}
            onChangeText={setDetails}
            multiline
            maxLength={500}
          />

          <View style={{ height: 12 }} />
          <TouchableOpacity
            onPress={onAdd}
            disabled={adding}
            activeOpacity={0.9}
            style={[styles.primaryBtn, adding && { opacity: 0.6 }]}
          >
            {adding ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons
                  name="add-circle-outline"
                  size={18}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.primaryBtnText}>Add Request</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('AnsweredPrayers')}
            activeOpacity={0.9}
            style={styles.secondaryBtn}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color={Colors.button}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.secondaryBtnText}>View Answered Prayers</Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <Text style={styles.sectionTitle}>Active Requests</Text>

        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={Colors.button} />
            <Text style={{ color: Colors.text, marginLeft: 8 }}>Loading…</Text>
          </View>
        ) : requests.length === 0 ? (
          <Text style={{ color: Colors.text }}>No active requests yet.</Text>
        ) : (
          requests.map((req) => (
            <Swipeable
              key={req.id}
              renderRightActions={() => (
                <RightActions
                  onAnswered={() => markAnswered(req)}
                  onDelete={() =>
                    Alert.alert('Delete', 'Remove this request?', [
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
              friction={2}
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
                </View>

                <TouchableOpacity
                  onPress={() => markPrayedToday(req)}
                  activeOpacity={0.9}
                  style={styles.prayedBtn}
                >
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.prayedText}>Prayed today</Text>
                </TouchableOpacity>
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

  primaryBtn: {
    backgroundColor: Colors.button,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    opacity: 0.85,
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },

  secondaryBtn: {
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.button,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  secondaryBtnText: { color: Colors.button, fontWeight: '800' },

  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 22,
    fontWeight: '800',
    color: Colors.button,
  },

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

  prayedBtn: {
    alignSelf: 'flex-start',
    marginTop: 12,
    backgroundColor: Colors.button,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  prayedText: { color: '#fff', fontWeight: '800' },

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
    paddingHorizontal: 8,
  },
  answeredBtn: { backgroundColor: '#1b8a5a', marginBottom: 8 },
  deleteBtn: { backgroundColor: '#b00020', marginBottom: 8 },
  swipeText: { color: '#fff', fontWeight: '800', marginTop: 6 },
});
