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
// import { useFocusEffect } from '@react-navigation/native';

// import Screen from '../components/Screen';
// import { Colors } from '../constants/colors';
// import { resetRealtime, supabase } from '../supabase';

// import {
//   loadFriendLists,
//   acceptFriendRequest,
//   declineFriendRequest,
//   removeFriendship,
// } from '../services/friendsService';

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

//   // Service-driven load: server → local sync, then read from SQLite
//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       userIdRef.current = user?.id ?? null;

//       const { incoming, friends } = await loadFriendLists();
//       setIncoming(incoming);
//       setFriends(friends);
//     } catch (e) {
//       console.warn('Friends load error:', e?.message || e);
//       setIncoming([]);
//       setFriends([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const visibleProfileIdsCsv = useMemo(() => {
//     const ids = new Set();
//     incoming.forEach((r) => r.person?.id && ids.add(r.person.id));
//     friends.forEach((r) => r.person?.id && ids.add(r.person.id));
//     if (ids.size === 0) return '';
//     return Array.from(ids).join(',');
//   }, [incoming, friends]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   useFocusEffect(
//     useCallback(() => {
//       load();
//       return () => {};
//     }, [load])
//   );

//   // realtime: friendships table changes affecting me
//   useEffect(() => {
//     let ch;

//     (async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return;

//       // Build filters once and re-use
//       const reqFilter = `requester_id=eq.${user.id}`;
//       const addFilter = `addressee_id=eq.${user.id}`;
//       console.log('[friends-rt] using filters:', reqFilter, addFilter);

//       // Tear down this screen’s previous channel only
//       if (friendsRtRef.current) {
//         supabase.removeChannel(friendsRtRef.current);
//         friendsRtRef.current = null;
//       }

//       // (optional) simple debounce so multiple events don’t spam load()
//       let t;
//       const refresh = () => {
//         clearTimeout(t);
//         t = setTimeout(() => load(), 120);
//       };

//       ch = supabase
//         .channel('friends-live')
//         .on(
//           'postgres_changes',
//           {
//             event: '*',
//             schema: 'public',
//             table: 'friendships',
//             filter: reqFilter,
//           },
//           refresh
//         )
//         .on(
//           'postgres_changes',
//           {
//             event: '*',
//             schema: 'public',
//             table: 'friendships',
//             filter: addFilter,
//           },
//           refresh
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

//   // realtime: profile display changes for visible people
//   useEffect(() => {
//     if (!visibleProfileIdsCsv) {
//       if (profilesRtRef.current) {
//         supabase.removeChannel(profilesRtRef.current);
//         profilesRtRef.current = null;
//       }
//       return;
//     }

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

//     // optimistic: Incoming → Friends
//     setIncoming((list) =>
//       list.filter((r) => r.friendship_id !== row.friendship_id)
//     );
//     setFriends((list) => [
//       { friendship_id: row.friendship_id, person: row.person },
//       ...list,
//     ]);

//     try {
//       await acceptFriendRequest(row.friendship_id);
//     } catch (e) {
//       // rollback
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

//     // optimistic: remove from Incoming
//     setIncoming((list) =>
//       list.filter((r) => r.friendship_id !== row.friendship_id)
//     );

//     try {
//       await declineFriendRequest(row.friendship_id);
//     } catch (e) {
//       // rollback
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

//   const fmtName = (p) =>
//     p?.display_name?.trim?.() ? p.display_name.trim() : 'Unnamed User';

//   return (
//     <Screen showBack onBack={() => navigation.goBack()}>
//       <ScrollView contentContainerStyle={styles.content}>
//         {/* Header row with "Make Friends" CTA */}
//         <View style={styles.headerRow}>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.title}>Friends List</Text>
//             <Text style={styles.subtitle}>Your community of encouragement</Text>
//           </View>

