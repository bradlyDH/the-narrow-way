// // // // src/screens/FriendsListScreen.js
// // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   ActivityIndicator,
// // //   Alert,
// // // } from 'react-native';
// // // import { Ionicons } from '@expo/vector-icons';

// // // import Screen from '../components/Screen';
// // // import { Colors } from '../constants/colors';
// // // import { supabase } from '../supabase';

// // // export default function FriendsListScreen({ navigation }) {
// // //   const [loading, setLoading] = useState(true);
// // //   const [incoming, setIncoming] = useState([]); // pending requests sent TO me
// // //   const [friends, setFriends] = useState([]); // accepted
// // //   const [workingIds, setWorkingIds] = useState({}); // per-row spinners (friendship_id)
// // //   const userIdRef = useRef(null);

// // //   const markWorking = (id, flag) =>
// // //     setWorkingIds((w) => ({ ...w, [id]: !!flag }));

// // //   // Who is the "other" person on the friendship row
// // //   const otherFromRow = useCallback((row, myId) => {
// // //     const req = row.requester;
// // //     const add = row.addressee;
// // //     if (!req || !add) return null;
// // //     return req.id === myId ? add : req;
// // //   }, []);

// // //   const load = useCallback(async () => {
// // //     setLoading(true);
// // //     try {
// // //       const {
// // //         data: { user },
// // //       } = await supabase.auth.getUser();
// // //       if (!user) {
// // //         setIncoming([]);
// // //         setFriends([]);
// // //         setLoading(false);
// // //         return;
// // //       }
// // //       userIdRef.current = user.id;

// // //       // Pull pending incoming requests (addressee = me)
// // //       const { data: incData, error: incErr } = await supabase
// // //         .from('friendships')
// // //         .select(
// // //           `
// // //             id, status, created_at,
// // //             requester:requester_id ( id, display_name, short_id ),
// // //             addressee:addressee_id ( id, display_name, short_id )
// // //           `
// // //         )
// // //         .eq('addressee_id', user.id)
// // //         .eq('status', 'pending')
// // //         .order('created_at', { ascending: false });

// // //       if (incErr) throw incErr;

// // //       // Pull accepted (me on either side)
// // //       const { data: frData, error: frErr } = await supabase
// // //         .from('friendships')
// // //         .select(
// // //           `
// // //             id, status, created_at,
// // //             requester:requester_id ( id, display_name, short_id ),
// // //             addressee:addressee_id ( id, display_name, short_id )
// // //           `
// // //         )
// // //         .eq('status', 'accepted')
// // //         .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
// // //         .order('created_at', { ascending: false });

// // //       if (frErr) throw frErr;

// // //       const inc = (incData || []).map((row) => ({
// // //         friendship_id: row.id,
// // //         person: row.requester, // incoming: requester is the other person
// // //       }));

// // //       const mine = (frData || [])
// // //         .map((row) => {
// // //           const other = otherFromRow(row, user.id);
// // //           return other ? { friendship_id: row.id, person: other } : null;
// // //         })
// // //         .filter(Boolean);

// // //       setIncoming(inc);
// // //       setFriends(mine);
// // //     } catch (e) {
// // //       console.warn('Friends load error:', e?.message);
// // //       setIncoming([]);
// // //       setFriends([]);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, [otherFromRow]);

// // //   // Initial + realtime
// // //   useEffect(() => {
// // //     load();
// // //   }, [load]);

// // //   useEffect(() => {
// // //     if (!userIdRef.current) return;

// // //     const channel = supabase
// // //       .channel('friends-live')
// // //       .on(
// // //         'postgres_changes',
// // //         {
// // //           event: '*',
// // //           schema: 'public',
// // //           table: 'friendships',
// // //           filter: `requester_id=eq.${userIdRef.current}`,
// // //         },
// // //         () => load()
// // //       )
// // //       .on(
// // //         'postgres_changes',
// // //         {
// // //           event: '*',
// // //           schema: 'public',
// // //           table: 'friendships',
// // //           filter: `addressee_id=eq.${userIdRef.current}`,
// // //         },
// // //         () => load()
// // //       )
// // //       .subscribe();

// // //     return () => {
// // //       supabase.removeChannel(channel);
// // //     };
// // //   }, [load]);

// // //   // --- Actions (optimistic) ---
// // //   const acceptInvite = async (row) => {
// // //     markWorking(row.friendship_id, true);

// // //     const prevIncoming = incoming;
// // //     const prevFriends = friends;
// // //     setIncoming((list) =>
// // //       list.filter((r) => r.friendship_id !== row.friendship_id)
// // //     );
// // //     setFriends((list) => [
// // //       { friendship_id: row.friendship_id, person: row.person },
// // //       ...list,
// // //     ]);

// // //     try {
// // //       const { error } = await supabase
// // //         .from('friendships')
// // //         .update({ status: 'accepted' })
// // //         .eq('id', row.friendship_id)
// // //         .eq('addressee_id', userIdRef.current);
// // //       if (error) throw error;
// // //     } catch (e) {
// // //       setIncoming(prevIncoming);
// // //       setFriends(prevFriends);
// // //       Alert.alert('Error', e?.message || 'Could not accept request.');
// // //     } finally {
// // //       markWorking(row.friendship_id, false);
// // //     }
// // //   };

