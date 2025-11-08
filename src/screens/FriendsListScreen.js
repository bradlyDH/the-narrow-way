// src/screens/FriendsListScreen.js
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
import { Ionicons } from '@expo/vector-icons';

import Screen from '../components/Screen';
import { Colors } from '../constants/colors';
import { supabase } from '../supabase';

export default function FriendsListScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [incoming, setIncoming] = useState([]); // pending requests sent TO me
  const [friends, setFriends] = useState([]); // accepted
  const [workingIds, setWorkingIds] = useState({}); // per-row spinners (friendship_id)
  const userIdRef = useRef(null);

  const markWorking = (id, flag) =>
    setWorkingIds((w) => ({ ...w, [id]: !!flag }));

  // Who is the "other" person on the friendship row
  const otherFromRow = useCallback((row, myId) => {
    const req = row.requester;
    const add = row.addressee;
    if (!req || !add) return null;
    return req.id === myId ? add : req;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setIncoming([]);
        setFriends([]);
        setLoading(false);
        return;
      }
      userIdRef.current = user.id;

      // Pull pending incoming requests (addressee = me)
      const { data: incData, error: incErr } = await supabase
        .from('friendships')
        .select(
          `
            id, status, created_at,
            requester:requester_id ( id, display_name, short_id ),
            addressee:addressee_id ( id, display_name, short_id )
          `
        )
        .eq('addressee_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (incErr) throw incErr;

      // Pull accepted (me on either side)
      const { data: frData, error: frErr } = await supabase
        .from('friendships')
        .select(
          `
            id, status, created_at,
            requester:requester_id ( id, display_name, short_id ),
            addressee:addressee_id ( id, display_name, short_id )
          `
        )
        .eq('status', 'accepted')
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (frErr) throw frErr;

      // Normalize
      const inc = (incData || []).map((row) => ({
        friendship_id: row.id,
        person: row.requester, // incoming: requester is the other person
      }));

      const mine = (frData || [])
        .map((row) => {
          const other = otherFromRow(row, user.id);
          return other ? { friendship_id: row.id, person: other } : null;
        })
        .filter(Boolean);

      setIncoming(inc);
      setFriends(mine);
    } catch (e) {
      console.warn('Friends load error:', e?.message);
      setIncoming([]);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  }, [otherFromRow]);

  // Initial + realtime
  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!userIdRef.current) return;

    const channel = supabase
      .channel('friends-live')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friendships',
          filter: `requester_id=eq.${userIdRef.current}`,
        },
        () => load()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friendships',
          filter: `addressee_id=eq.${userIdRef.current}`,
        },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  // --- Actions (optimistic) ---
  const acceptInvite = async (row) => {
    markWorking(row.friendship_id, true);

    // optimistic: remove from incoming, add to friends
    const prevIncoming = incoming;
    const prevFriends = friends;
    setIncoming((list) =>
      list.filter((r) => r.friendship_id !== row.friendship_id)
    );
    setFriends((list) => [
      { friendship_id: row.friendship_id, person: row.person },
      ...list,
    ]);

    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', row.friendship_id)
        .eq('addressee_id', userIdRef.current); // safety
      if (error) throw error;
    } catch (e) {
      // rollback
      setIncoming(prevIncoming);
      setFriends(prevFriends);
      Alert.alert('Error', e?.message || 'Could not accept request.');
    } finally {
      markWorking(row.friendship_id, false);
    }
  };

  const declineInvite = async (row) => {
    markWorking(row.friendship_id, true);
    const prevIncoming = incoming;
    setIncoming((list) =>
      list.filter((r) => r.friendship_id !== row.friendship_id)
    );

    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', row.friendship_id)
        .eq('addressee_id', userIdRef.current);
      if (error) throw error;
    } catch (e) {
      setIncoming(prevIncoming);
      Alert.alert('Error', e?.message || 'Could not decline request.');
    } finally {
      markWorking(row.friendship_id, false);
    }
  };

  // Quick actions on friend tile
  const startEncouragement = (row) => {
    const p = row.person;
    navigation.navigate('Encouragement', {
      targetId: p.id,
      targetName: p.display_name || 'Unnamed User',
      targetShortId: p.short_id,
    });
  };

  const removeFriend = async (row) => {
    markWorking(row.friendship_id, true);

    const prevFriends = friends;
    setFriends((list) =>
      list.filter((f) => f.friendship_id !== row.friendship_id)
    );

    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', row.friendship_id);
      if (error) throw error;
    } catch (e) {
      setFriends(prevFriends); // rollback
      Alert.alert('Error', e?.message || 'Could not remove friend.');
    } finally {
      markWorking(row.friendship_id, false);
    }
  };

  // --- UI helpers ---
  const fmtName = (p) =>
    p?.display_name?.trim?.() ? p.display_name.trim() : 'Unnamed User';

  return (
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Friends List 📋</Text>
        <Text style={styles.subtitle}>Your community of encouragement</Text>

        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={Colors.button} />
            <Text style={{ color: Colors.text, marginLeft: 8 }}>Loading…</Text>
          </View>
        ) : (
          <>
            {/* Incoming */}
            <Text style={styles.sectionTitle}>Incoming Requests</Text>
            {incoming.length === 0 ? (
              <Text style={{ color: Colors.text }}>No pending invites.</Text>
            ) : (
              incoming.map((r) => (
                <View key={r.friendship_id} style={styles.card}>
                  <Text style={styles.cardTitle}>{fmtName(r.person)}</Text>
                  <Text style={styles.cardMeta}>
                    User ID: {r.person?.short_id}
                  </Text>
                  <View style={styles.rowActions}>
                    <TouchableOpacity
                      onPress={() => acceptInvite(r)}
                      disabled={!!workingIds[r.friendship_id]}
                      style={[
                        styles.primaryBtn,
                        workingIds[r.friendship_id] && { opacity: 0.6 },
                      ]}
                      activeOpacity={0.9}
                    >
                      {workingIds[r.friendship_id] ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <>
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={18}
                            color="#fff"
                            style={{ marginRight: 6 }}
                          />
                          <Text style={styles.primaryBtnText}>Accept</Text>
                        </>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => declineInvite(r)}
                      disabled={!!workingIds[r.friendship_id]}
                      style={styles.secondaryBtn}
                      activeOpacity={0.9}
                    >
                      <Ionicons
                        name="close-circle-outline"
                        size={18}
                        color={Colors.button}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.secondaryBtnText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            {/* Friends */}
            <Text style={styles.sectionTitle}>Your Friends</Text>
            {friends.length === 0 ? (
              <Text style={{ color: Colors.text }}>
                You haven’t added any friends yet. Use “Make Friends” to send a
                request.
              </Text>
            ) : (
              friends
                .sort((a, b) =>
                  fmtName(a.person).localeCompare(fmtName(b.person))
                )
                .map((r) => {
                  const busy = !!workingIds[r.friendship_id];
                  return (
                    <View key={r.friendship_id} style={styles.card}>
                      <Text style={styles.cardTitle}>{fmtName(r.person)}</Text>
                      <Text style={styles.cardMeta}>
                        User ID: {r.person?.short_id}
                      </Text>

                      {/* Quick actions */}
                      <View style={styles.friendActions}>
                        <TouchableOpacity
                          onPress={() => startEncouragement(r)}
                          activeOpacity={0.9}
                          style={styles.iconBtn}
                        >
                          <Ionicons
                            name="paper-plane-outline"
                            size={18}
                            color="#fff"
                            style={{ marginRight: 6 }}
                          />
                          <Text style={styles.iconBtnText}>Encourage</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() =>
                            Alert.alert(
                              'Remove friend',
                              `Remove ${fmtName(r.person)}?`,
                              [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                  text: 'Remove',
                                  style: 'destructive',
                                  onPress: () => removeFriend(r),
                                },
                              ]
                            )
                          }
                          activeOpacity={0.9}
                          disabled={busy}
                          style={[styles.deleteBtn, busy && { opacity: 0.6 }]}
                        >
                          {busy ? (
                            <ActivityIndicator color="#fff" />
                          ) : (
                            <>
                              <Ionicons
                                name="trash-outline"
                                size={18}
                                color="#fff"
                                style={{ marginRight: 6 }}
                              />
                              <Text style={styles.iconBtnText}>Remove</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
            )}
          </>
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

  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 22,
    fontWeight: '800',
    color: Colors.button,
  },

  card: {
    backgroundColor: '#1c7293',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: { color: '#fff', fontWeight: '800', fontSize: 18 },
  cardMeta: { color: '#cfe1ee', fontSize: 12, marginTop: 4 },

  rowActions: { flexDirection: 'row', gap: 10, marginTop: 12 },

  primaryBtn: {
    backgroundColor: Colors.button,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },

  secondaryBtn: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.button,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  secondaryBtnText: { color: Colors.button, fontWeight: '800' },

  // Friend quick actions
  friendActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  iconBtn: {
    backgroundColor: Colors.button,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtnText: { color: '#fff', fontWeight: '800' },
  deleteBtn: {
    backgroundColor: '#b00020',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