//           <TouchableOpacity
//             onPress={() => navigation.navigate('MakeFriends')}
//             activeOpacity={0.9}
//             style={styles.headerCta}
//           >
//             <Ionicons
//               name="person-add-outline"
//               size={18}
//               color="#fff"
//               style={{ marginRight: 6 }}
//             />
//             <Text style={styles.headerCtaText}>Make Friends</Text>
//           </TouchableOpacity>
//         </View>

//         {loading ? (
//           <View className="loadingRow" style={styles.loadingRow}>
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
//                       onPress={() => declineInvite(r)}
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
//               <View>
//                 <Text style={{ color: Colors.text, marginBottom: 8 }}>
//                   You haven’t added any friends yet!
//                 </Text>
//               </View>
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
//                                     await removeFriendship(
//                                       r.friendship_id,
//                                       r.person?.id
//                                     ); // ← server delete (both directions)
//                                     setFriends((list) =>
//                                       list.filter(
//                                         (x) =>
//                                           x.friendship_id !== r.friendship_id
//                                       )
//                                     );
//                                     await load(); // ← optional; realtime should also update
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
//                           color="#ffffff"
//                           style={{ marginRight: 6 }}
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

//   // Header row
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 12,
//     marginBottom: 8,
//   },
//   headerCta: {
//     backgroundColor: Colors.button,
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'flex-start',
//   },
//   headerCtaText: { color: '#fff', fontWeight: '800' },

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
//   secondaryBtnText: { color: '#ffffff', fontWeight: '800' },

//   // Inline link for empty state
//   inlineLink: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'flex-start',
//     paddingVertical: 6,
//     paddingHorizontal: 4,
//   },
//   inlineLinkText: {
//     color: Colors.button,
//     fontWeight: '800',
//     textDecorationLine: 'underline',
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
import { useFocusEffect } from '@react-navigation/native';

import Screen from '../components/Screen';
import { Colors } from '../constants/colors';
import { resetRealtime, supabase } from '../supabase';
import { createTaggedLogger } from '../utils/logger';

import {
  loadFriendLists,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriendship,
} from '../services/friendsService';

const L = createTaggedLogger('FriendsList');

export default function FriendsListScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [incoming, setIncoming] = useState([]);
  const [friends, setFriends] = useState([]);
  const [workingIds, setWorkingIds] = useState({});
  const userIdRef = useRef(null);

  const friendsRtRef = useRef(null);
  const profilesRtRef = useRef(null);

  const markWorking = (id, flag) =>
    setWorkingIds((w) => ({ ...w, [id]: !!flag }));

  // Service-driven load
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userIdRef.current = user?.id ?? null;

      const data = await loadFriendLists();
      setIncoming(data.incoming);
      setFriends(data.friends);
      L.debug(
        'load complete: incoming=',
        data.incoming.length,
        'friends=',
        data.friends.length
      );
    } catch (e) {
      L.error('load error:', e?.message || e);
      Alert.alert('Error', e?.message || String(e));
      setIncoming([]);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Refresh whenever this screen regains focus
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  // realtime: friendships changes affecting me
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const reqFilter = `requester_id=eq.${user.id}`;
      const addFilter = `addressee_id=eq.${user.id}`;
      L.info('[rt] filters:', reqFilter, addFilter);
      resetRealtime();

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
            filter: reqFilter,
          },
          () => load()
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'friendships',
            filter: addFilter,
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

  // realtime: profile display changes for visible people
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
      await acceptFriendRequest(row.friendship_id);
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
      await declineFriendRequest(row.friendship_id);
    } catch (e) {
      setIncoming(prevIncoming);
      Alert.alert('Error', e?.message || 'Could not decline request.');
    } finally {
      markWorking(row.friendship_id, false);
    }
  };

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
          <View className="loadingRow" style={styles.loadingRow}>
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
                                    await removeFriendship(
                                      r.friendship_id,
                                      r.person?.id
                                    );
                                    setFriends((list) =>
                                      list.filter(
                                        (x) =>
                                          x.friendship_id !== r.friendship_id
                                      )
                                    );
                                    await load();
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