// // //   const declineInvite = async (row) => {
// // //     markWorking(row.friendship_id, true);
// // //     const prevIncoming = incoming;
// // //     setIncoming((list) =>
// // //       list.filter((r) => r.friendship_id !== row.friendship_id)
// // //     );

// // //     try {
// // //       const { error } = await supabase
// // //         .from('friendships')
// // //         .delete()
// // //         .eq('id', row.friendship_id)
// // //         .eq('addressee_id', userIdRef.current);
// // //       if (error) throw error;
// // //     } catch (e) {
// // //       setIncoming(prevIncoming);
// // //       Alert.alert('Error', e?.message || 'Could not decline request.');
// // //     } finally {
// // //       markWorking(row.friendship_id, false);
// // //     }
// // //   };

// // //   // --- NEW: jump to composer inside the Home tab's nested stack ---
// // //   const startEncouragement = (row) => {
// // //     const p = row.person;
// // //     navigation.navigate('Home', {
// // //       screen: 'Encouragement',
// // //       params: {
// // //         targetId: p.id,
// // //         targetName: p.display_name || 'Unnamed User',
// // //         targetShortId: p.short_id,
// // //       },
// // //     });
// // //   };

// // //   // --- UI helpers ---
// // //   const fmtName = (p) =>
// // //     p?.display_name?.trim?.() ? p.display_name.trim() : 'Unnamed User';

// // //   return (
// // //     <Screen showBack onBack={() => navigation.goBack()}>
// // //       <ScrollView contentContainerStyle={styles.content}>
// // //         <Text style={styles.title}>Friends List 📋</Text>
// // //         <Text style={styles.subtitle}>Your community of encouragement</Text>

// // //         {loading ? (
// // //           <View style={styles.loadingRow}>
// // //             <ActivityIndicator color={Colors.button} />
// // //             <Text style={{ color: Colors.text, marginLeft: 8 }}>Loading…</Text>
// // //           </View>
// // //         ) : (
// // //           <>
// // //             <Text style={styles.sectionTitle}>Incoming Requests</Text>
// // //             {incoming.length === 0 ? (
// // //               <Text style={{ color: Colors.text }}>No pending invites.</Text>
// // //             ) : (
// // //               incoming.map((r) => (
// // //                 <View key={r.friendship_id} style={styles.card}>
// // //                   <Text style={styles.cardTitle}>{fmtName(r.person)}</Text>
// // //                   <Text style={styles.cardMeta}>
// // //                     User ID: {r.person?.short_id}
// // //                   </Text>
// // //                   <View style={styles.rowActions}>
// // //                     <TouchableOpacity
// // //                       onPress={() => acceptInvite(r)}
// // //                       disabled={!!workingIds[r.friendship_id]}
// // //                       style={[
// // //                         styles.primaryBtn,
// // //                         workingIds[r.friendship_id] && { opacity: 0.6 },
// // //                       ]}
// // //                       activeOpacity={0.9}
// // //                     >
// // //                       {workingIds[r.friendship_id] ? (
// // //                         <ActivityIndicator color="#fff" />
// // //                       ) : (
// // //                         <>
// // //                           <Ionicons
// // //                             name="checkmark-circle-outline"
// // //                             size={18}
// // //                             color="#fff"
// // //                             style={{ marginRight: 6 }}
// // //                           />
// // //                           <Text style={styles.primaryBtnText}>Accept</Text>
// // //                         </>
// // //                       )}
// // //                     </TouchableOpacity>

// // //                     <TouchableOpacity
// // //                       onPress={() => {
// // //                         markWorking(r.friendship_id, true);
// // //                         declineInvite(r).finally(() =>
// // //                           markWorking(r.friendship_id, false)
// // //                         );
// // //                       }}
// // //                       disabled={!!workingIds[r.friendship_id]}
// // //                       style={styles.secondaryBtn}
// // //                       activeOpacity={0.9}
// // //                     >
// // //                       <Ionicons
// // //                         name="close-circle-outline"
// // //                         size={18}
// // //                         color={Colors.button}
// // //                         style={{ marginRight: 6 }}
// // //                       />
// // //                       <Text style={styles.secondaryBtnText}>Decline</Text>
// // //                     </TouchableOpacity>
// // //                   </View>
// // //                 </View>
// // //               ))
// // //             )}

// // //             <Text style={styles.sectionTitle}>Your Friends</Text>
// // //             {friends.length === 0 ? (
// // //               <Text style={{ color: Colors.text }}>
// // //                 You haven’t added any friends yet. Use “Make Friends” to send a
// // //                 request.
// // //               </Text>
// // //             ) : (
// // //               friends
// // //                 .sort((a, b) =>
// // //                   fmtName(a.person).localeCompare(fmtName(b.person))
// // //                 )
// // //                 .map((r) => (
// // //                   <View key={r.friendship_id} style={styles.card}>
// // //                     <Text style={styles.cardTitle}>{fmtName(r.person)}</Text>
// // //                     <Text style={styles.cardMeta}>
// // //                       User ID: {r.person?.short_id}
// // //                     </Text>

// // //                     <View style={styles.rowActions}>
// // //                       <TouchableOpacity
// // //                         onPress={() => startEncouragement(r)}
// // //                         activeOpacity={0.9}
// // //                         style={styles.primaryBtn}
// // //                       >
// // //                         <Ionicons
// // //                           name="paper-plane-outline"
// // //                           size={18}
// // //                           color="#fff"
// // //                           style={{ marginRight: 6 }}
// // //                         />
// // //                         <Text style={styles.primaryBtnText}>Encourage</Text>
// // //                       </TouchableOpacity>

// // //                       <TouchableOpacity
// // //                         onPress={() =>
// // //                           Alert.alert(
// // //                             'Remove friend',
// // //                             `Remove ${fmtName(r.person)}?`,
// // //                             [
// // //                               { text: 'Cancel', style: 'cancel' },
// // //                               {
// // //                                 text: 'Remove',
// // //                                 style: 'destructive',
// // //                                 onPress: async () => {
// // //                                   try {
// // //                                     markWorking(r.friendship_id, true);
// // //                                     const { error } = await supabase
// // //                                       .from('friendships')
// // //                                       .delete()
// // //                                       .eq('id', r.friendship_id);
// // //                                     if (error) throw error;
// // //                                     setFriends((list) =>
// // //                                       list.filter(
// // //                                         (x) =>
// // //                                           x.friendship_id !== r.friendship_id
// // //                                       )
// // //                                     );
// // //                                   } catch (e) {
// // //                                     Alert.alert(
// // //                                       'Error',
// // //                                       e?.message || 'Could not remove friend.'
// // //                                     );
// // //                                   } finally {
// // //                                     markWorking(r.friendship_id, false);
// // //                                   }
// // //                                 },
// // //                               },
// // //                             ]
// // //                           )
// // //                         }
// // //                         activeOpacity={0.9}
// // //                         style={styles.secondaryBtn}
// // //                       >
// // //                         <Ionicons
// // //                           name="trash-outline"
// // //                           size={18}
// // //                           color={Colors.button}
// // //                           style={{ marginRight: 6, color: '#ffffff' }}
// // //                         />
// // //                         <Text style={styles.secondaryBtnText}>Remove</Text>
// // //                       </TouchableOpacity>
// // //                     </View>
// // //                   </View>
// // //                 ))
// // //             )}
// // //           </>
// // //         )}

// // //         <View style={{ height: 24 }} />
// // //       </ScrollView>
// // //     </Screen>
// // //   );
// // // }

// // // src/screens/FriendsListScreen.js
// // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   Alert,
// // } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';

// // import Screen from '../components/Screen';
// // import { Colors } from '../constants/colors';
// // import { supabase } from '../supabase';

// // export default function FriendsListScreen({ navigation }) {
// //   const [loading, setLoading] = useState(true);
// //   const [incoming, setIncoming] = useState([]); // pending requests sent TO me
// //   const [friends, setFriends] = useState([]); // accepted
// //   const [workingIds, setWorkingIds] = useState({}); // per-row spinners (friendship_id)
// //   const [watchIds, setWatchIds] = useState([]); // NEW: ids whose profiles we watch
// //   const userIdRef = useRef(null);
// //   const profilesChannelRef = useRef(null); // NEW: keep channel to clean up

// //   const markWorking = (id, flag) =>
// //     setWorkingIds((w) => ({ ...w, [id]: !!flag }));

// //   // Who is the "other" person on the friendship row
// //   const otherFromRow = useCallback((row, myId) => {
// //     const req = row.requester;
// //     const add = row.addressee;
// //     if (!req || !add) return null;
// //     return req.id === myId ? add : req;
// //   }, []);

// //   const load = useCallback(async () => {
// //     setLoading(true);
// //     try {
// //       const {
// //         data: { user },
// //       } = await supabase.auth.getUser();
// //       if (!user) {
// //         setIncoming([]);
// //         setFriends([]);
// //         setWatchIds([]);
// //         setLoading(false);
// //         return;
// //       }
// //       userIdRef.current = user.id;

// //       // Pull pending incoming requests (addressee = me)
// //       const { data: incData, error: incErr } = await supabase
// //         .from('friendships')
// //         .select(
// //           `
// //             id, status, created_at,
// //             requester:requester_id ( id, display_name, short_id ),
// //             addressee:addressee_id ( id, display_name, short_id )
// //           `
// //         )
// //         .eq('addressee_id', user.id)
// //         .eq('status', 'pending')
// //         .order('created_at', { ascending: false });

// //       if (incErr) throw incErr;

// //       // Pull accepted (me on either side)
// //       const { data: frData, error: frErr } = await supabase
// //         .from('friendships')
// //         .select(
// //           `
// //             id, status, created_at,
// //             requester:requester_id ( id, display_name, short_id ),
// //             addressee:addressee_id ( id, display_name, short_id )
// //           `
// //         )
// //         .eq('status', 'accepted')
// //         .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
// //         .order('created_at', { ascending: false });

// //       if (frErr) throw frErr;

// //       const inc = (incData || []).map((row) => ({
// //         friendship_id: row.id,
// //         person: row.requester, // incoming: requester is the other person
// //       }));

// //       const mine = (frData || [])
// //         .map((row) => {
// //           const other = otherFromRow(row, user.id);
// //           return other ? { friendship_id: row.id, person: other } : null;
// //         })
// //         .filter(Boolean);

// //       setIncoming(inc);
// //       setFriends(mine);

// //       // NEW: build profile ids we should watch for name changes
// //       const ids = [
// //         ...new Set([
// //           ...inc.map((r) => r.person?.id).filter(Boolean),
// //           ...mine.map((r) => r.person?.id).filter(Boolean),
// //         ]),
// //       ];
// //       setWatchIds(ids);
// //     } catch (e) {
// //       console.warn('Friends load error:', e?.message);
// //       setIncoming([]);
// //       setFriends([]);
// //       setWatchIds([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [otherFromRow]);

// //   // Initial + realtime (friendships table)
// //   useEffect(() => {
// //     load();
// //   }, [load]);

// //   useEffect(() => {
// //     if (!userIdRef.current) return;

// //     const channel = supabase
// //       .channel('friends-live')
// //       .on(
// //         'postgres_changes',
// //         {
// //           event: '*',
// //           schema: 'public',
// //           table: 'friendships',
// //           filter: `requester_id=eq.${userIdRef.current}`,
// //         },
// //         () => load()
// //       )
// //       .on(
// //         'postgres_changes',
// //         {
// //           event: '*',
// //           schema: 'public',
// //           table: 'friendships',
// //           filter: `addressee_id=eq.${userIdRef.current}`,
// //         },
// //         () => load()
// //       )
// //       .subscribe();

// //     return () => {
// //       supabase.removeChannel(channel);
// //     };
// //   }, [load]);

// //   // NEW: realtime (profiles table) to reflect display_name changes immediately
// //   useEffect(() => {
// //     // clean up old channel whenever watch set changes
// //     if (profilesChannelRef.current) {
// //       supabase.removeChannel(profilesChannelRef.current);
// //       profilesChannelRef.current = null;
// //     }
// //     if (!watchIds || watchIds.length === 0) return;

// //     // one .on per id keeps filters simple/portable
// //     const ch = supabase.channel('profiles-live-friends');

// //     watchIds.forEach((id) => {
// //       if (!id) return;
// //       ch.on(
// //         'postgres_changes',
// //         {
// //           event: '*',
// //           schema: 'public',
// //           table: 'profiles',
// //           filter: `id=eq.${id}`,
// //         },
// //         () => load()
// //       );
// //     });

// //     profilesChannelRef.current = ch.subscribe();

// //     return () => {
// //       if (profilesChannelRef.current) {
// //         supabase.removeChannel(profilesChannelRef.current);
// //         profilesChannelRef.current = null;
// //       }
// //     };
// //   }, [watchIds, load]);

// //   // --- Actions (optimistic) ---
// //   const acceptInvite = async (row) => {
// //     markWorking(row.friendship_id, true);

// //     const prevIncoming = incoming;
// //     const prevFriends = friends;
// //     setIncoming((list) =>
// //       list.filter((r) => r.friendship_id !== row.friendship_id)
// //     );
// //     setFriends((list) => [
// //       { friendship_id: row.friendship_id, person: row.person },
// //       ...list,
// //     ]);

// //     try {
// //       const { error } = await supabase
// //         .from('friendships')
// //         .update({ status: 'accepted' })
// //         .eq('id', row.friendship_id)
// //         .eq('addressee_id', userIdRef.current);
// //       if (error) throw error;
// //     } catch (e) {
// //       setIncoming(prevIncoming);
// //       setFriends(prevFriends);
// //       Alert.alert('Error', e?.message || 'Could not accept request.');
// //     } finally {
// //       markWorking(row.friendship_id, false);
// //     }
// //   };

// //   const declineInvite = async (row) => {
// //     markWorking(row.friendship_id, true);
// //     const prevIncoming = incoming;
// //     setIncoming((list) =>
// //       list.filter((r) => r.friendship_id !== row.friendship_id)
// //     );

// //     try {
// //       const { error } = await supabase
// //         .from('friendships')
// //         .delete()
// //         .eq('id', row.friendship_id)
// //         .eq('addressee_id', userIdRef.current);
// //       if (error) throw error;
// //     } catch (e) {
// //       setIncoming(prevIncoming);
// //       Alert.alert('Error', e?.message || 'Could not decline request.');
// //     } finally {
// //       markWorking(row.friendship_id, false);
// //     }
// //   };

// //   // --- jump to composer inside the Home tab's nested stack ---
// //   const startEncouragement = (row) => {
// //     const p = row.person;
// //     navigation.navigate('Home', {
// //       screen: 'Encouragement',
// //       params: {
// //         targetId: p.id,
// //         targetName: p.display_name || 'Unnamed User',
// //         targetShortId: p.short_id,
// //       },
// //     });
// //   };

// //   const fmtName = (p) =>
// //     p?.display_name?.trim?.() ? p.display_name.trim() : 'Unnamed User';

// //   return (
// //     <Screen showBack onBack={() => navigation.goBack()}>
// //       {/* ...UI unchanged... */}
// //     </Screen>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   content: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 17 },
// //   title: { fontSize: 32, fontWeight: '800', color: Colors.button },
// //   subtitle: { color: Colors.text, marginTop: 6, marginBottom: 12 },

// //   loadingRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 8,
// //   },

// //   sectionTitle: {
// //     marginTop: 16,
// //     marginBottom: 8,
// //     fontSize: 22,
// //     fontWeight: '800',
// //     color: Colors.button,
// //   },

// //   card: {
// //     backgroundColor: '#1c7293',
// //     borderRadius: 16,
// //     padding: 14,
// //     marginBottom: 12,
// //   },
// //   cardTitle: { color: '#fff', fontWeight: '800', fontSize: 18 },
// //   cardMeta: { color: '#cfe1ee', fontSize: 12, marginTop: 4 },

// //   rowActions: { flexDirection: 'row', gap: 10, marginTop: 12 },

// //   primaryBtn: {
// //     backgroundColor: Colors.button,
// //     borderRadius: 12,
// //     paddingVertical: 10,
// //     paddingHorizontal: 14,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   primaryBtnText: { color: '#fff', fontWeight: '800' },

// //   secondaryBtn: {
// //     borderRadius: 12,
// //     borderWidth: 2,
// //     borderColor: 'transparent',
// //     paddingVertical: 8,
// //     paddingHorizontal: 12,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#ff0000ff',
// //   },
// //   secondaryBtnText: {
// //     color: '#ffffff',
// //     fontWeight: '800',
// //     backgroundColor: '#ff0000ff',
// //   },
// // });

// // src/screens/FriendsListScreen.js
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// import Screen from '../components/Screen';
// import { Colors } from '../constants/colors';
// import { supabase } from '../supabase';

// export default function FriendsListScreen({ navigation }) {
//   const [loading, setLoading] = useState(true);
//   const [incoming, setIncoming] = useState([]); // pending requests sent TO me
//   const [friends, setFriends] = useState([]); // accepted
//   const [workingIds, setWorkingIds] = useState({}); // per-row spinners (friendship_id)
//   const userIdRef = useRef(null);

//   const friendsRtRef = useRef(null);
//   const profilesRtRef = useRef(null);

//   const markWorking = (id, flag) =>
//     setWorkingIds((w) => ({ ...w, [id]: !!flag }));

//   // Who is the "other" person on the friendship row
//   const otherFromRow = useCallback((row, myId) => {
//     const req = row.requester;
//     const add = row.addressee;
//     if (!req || !add) return null;
//     return req.id === myId ? add : req;
//   }, []);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) {
//         setIncoming([]);
//         setFriends([]);
//         setLoading(false);
//         return;
//       }
//       userIdRef.current = user.id;

//       // Pull pending incoming requests (addressee = me)
//       const { data: incData, error: incErr } = await supabase
//         .from('friendships')
//         .select(
//           `
//             id, status, created_at,
//             requester:requester_id ( id, display_name, short_id ),
//             addressee:addressee_id ( id, display_name, short_id )
//           `
//         )
//         .eq('addressee_id', user.id)
//         .eq('status', 'pending')
//         .order('created_at', { ascending: false });

//       if (incErr) throw incErr;

//       // Pull accepted (me on either side)
//       const { data: frData, error: frErr } = await supabase
//         .from('friendships')
//         .select(
//           `
//             id, status, created_at,
//             requester:requester_id ( id, display_name, short_id ),
//             addressee:addressee_id ( id, display_name, short_id )
//           `
//         )
//         .eq('status', 'accepted')
//         .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
//         .order('created_at', { ascending: false });

//       if (frErr) throw frErr;

//       const inc = (incData || []).map((row) => ({
//         friendship_id: row.id,
//         person: row.requester, // incoming: requester is the other person
//       }));

//       const mine = (frData || [])
//         .map((row) => {
//           const other = otherFromRow(row, user.id);
//           return other ? { friendship_id: row.id, person: other } : null;
//         })
//         .filter(Boolean);

//       setIncoming(inc);
//       setFriends(mine);
//     } catch (e) {
//       console.warn('Friends load error:', e?.message);
//       setIncoming([]);
//       setFriends([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [otherFromRow]);

//   // Derived: all person IDs currently visible (for profile name live updates)
//   const visibleProfileIdsCsv = useMemo(() => {
//     const ids = new Set();
//     incoming.forEach((r) => r.person?.id && ids.add(r.person.id));
//     friends.forEach((r) => r.person?.id && ids.add(r.person.id));
//     if (ids.size === 0) return '';
//     return Array.from(ids).join(',');
//   }, [incoming, friends]);

//   // Initial load
//   useEffect(() => {
//     load();
//   }, [load]);

//   // Realtime: listen for friendship rows that involve me
//   useEffect(() => {
//     (async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return;

//       // Clean prior channel
//       if (friendsRtRef.current) {
//         supabase.removeChannel(friendsRtRef.current);
//         friendsRtRef.current = null;
//       }

//       const ch = supabase
//         .channel('friends-live')
//         .on(
//           'postgres_changes',
//           {
//             event: '*',
//             schema: 'public',
//             table: 'friendships',
//             filter: `requester_id=eq.${user.id}`,
//           },
//           () => load()
//         )
//         .on(
//           'postgres_changes',
//           {
//             event: '*',
//             schema: 'public',
//             table: 'friendships',
//             filter: `addressee_id=eq.${user.id}`,
//           },
//           () => load()
//         )
//         .subscribe();

//       friendsRtRef.current = ch;
//     })();

//     return () => {
//       if (friendsRtRef.current) {
//         supabase.removeChannel(friendsRtRef.current);
//         friendsRtRef.current = null;
//       }
//     };
//   }, [load]);

//   // Realtime: if any visible friend profile changes (e.g., display_name), refresh those rows
//   useEffect(() => {
//     // Skip if nothing to watch
//     if (!visibleProfileIdsCsv) {
//       if (profilesRtRef.current) {
//         supabase.removeChannel(profilesRtRef.current);
//         profilesRtRef.current = null;
//       }
//       return;
//     }

//     // Reset any prior subscription (ids may have changed)
//     if (profilesRtRef.current) {
//       supabase.removeChannel(profilesRtRef.current);
//       profilesRtRef.current = null;
//     }

//     const ch = supabase
//       .channel('friend-profiles-live')
//       .on(
//         'postgres_changes',
//         {
//           event: 'UPDATE',
//           schema: 'public',
//           table: 'profiles',
//           filter: `id=in.(${visibleProfileIdsCsv})`,
//         },
//         (payload) => {
//           const updated = payload.new || {};
//           const { id, display_name, short_id } = updated;

//           setIncoming((list) =>
//             list.map((r) =>
//               r.person?.id === id
//                 ? { ...r, person: { ...r.person, display_name, short_id } }
//                 : r
//             )
//           );
//           setFriends((list) =>
//             list.map((r) =>
//               r.person?.id === id
//                 ? { ...r, person: { ...r.person, display_name, short_id } }
//                 : r
//             )
//           );
//         }
//       )
//       .subscribe();

//     profilesRtRef.current = ch;

//     return () => {
//       if (profilesRtRef.current) {
//         supabase.removeChannel(profilesRtRef.current);
//         profilesRtRef.current = null;
//       }
//     };
//   }, [visibleProfileIdsCsv]);

//   // --- Actions (optimistic) ---
//   const acceptInvite = async (row) => {
//     markWorking(row.friendship_id, true);

//     const prevIncoming = incoming;
//     const prevFriends = friends;
//     setIncoming((list) =>
//       list.filter((r) => r.friendship_id !== row.friendship_id)
//     );
//     setFriends((list) => [
//       { friendship_id: row.friendship_id, person: row.person },
//       ...list,
//     ]);

//     try {
//       const { error } = await supabase
//         .from('friendships')
//         .update({ status: 'accepted' })
//         .eq('id', row.friendship_id)
//         .eq('addressee_id', userIdRef.current);
//       if (error) throw error;
//     } catch (e) {
//       setIncoming(prevIncoming);
//       setFriends(prevFriends);
//       Alert.alert('Error', e?.message || 'Could not accept request.');
//     } finally {
//       markWorking(row.friendship_id, false);
//     }
//   };

//   const declineInvite = async (row) => {
//     markWorking(row.friendship_id, true);
//     const prevIncoming = incoming;
//     setIncoming((list) =>
//       list.filter((r) => r.friendship_id !== row.friendship_id)
//     );

//     try {
//       const { error } = await supabase
//         .from('friendships')
//         .delete()
//         .eq('id', row.friendship_id)
//         .eq('addressee_id', userIdRef.current);
//       if (error) throw error;
//     } catch (e) {
//       setIncoming(prevIncoming);
//       Alert.alert('Error', e?.message || 'Could not decline request.');
//     } finally {
//       markWorking(row.friendship_id, false);
//     }
//   };

//   // --- Jump to composer inside the Home tab's nested stack ---
//   const startEncouragement = (row) => {
//     const p = row.person;
//     navigation.navigate('Home', {
//       screen: 'Encouragement',
//       params: {
//         targetId: p.id,
//         targetName: p.display_name || 'Unnamed User',
//         targetShortId: p.short_id,
//       },
//     });
//   };

//   // --- UI helpers ---
//   const fmtName = (p) =>
//     p?.display_name?.trim?.() ? p.display_name.trim() : 'Unnamed User';

//   return (
//     <Screen showBack onBack={() => navigation.goBack()}>
//       <ScrollView contentContainerStyle={styles.content}>
//         <Text style={styles.title}>Friends List 📋</Text>
//         <Text style={styles.subtitle}>Your community of encouragement</Text>

//         {loading ? (
//           <View style={styles.loadingRow}>
//             <ActivityIndicator color={Colors.button} />
//             <Text style={{ color: Colors.text, marginLeft: 8 }}>Loading…</Text>
//           </View>
//         ) : (
//           <>
//             <Text style={styles.sectionTitle}>Incoming Requests</Text>
//             {incoming.length === 0 ? (
//               <Text style={{ color: Colors.text }}>No pending invites.</Text>
//             ) : (
//               incoming.map((r) => (
//                 <View key={r.friendship_id} style={styles.card}>
//                   <Text style={styles.cardTitle}>{fmtName(r.person)}</Text>
//                   <Text style={styles.cardMeta}>
//                     User ID: {r.person?.short_id}
//                   </Text>
//                   <View style={styles.rowActions}>
//                     <TouchableOpacity
//                       onPress={() => acceptInvite(r)}
//                       disabled={!!workingIds[r.friendship_id]}
//                       style={[
//                         styles.primaryBtn,
//                         workingIds[r.friendship_id] && { opacity: 0.6 },
//                       ]}
//                       activeOpacity={0.9}
//                     >
//                       {workingIds[r.friendship_id] ? (
//                         <ActivityIndicator color="#fff" />
//                       ) : (
//                         <>
//                           <Ionicons
//                             name="checkmark-circle-outline"
//                             size={18}
//                             color="#fff"
//                             style={{ marginRight: 6 }}
//                           />
//                           <Text style={styles.primaryBtnText}>Accept</Text>
//                         </>
//                       )}
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       onPress={() => {
//                         markWorking(r.friendship_id, true);
//                         declineInvite(r).finally(() =>
//                           markWorking(r.friendship_id, false)
//                         );
//                       }}
//                       disabled={!!workingIds[r.friendship_id]}
//                       style={styles.secondaryBtn}
//                       activeOpacity={0.9}
//                     >
//                       <Ionicons
//                         name="close-circle-outline"
//                         size={18}
//                         color={Colors.button}
//                         style={{ marginRight: 6 }}
//                       />
//                       <Text style={styles.secondaryBtnText}>Decline</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               ))
//             )}

//             <Text style={styles.sectionTitle}>Your Friends</Text>
//             {friends.length === 0 ? (
//               <Text style={{ color: Colors.text }}>
//                 You haven’t added any friends yet. Use “Make Friends” to send a
//                 request.
//               </Text>
//             ) : (
//               friends
//                 .slice()
//                 .sort((a, b) =>
//                   fmtName(a.person).localeCompare(fmtName(b.person))
//                 )
//                 .map((r) => (
//                   <View key={r.friendship_id} style={styles.card}>
//                     <Text style={styles.cardTitle}>{fmtName(r.person)}</Text>
//                     <Text style={styles.cardMeta}>
//                       User ID: {r.person?.short_id}
//                     </Text>

//                     <View style={styles.rowActions}>
//                       <TouchableOpacity
//                         onPress={() => startEncouragement(r)}
//                         activeOpacity={0.9}
//                         style={styles.primaryBtn}
//                       >
//                         <Ionicons
//                           name="paper-plane-outline"
//                           size={18}
//                           color="#fff"
//                           style={{ marginRight: 6 }}
//                         />
//                         <Text style={styles.primaryBtnText}>Encourage</Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         onPress={() =>
//                           Alert.alert(
//                             'Remove friend',
//                             `Remove ${fmtName(r.person)}?`,
//                             [
//                               { text: 'Cancel', style: 'cancel' },
//                               {
//                                 text: 'Remove',
//                                 style: 'destructive',
//                                 onPress: async () => {
//                                   try {
//                                     markWorking(r.friendship_id, true);
//                                     const { error } = await supabase
//                                       .from('friendships')
//                                       .delete()
//                                       .eq('id', r.friendship_id);
//                                     if (error) throw error;
//                                     setFriends((list) =>
//                                       list.filter(
//                                         (x) =>
//                                           x.friendship_id !== r.friendship_id
//                                       )
//                                     );
//                                   } catch (e) {
//                                     Alert.alert(
//                                       'Error',
//                                       e?.message || 'Could not remove friend.'
//                                     );
//                                   } finally {
//                                     markWorking(r.friendship_id, false);
//                                   }
//                                 },
//                               },
//                             ]
//                           )
//                         }
//                         activeOpacity={0.9}
//                         style={styles.secondaryBtn}
//                       >
//                         <Ionicons
//                           name="trash-outline"
//                           size={18}
//                           color={Colors.button}
//                           style={{ marginRight: 6, color: '#ffffff' }}
//                         />
//                         <Text style={styles.secondaryBtnText}>Remove</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 ))
//             )}
//           </>
//         )}

//         <View style={{ height: 24 }} />
//       </ScrollView>
//     </Screen>
//   );
// }

// const styles = StyleSheet.create({
//   content: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 17 },
//   title: { fontSize: 32, fontWeight: '800', color: Colors.button },
//   subtitle: { color: Colors.text, marginTop: 6, marginBottom: 12 },

//   loadingRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//   },

//   sectionTitle: {
//     marginTop: 16,
//     marginBottom: 8,
//     fontSize: 22,
//     fontWeight: '800',
//     color: Colors.button,
//   },

//   card: {
//     backgroundColor: '#1c7293',
//     borderRadius: 16,
//     padding: 14,
//     marginBottom: 12,
//   },
//   cardTitle: { color: '#fff', fontWeight: '800', fontSize: 18 },
//   cardMeta: { color: '#cfe1ee', fontSize: 12, marginTop: 4 },

//   rowActions: { flexDirection: 'row', gap: 10, marginTop: 12 },

//   primaryBtn: {
//     backgroundColor: Colors.button,
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   primaryBtnText: { color: '#fff', fontWeight: '800' },

//   secondaryBtn: {
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: 'transparent',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ff0000ff',
//   },
//   secondaryBtnText: {
//     color: '#ffffff',
//     fontWeight: '800',
//     backgroundColor: '#ff0000ff',
//   },
// });

// src/screens/FriendsListScreen.js
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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

  const friendsRtRef = useRef(null);
  const profilesRtRef = useRef(null);

  const markWorking = (id, flag) =>
    setWorkingIds((w) => ({ ...w, [id]: !!flag }));

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

      const inc = (incData || []).map((row) => ({
        friendship_id: row.id,
        person: row.requester,
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

  const visibleProfileIdsCsv = useMemo(() => {
    const ids = new Set();
    incoming.forEach((r) => r.person?.id && ids.add(r.person.id));
    friends.forEach((r) => r.person?.id && ids.add(r.person.id));
    if (ids.size === 0) return '';
    return Array.from(ids).join(',');
  }, [incoming, friends]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      if (friendsRtRef.current) {
        supabase.removeChannel(friendsRtRef.current);
        friendsRtRef.current = null;
      }

      const ch = supabase
        .channel('friends-live')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'friendships',
            filter: `requester_id=eq.${user.id}`,
          },
          () => load()
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'friendships',
            filter: `addressee_id=eq.${user.id}`,
          },
          () => load()
        )
        .subscribe();

      friendsRtRef.current = ch;
    })();

    return () => {
      if (friendsRtRef.current) {
        supabase.removeChannel(friendsRtRef.current);
        friendsRtRef.current = null;
      }
    };
  }, [load]);

  useEffect(() => {
    if (!visibleProfileIdsCsv) {
      if (profilesRtRef.current) {
        supabase.removeChannel(profilesRtRef.current);
        profilesRtRef.current = null;
      }
      return;
    }

    if (profilesRtRef.current) {
      supabase.removeChannel(profilesRtRef.current);
      profilesRtRef.current = null;
    }

    const ch = supabase
      .channel('friend-profiles-live')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=in.(${visibleProfileIdsCsv})`,
        },
        (payload) => {
          const updated = payload.new || {};
          const { id, display_name, short_id } = updated;

          setIncoming((list) =>
            list.map((r) =>
              r.person?.id === id
                ? { ...r, person: { ...r.person, display_name, short_id } }
                : r
            )
          );
          setFriends((list) =>
            list.map((r) =>
              r.person?.id === id
                ? { ...r, person: { ...r.person, display_name, short_id } }
                : r
            )
          );
        }
      )
      .subscribe();

    profilesRtRef.current = ch;

    return () => {
      if (profilesRtRef.current) {
        supabase.removeChannel(profilesRtRef.current);
        profilesRtRef.current = null;
      }
    };
  }, [visibleProfileIdsCsv]);

  // --- Actions (optimistic) ---
  const acceptInvite = async (row) => {
    markWorking(row.friendship_id, true);

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
        .eq('addressee_id', userIdRef.current);
      if (error) throw error;
    } catch (e) {
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

  // --- Jump to composer inside the Home tab's nested stack ---
  const startEncouragement = (row) => {
    const p = row.person;
    navigation.navigate('Home', {
      screen: 'Encouragement',
      params: {
        targetId: p.id,
        targetName: p.display_name || 'Unnamed User',
        targetShortId: p.short_id,
      },
    });
  };

  const fmtName = (p) =>
    p?.display_name?.trim?.() ? p.display_name.trim() : 'Unnamed User';

  return (
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header row with "Make Friends" CTA */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Friends List</Text>
            <Text style={styles.subtitle}>Your community of encouragement</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('MakeFriends')}
            activeOpacity={0.9}
            style={styles.headerCta}
          >
            <Ionicons
              name="person-add-outline"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.headerCtaText}>Make Friends</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={Colors.button} />
            <Text style={{ color: Colors.text, marginLeft: 8 }}>Loading…</Text>
          </View>
        ) : (
          <>
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
                      onPress={() => {
                        markWorking(r.friendship_id, true);
                        declineInvite(r).finally(() =>
                          markWorking(r.friendship_id, false)
                        );
                      }}
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

            <Text style={styles.sectionTitle}>Your Friends</Text>
            {friends.length === 0 ? (
              <View>
                <Text style={{ color: Colors.text, marginBottom: 8 }}>
                  You haven’t added any friends yet!
                </Text>
              </View>
            ) : (
              friends
                .slice()
                .sort((a, b) =>
                  fmtName(a.person).localeCompare(fmtName(b.person))
                )
                .map((r) => (
                  <View key={r.friendship_id} style={styles.card}>
                    <Text style={styles.cardTitle}>{fmtName(r.person)}</Text>
                    <Text style={styles.cardMeta}>
                      User ID: {r.person?.short_id}
                    </Text>

                    <View style={styles.rowActions}>
                      <TouchableOpacity
                        onPress={() => startEncouragement(r)}
                        activeOpacity={0.9}
                        style={styles.primaryBtn}
                      >
                        <Ionicons
                          name="paper-plane-outline"
                          size={18}
                          color="#fff"
                          style={{ marginRight: 6 }}
                        />
                        <Text style={styles.primaryBtnText}>Encourage</Text>
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
                                onPress: async () => {
                                  try {
                                    markWorking(r.friendship_id, true);
                                    const { error } = await supabase
                                      .from('friendships')
                                      .delete()
                                      .eq('id', r.friendship_id);
                                    if (error) throw error;
                                    setFriends((list) =>
                                      list.filter(
                                        (x) =>
                                          x.friendship_id !== r.friendship_id
                                      )
                                    );
                                  } catch (e) {
                                    Alert.alert(
                                      'Error',
                                      e?.message || 'Could not remove friend.'
                                    );
                                  } finally {
                                    markWorking(r.friendship_id, false);
                                  }
                                },
                              },
                            ]
                          )
                        }
                        activeOpacity={0.9}
                        style={styles.secondaryBtn}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color="#ffffff"
                          style={{ marginRight: 6 }}
                        />
                        <Text style={styles.secondaryBtnText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
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

  // Header row
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  headerCta: {
    backgroundColor: Colors.button,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  headerCtaText: { color: '#fff', fontWeight: '800' },

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
    borderColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff0000ff',
  },
  secondaryBtnText: { color: '#ffffff', fontWeight: '800' },

  // Inline link for empty state
  inlineLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  inlineLinkText: {
    color: Colors.button,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
});
