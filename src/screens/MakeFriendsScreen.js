// // // src/screens/MakeFriendsScreen.js
// // import React, {
// //   useCallback,
// //   useEffect,
// //   useMemo,
// //   useRef,
// //   useState,
// // } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   Alert,
// //   TextInput,
// // } from 'react-native';
// // import { useFocusEffect } from '@react-navigation/native';
// // import { Ionicons } from '@expo/vector-icons';

// // import Screen from '../components/Screen';
// // import { Colors } from '../constants/colors';
// // import { supabase } from '../supabase';

// // export default function MakeFriendsScreen({ navigation }) {
// //   const [query, setQuery] = useState('');
// //   const [searching, setSearching] = useState(false);
// //   const [searchResult, setSearchResult] = useState(null);

// //   const [loading, setLoading] = useState(true);
// //   const [incoming, setIncoming] = useState([]);
// //   const [outgoing, setOutgoing] = useState([]);
// //   const [friends, setFriends] = useState([]);

// //   const meRef = useRef(null);
// //   const channelRef = useRef(null);

// //   const isUUID = (s) => /^[0-9a-f-]{36}$/i.test(String(s).trim());

// //   const loadAll = useCallback(async () => {
// //     setLoading(true);
// //     try {
// //       const {
// //         data: { user },
// //       } = await supabase.auth.getUser();
// //       if (!user) {
// //         setIncoming([]);
// //         setOutgoing([]);
// //         setFriends([]);
// //         setLoading(false);
// //         return;
// //       }
// //       meRef.current = user.id;

// //       const { data: rows, error } = await supabase
// //         .from('friendships')
// //         .select('id, requester_id, addressee_id, status, created_at')
// //         .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
// //         .order('created_at', { ascending: false });

// //       if (error) throw error;

// //       const otherIds = Array.from(
// //         new Set(
// //           (rows || []).map((r) =>
// //             r.requester_id === user.id ? r.addressee_id : r.requester_id
// //           )
// //         )
// //       );

// //       let profiles = {};
// //       if (otherIds.length) {
// //         const { data: profs, error: pErr } = await supabase
// //           .from('profiles')
// //           .select('id, display_name')
// //           .in('id', otherIds);

// //         if (pErr) throw pErr;

// //         profiles = Object.fromEntries(
// //           (profs || []).map((p) => [p.id, (p.display_name || '').trim()])
// //         );
// //       }

// //       const mine = user.id;

// //       setIncoming(
// //         rows
// //           .filter((r) => r.status === 'pending' && r.addressee_id === mine)
// //           .map((r) => ({
// //             ...r,
// //             other_id: r.requester_id,
// //             other_name: profiles[r.requester_id] || 'Unknown user',
// //           }))
// //       );

// //       setOutgoing(
// //         rows
// //           .filter((r) => r.status === 'pending' && r.requester_id === mine)
// //           .map((r) => ({
// //             ...r,
// //             other_id: r.addressee_id,
// //             other_name: profiles[r.addressee_id] || 'Unknown user',
// //           }))
// //       );

// //       setFriends(
// //         rows
// //           .filter((r) => r.status === 'accepted')
// //           .map((r) => {
// //             const other =
// //               r.requester_id === mine ? r.addressee_id : r.requester_id;
// //             return {
// //               ...r,
// //               other_id: other,
// //               other_name: profiles[other] || 'Unknown user',
// //             };
// //           })
// //       );
// //     } catch (e) {
// //       console.warn('Friends load error:', e?.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

// //   useFocusEffect(
// //     useCallback(() => {
// //       loadAll();
// //     }, [loadAll])
// //   );

// //   useEffect(() => {
// //     (async () => {
// //       const {
// //         data: { user },
// //       } = await supabase.auth.getUser();
// //       if (!user) return;
// //       meRef.current = user.id;

// //       if (channelRef.current) {
// //         supabase.removeChannel(channelRef.current);
// //         channelRef.current = null;
// //       }

// //       const ch = supabase
// //         .channel('friendships-live')
// //         .on(
// //           'postgres_changes',
// //           { event: '*', schema: 'public', table: 'friendships' },
// //           (payload) => {
// //             const row = payload.new || payload.old;
// //             if (!row) return;
// //             if (
// //               row.requester_id === meRef.current ||
// //               row.addressee_id === meRef.current
// //             ) {
// //               loadAll();
// //             }
// //           }
// //         )
// //         .subscribe();

// //       channelRef.current = ch;
// //     })();

// //     return () => {
// //       if (channelRef.current) {
// //         supabase.removeChannel(channelRef.current);
// //         channelRef.current = null;
// //       }
// //     };
// //   }, [loadAll]);

// //   // ✅ UUID-only search
// //   const onSearch = async () => {
// //     const q = query.trim();

// //     if (!isUUID(q)) {
// //       Alert.alert('Invalid ID', 'Please enter a valid full User ID (UUID).');
// //       setSearchResult(null);
// //       return;
// //     }

// //     setSearching(true);
// //     try {
// //       const { data, error } = await supabase
// //         .from('profiles')
// //         .select('id, display_name')
// //         .eq('id', q)
// //         .single();

// //       if (error || !data) {
// //         throw new Error('User not found.');
// //       }

// //       setSearchResult(data);
// //     } catch (e) {
// //       setSearchResult(null);
// //       Alert.alert('Not found', 'No user exists with that ID.');
// //     } finally {
// //       setSearching(false);
// //     }
// //   };

// //   const sendRequest = async (targetId) => {
// //     if (!meRef.current) return;

// //     if (targetId === meRef.current) {
// //       Alert.alert('Oops', "You can't send a request to yourself.");
// //       return;
// //     }

// //     try {
// //       const { error } = await supabase.from('friendships').insert({
// //         requester_id: meRef.current,
// //         addressee_id: targetId,
// //         status: 'pending',
// //       });

// //       if (error) throw error;

// //       Alert.alert('Sent', 'Friend request sent!');
// //       setQuery('');
// //       setSearchResult(null);
// //       await loadAll();
// //     } catch (e) {
// //       Alert.alert('Error', e?.message || 'Could not send request.');
// //     }
// //   };

// //   const acceptRequest = async (row) => {
// //     try {
// //       const { error } = await supabase
// //         .from('friendships')
// //         .update({ status: 'accepted' })
// //         .eq('id', row.id)
// //         .eq('addressee_id', meRef.current);

// //       if (error) throw error;
// //       await loadAll();
// //     } catch (e) {
// //       Alert.alert('Error', 'Could not accept request.');
// //     }
// //   };

// //   const declineRequest = async (row) => {
// //     try {
// //       const { error } = await supabase
// //         .from('friendships')
// //         .delete()
// //         .eq('id', row.id)
// //         .eq('addressee_id', meRef.current);

// //       if (error) throw error;
// //       await loadAll();
// //     } catch (e) {
// //       Alert.alert('Error', 'Could not decline request.');
// //     }
// //   };

// //   const cancelOutgoing = async (row) => {
// //     try {
// //       const { error } = await supabase
// //         .from('friendships')
// //         .delete()
// //         .eq('id', row.id)
// //         .eq('requester_id', meRef.current);

// //       if (error) throw error;
// //       await loadAll();
// //     } catch (e) {
// //       Alert.alert('Error', 'Could not cancel request.');
// //     }
// //   };

// //   const unfriend = async (row) => {
// //     try {
// //       const { error } = await supabase
// //         .from('friendships')
// //         .delete()
// //         .eq('id', row.id);

// //       if (error) throw error;
// //       await loadAll();
// //     } catch (e) {
// //       Alert.alert('Error', 'Could not remove friend.');
// //     }
// //   };

// //   const Section = ({ title, children }) => (
// //     <>
// //       <Text style={styles.sectionTitle}>{title}</Text>
// //       {children}
// //     </>
// //   );

// //   const Row = ({ left, right }) => (
// //     <View style={styles.row}>
// //       <Text style={styles.rowLeft}>{left}</Text>
// //       <View style={{ flexDirection: 'row', gap: 8 }}>{right}</View>
// //     </View>
// //   );

// //   return (
// //     <Screen showBack onBack={() => navigation.goBack()}>
// //       <ScrollView contentContainerStyle={styles.content}>
// //         <Text style={styles.title}>Find Your Friends! 🌍</Text>
// //         <Text style={styles.subtitle}>
// //           Proverbs 27:17 “As iron sharpens iron, so one person sharpens another”
// //         </Text>

// //         <View style={styles.searchRow}>
// //           <View style={styles.searchInputWrap}>
// //             <Ionicons
// //               name="search"
// //               size={18}
// //               color="#8aa2b2"
// //               style={{ marginRight: 8 }}
// //             />
// //             <TextInput
// //               value={query}
// //               onChangeText={setQuery}
// //               placeholder="Enter full User ID"
// //               placeholderTextColor="#9fb1c1"
// //               style={styles.searchInput}
// //               autoCapitalize="none"
// //               autoCorrect={false}
// //             />
// //           </View>

// //           <TouchableOpacity
// //             onPress={onSearch}
// //             style={styles.primaryBtn}
// //             disabled={searching}
// //           >
// //             {searching ? (
// //               <ActivityIndicator color="#fff" />
// //             ) : (
// //               <Text style={styles.primaryBtnText}>Search</Text>
// //             )}
// //           </TouchableOpacity>
// //         </View>

// //         {searchResult && (
// //           <View style={styles.searchCard}>
// //             <Text style={styles.searchName}>
// //               {searchResult.display_name || '(no name set)'}
// //             </Text>
// //             <Text style={styles.searchSub}>{searchResult.id}</Text>

// //             <TouchableOpacity
// //               onPress={() => sendRequest(searchResult.id)}
// //               style={[
// //                 styles.primaryBtn,
// //                 { alignSelf: 'flex-start', marginTop: 10 },
// //               ]}
// //             >
// //               <Ionicons
// //                 name="person-add-outline"
// //                 size={18}
// //                 color="#fff"
// //                 style={{ marginRight: 8 }}
// //               />
// //               <Text style={styles.primaryBtnText}>Send Friend Request</Text>
// //             </TouchableOpacity>
// //           </View>
// //         )}

// //         {!searchResult && !query && (
// //           <View style={styles.tip}>
// //             <Text style={styles.tipText}>
// //               Enter a full User ID (UUID) to connect with friends!
// //             </Text>
// //           </View>
// //         )}

// //         {/* Incoming */}
// //         <Section title="Incoming Requests">
// //           {loading ? (
// //             <ActivityIndicator color={Colors.button} />
// //           ) : incoming.length === 0 ? (
// //             <Text style={styles.empty}>No incoming requests.</Text>
// //           ) : (
// //             incoming.map((r) => (
// //               <Row
// //                 key={r.id}
// //                 left={r.other_name}
// //                 right={
// //                   <>
// //                     <TouchableOpacity
// //                       style={styles.smallPrimary}
// //                       onPress={() => acceptRequest(r)}
// //                     >
// //                       <Text style={styles.smallPrimaryText}>Accept</Text>
// //                     </TouchableOpacity>

// //                     <TouchableOpacity
// //                       style={styles.smallGhost}
// //                       onPress={() => declineRequest(r)}
// //                     >
// //                       <Text style={styles.smallGhostText}>Decline</Text>
// //                     </TouchableOpacity>
// //                   </>
// //                 }
// //               />
// //             ))
// //           )}
// //         </Section>

// //         {/* Outgoing */}
// //         <Section title="Sent Requests">
// //           {loading ? (
// //             <ActivityIndicator color={Colors.button} />
// //           ) : outgoing.length === 0 ? (
// //             <Text style={styles.empty}>No pending requests.</Text>
// //           ) : (
// //             outgoing.map((r) => (
// //               <Row
// //                 key={r.id}
// //                 left={r.other_name}
// //                 right={
// //                   <TouchableOpacity
// //                     style={styles.smallGhost}
// //                     onPress={() => cancelOutgoing(r)}
// //                   >
// //                     <Text style={styles.smallGhostText}>Cancel</Text>
// //                   </TouchableOpacity>
// //                 }
// //               />
// //             ))
// //           )}
// //         </Section>

// //         {/* Friends */}
// //         <Section title="Friends">
// //           {loading ? (
// //             <ActivityIndicator color={Colors.button} />
// //           ) : friends.length === 0 ? (
// //             <Text style={styles.empty}>No friends yet.</Text>
// //           ) : (
// //             friends.map((r) => (
// //               <Row
// //                 key={r.id}
// //                 left={r.other_name}
// //                 right={
// //                   <TouchableOpacity
// //                     style={styles.smallGhost}
// //                     onPress={() =>
// //                       Alert.alert('Remove friend?', r.other_name, [
// //                         { text: 'Cancel', style: 'cancel' },
// //                         {
// //                           text: 'Remove',
// //                           style: 'destructive',
// //                           onPress: () => unfriend(r),
// //                         },
// //                       ])
// //                     }
// //                   >
// //                     <Text style={styles.smallGhostText}>Remove</Text>
// //                   </TouchableOpacity>
// //                 }
// //               />
// //             ))
// //           )}
// //         </Section>

// //         <View style={{ height: 30 }} />
// //       </ScrollView>
// //     </Screen>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   content: { paddingHorizontal: 16, paddingTop: 17, paddingBottom: 24 },
// //   title: { fontSize: 28, fontWeight: '800', color: Colors.button },
// //   subtitle: { color: Colors.text, marginTop: 6, marginBottom: 12 },

// //   searchRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 10,
// //     marginBottom: 10,
// //   },

// //   searchInputWrap: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     backgroundColor: '#e9eef3',
// //     borderRadius: 12,
// //     paddingHorizontal: 12,
// //     alignItems: 'center',
// //     height: 48,
// //   },

// //   searchInput: {
// //     flex: 1,
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: Colors.button,
// //   },

// //   primaryBtn: {
// //     backgroundColor: Colors.button,
// //     borderRadius: 12,
// //     paddingHorizontal: 16,
// //     height: 48,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     gap: 6,
// //   },

// //   primaryBtnText: { color: '#fff', fontWeight: '800' },

// //   tip: {
// //     backgroundColor: '#f7f3b8',
// //     padding: 12,
// //     borderRadius: 12,
// //     marginTop: 8,
// //   },
// //   tipText: { color: '#474747', fontWeight: '600' },

// //   searchCard: {
// //     backgroundColor: '#dcefff',
// //     padding: 14,
// //     borderRadius: 14,
// //     marginTop: 10,
// //     marginBottom: 16,
// //   },
// //   searchName: { fontSize: 18, fontWeight: '800', color: '#0d3a52' },
// //   searchSub: { color: '#3d6a85', marginTop: 4, fontSize: 12 },

// //   sectionTitle: {
// //     marginTop: 18,
// //     marginBottom: 8,
// //     fontSize: 20,
// //     fontWeight: '800',
// //     color: Colors.button,
// //   },
// //   empty: { color: Colors.text },

// //   row: {
// //     backgroundColor: '#e9eef3',
// //     borderRadius: 12,
// //     paddingHorizontal: 12,
// //     paddingVertical: 12,
// //     marginBottom: 8,
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },
// //   rowLeft: { fontWeight: '800', color: Colors.button },

// //   smallPrimary: {
// //     backgroundColor: Colors.button,
// //     paddingHorizontal: 12,
// //     paddingVertical: 8,
// //     borderRadius: 10,
// //   },
// //   smallPrimaryText: { color: '#fff', fontWeight: '800' },

// //   smallGhost: {
// //     borderColor: Colors.button,
// //     borderWidth: 2,
// //     borderRadius: 10,
// //     paddingHorizontal: 12,
// //     paddingVertical: 8,
// //   },
// //   smallGhostText: { color: Colors.button, fontWeight: '800' },
// // });

// // src/screens/MakeFriendsScreen.js
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import Screen from '../components/Screen';
// import { Colors } from '../constants/colors';
// import { supabase } from '../supabase';

// export default function MakeFriendsScreen({ navigation }) {
//   const [code, setCode] = useState('');
//   const [searching, setSearching] = useState(false);
//   const [target, setTarget] = useState(null); // { id, display_name, short_id }
//   const [sending, setSending] = useState(false);
//   const [note, setNote] = useState(
//     'Enter a User ID to find and connect with friends!'
//   );

//   // const onSearch = async () => {
//   //   const input = (code || '').trim().toUpperCase();
//   //   if (!input) {
//   //     setNote('Please enter a User ID.');
//   //     setTarget(null);
//   //     return;
//   //   }

//   //   setSearching(true);
//   //   setNote('');
//   //   setTarget(null);

//   //   try {
//   //     // Ensure we’re signed in
//   //     const {
//   //       data: { user },
//   //     } = await supabase.auth.getUser();
//   //     if (!user) {
//   //       setNote('You must be signed in.');
//   //       return;
//   //     }

//   //     // Strict search by short_id
//   //     const { data, error } = await supabase
//   //       .from('profiles')
//   //       .select('id, display_name, short_id')
//   //       .eq('short_id', input)
//   //       .single();

//   //     if (error) {
//   //       if (error.code === 'PGRST116') {
//   //         setNote('No user found with that User ID.');
//   //       } else {
//   //         setNote(error.message);
//   //       }
//   //       return;
//   //     }

//   //     if (data.id === user.id) {
//   //       setNote('That User ID is yours 🙂');
//   //       return;
//   //     }

//   //     setTarget(data);
//   //     setNote('');
//   //   } catch (e) {
//   //     setNote(e?.message || 'Search failed.');
//   //   } finally {
//   //     setSearching(false);
//   //   }
//   // };

//   const onSearch = async () => {
//     const input = (code || '')
//       .toUpperCase()
//       .replace(/[^A-Z0-9]/g, '')
//       .trim();

//     if (!input) {
//       setNote('Please enter a User ID.');
//       setTarget(null);
//       return;
//     }
//     // Expect 7–9 chars based on your generator; tweak if needed
//     if (input.length < 6 || input.length > 12) {
//       setNote('That doesn’t look like a valid User ID.');
//       setTarget(null);
//       return;
//     }

//     setSearching(true);
//     setNote('');
//     setTarget(null);

//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) {
//         setNote('You must be signed in.');
//         return;
//       }

//       const { data, error } = await supabase
//         .from('profiles')
//         .select('id, display_name, short_id')
//         .eq('short_id', input)
//         .single();

//       if (error) {
//         if (error.code === 'PGRST116') {
//           setNote('No user found with that User ID.');
//         } else {
//           setNote(error.message);
//         }
//         return;
//       }

//       if (data.id === user.id) {
//         setNote('That User ID is yours 🙂');
//         return;
//       }

//       setTarget(data);
//       setNote('');
//     } catch (e) {
//       setNote(e?.message || 'Search failed.');
//     } finally {
//       setSearching(false);
//     }
//   };

//   const sendRequest = async () => {
//     if (!target) return;
//     setSending(true);
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) {
//         Alert.alert('Not signed in', 'Please reopen the app.');
//         return;
//       }

//       // Optional: prevent duplicate requests (both directions)
//       const { data: existing, error: existingErr } = await supabase
//         .from('friendships')
//         .select('id, status')
//         .or(
//           `and(requester_id.eq.${user.id},addressee_id.eq.${target.id}),and(requester_id.eq.${target.id},addressee_id.eq.${user.id})`
//         )
//         .limit(1);

//       if (existingErr) throw existingErr;
//       if (existing && existing.length) {
//         Alert.alert(
//           'Already requested',
//           'A friendship already exists or is pending.'
//         );
//         return;
//       }

//       const { error } = await supabase.from('friendships').insert({
//         requester_id: user.id,
//         addressee_id: target.id,
//         status: 'pending',
//       });

//       if (error) throw error;

//       Alert.alert(
//         'Request sent',
//         `Your request to ${target.display_name || target.short_id} is pending.`
//       );
//       setTarget(null);
//       setCode('');
//       setNote('Enter a User ID to find and connect with friends!');
//     } catch (e) {
//       Alert.alert('Error', e?.message || 'Could not send request.');
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <Screen showBack onBack={() => navigation.goBack()}>
//       <ScrollView
//         contentContainerStyle={styles.content}
//         keyboardShouldPersistTaps="handled"
//       >
//         <Text style={styles.title}>Find Your Friends! 🌍</Text>
//         <Text style={styles.subtitle}>
//           Proverbs 27:17 “As iron sharpens iron, so one person sharpens another”
//         </Text>

//         <View style={styles.searchRow}>
//           <View style={styles.inputWrap}>
//             <Ionicons
//               name="search"
//               size={18}
//               color="#7a8699"
//               style={{ marginRight: 6 }}
//             />
//             <TextInput
//               value={code}
//               onChangeText={(t) => setCode(t)}
//               autoCapitalize="characters"
//               autoCorrect={false}
//               placeholder="Search for User ID"
//               placeholderTextColor="#9fb1c1"
//               style={styles.input}
//             />
//           </View>

//           <TouchableOpacity
//             onPress={onSearch}
//             activeOpacity={0.9}
//             disabled={searching}
//             style={[styles.searchBtn, searching && { opacity: 0.6 }]}
//           >
//             {searching ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.searchText}>Search</Text>
//             )}
//           </TouchableOpacity>
//         </View>

//         {!!note && (
//           <View style={styles.note}>
//             <Text style={styles.noteText}>{note}</Text>
//           </View>
//         )}

//         {target && (
//           <View style={styles.resultCard}>
//             <Text style={styles.resultName}>
//               {target.display_name || 'Unnamed User'}
//             </Text>
//             <Text style={styles.resultMeta}>User ID: {target.short_id}</Text>

//             <TouchableOpacity
//               onPress={sendRequest}
//               activeOpacity={0.9}
//               disabled={sending}
//               style={[styles.primaryBtn, sending && { opacity: 0.6 }]}
//             >
//               {sending ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <>
//                   <Ionicons
//                     name="person-add-outline"
//                     size={18}
//                     color="#fff"
//                     style={{ marginRight: 8 }}
//                   />
//                   <Text style={styles.primaryBtnText}>Send Friend Request</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>
//         )}
//       </ScrollView>
//     </Screen>
//   );
// }

// const styles = StyleSheet.create({
//   content: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 17 },
//   title: { fontSize: 32, fontWeight: '800', color: Colors.button },
//   subtitle: { color: Colors.text, marginTop: 6, marginBottom: 12 },

//   searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   inputWrap: {
//     flex: 1,
//     backgroundColor: '#e9eef3',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     height: 48,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   input: { flex: 1, color: Colors.button, fontWeight: '700', fontSize: 16 },

//   searchBtn: {
//     backgroundColor: Colors.button,
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     height: 48,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   searchText: { color: '#fff', fontWeight: '800' },

//   note: {
//     marginTop: 12,
//     backgroundColor: '#F5EEA6',
//     paddingVertical: 14,
//     paddingHorizontal: 12,
//     borderRadius: 12,
//   },
//   noteText: { color: '#3c3c3c', fontWeight: '700', textAlign: 'center' },

//   resultCard: {
//     marginTop: 16,
//     backgroundColor: '#1c7293',
//     borderRadius: 16,
//     padding: 14,
//   },
//   resultName: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '800',
//     marginBottom: 4,
//   },
//   resultMeta: { color: '#cfe1ee', fontSize: 12, marginBottom: 12 },

//   primaryBtn: {
//     backgroundColor: Colors.button,
//     borderRadius: 14,
//     paddingVertical: 12,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   primaryBtnText: { color: '#fff', fontWeight: '800' },
// });

// src/screens/MakeFriendsScreen.js
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import { Colors } from '../constants/colors';
import { supabase } from '../supabase';

export default function MakeFriendsScreen({ navigation }) {
  const [code, setCode] = useState('');
  const [searching, setSearching] = useState(false);
  const [target, setTarget] = useState(null); // { id, display_name, short_id }
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState(
    'Enter a User ID to find and connect with friends!'
  );

  // New: requests state
  const [loadingLists, setLoadingLists] = useState(true);
  const [incoming, setIncoming] = useState([]); // requests where I am addressee & status=pending
  const [outgoing, setOutgoing] = useState([]); // requests I sent & status=pending

  const loadLists = useCallback(async () => {
    setLoadingLists(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setIncoming([]);
        setOutgoing([]);
        setLoadingLists(false);
        return;
      }

      // Incoming pending (others → me)
      const { data: inc, error: incErr } = await supabase
        .from('friendships')
        .select(
          `
            id, requester_id, addressee_id, status, created_at,
            requester:profiles!friendships_requester_id_fkey(id, display_name, short_id)
          `
        )
        .eq('addressee_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (incErr) throw incErr;

      // Outgoing pending (me → others)
      const { data: out, error: outErr } = await supabase
        .from('friendships')
        .select(
          `
            id, requester_id, addressee_id, status, created_at,
            addressee:profiles!friendships_addressee_id_fkey(id, display_name, short_id)
          `
        )
        .eq('requester_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (outErr) throw outErr;

      setIncoming(inc || []);
      setOutgoing(out || []);
    } catch (e) {
      console.warn('Load friend lists error:', e?.message);
      setIncoming([]);
      setOutgoing([]);
    } finally {
      setLoadingLists(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLists();
    }, [loadLists])
  );

  const onSearch = async () => {
    const input = (code || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .trim();

    if (!input) {
      setNote('Please enter a User ID.');
      setTarget(null);
      return;
    }
    // Expect 7–12 chars; adjust if your generator differs
    if (input.length < 6 || input.length > 12) {
      setNote('That doesn’t look like a valid User ID.');
      setTarget(null);
      return;
    }

    setSearching(true);
    setNote('');
    setTarget(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setNote('You must be signed in.');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, short_id')
        .eq('short_id', input)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setNote('No user found with that User ID.');
        } else {
          setNote(error.message);
        }
        return;
      }

      if (data.id === user.id) {
        setNote('That User ID is yours 🙂');
        return;
      }

      setTarget(data);
      setNote('');
    } catch (e) {
      setNote(e?.message || 'Search failed.');
    } finally {
      setSearching(false);
    }
  };

  const sendRequest = async () => {
    if (!target) return;
    setSending(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Not signed in', 'Please reopen the app.');
        return;
      }

      // Prevent duplicates in either direction
      const { data: existing, error: existingErr } = await supabase
        .from('friendships')
        .select('id, status')
        .or(
          `and(requester_id.eq.${user.id},addressee_id.eq.${target.id}),and(requester_id.eq.${target.id},addressee_id.eq.${user.id})`
        )
        .limit(1);

      if (existingErr) throw existingErr;
      if (existing && existing.length) {
        Alert.alert(
          'Already requested',
          'A friendship already exists or is pending.'
        );
        return;
      }

      const { error } = await supabase.from('friendships').insert({
        requester_id: user.id,
        addressee_id: target.id,
        status: 'pending',
      });

      if (error) throw error;

      Alert.alert(
        'Request sent',
        `Your request to ${target.display_name || target.short_id} is pending.`
      );
      setTarget(null);
      setCode('');
      setNote('Enter a User ID to find and connect with friends!');
      // Refresh lists so the new pending shows
      loadLists();
    } catch (e) {
      Alert.alert('Error', e?.message || 'Could not send request.');
    } finally {
      setSending(false);
    }
  };

  // Actions on incoming
  const acceptRequest = async (row) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', row.id);
      if (error) throw error;
      loadLists();
      Alert.alert('Friend added', 'You are now friends!');
    } catch (e) {
      Alert.alert('Error', e?.message || 'Could not accept request.');
    }
  };

  const declineRequest = async (row) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', row.id);
      if (error) throw error;
      loadLists();
    } catch (e) {
      Alert.alert('Error', e?.message || 'Could not decline request.');
    }
  };

  // Actions on outgoing
  const cancelRequest = async (row) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', row.id);
      if (error) throw error;
      loadLists();
    } catch (e) {
      Alert.alert('Error', e?.message || 'Could not cancel request.');
    }
  };

  const fmtName = (p) => p?.display_name || p?.short_id || 'User';

  return (
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Find Your Friends! 🌍</Text>
        <Text style={styles.subtitle}>
          Proverbs 27:17 “As iron sharpens iron, so one person sharpens another”
        </Text>

        {/* Search row */}
        <View style={styles.searchRow}>
          <View style={styles.inputWrap}>
            <Ionicons
              name="search"
              size={18}
              color="#7a8699"
              style={{ marginRight: 6 }}
            />
            <TextInput
              value={code}
              onChangeText={(t) => setCode(t)}
              autoCapitalize="characters"
              autoCorrect={false}
              placeholder="Search for User ID"
              placeholderTextColor="#9fb1c1"
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            onPress={onSearch}
            activeOpacity={0.9}
            disabled={searching}
            style={[styles.searchBtn, searching && { opacity: 0.6 }]}
          >
            {searching ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.searchText}>Search</Text>
            )}
          </TouchableOpacity>
        </View>

        {!!note && (
          <View style={styles.note}>
            <Text style={styles.noteText}>{note}</Text>
          </View>
        )}

        {/* Search result card */}
        {target && (
          <View style={styles.resultCard}>
            <Text style={styles.resultName}>
              {target.display_name || 'Unnamed User'}
            </Text>
            <Text style={styles.resultMeta}>User ID: {target.short_id}</Text>

            <TouchableOpacity
              onPress={sendRequest}
              activeOpacity={0.9}
              disabled={sending}
              style={[styles.primaryBtn, sending && { opacity: 0.6 }]}
            >
              {sending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons
                    name="person-add-outline"
                    size={18}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.primaryBtnText}>Send Friend Request</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Incoming & Outgoing sections */}
        <View style={{ height: 16 }} />

        <Text style={styles.sectionTitle}>Friend Invites</Text>
        {loadingLists ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={Colors.button} />
            <Text style={{ color: Colors.text, marginLeft: 8 }}>Loading…</Text>
          </View>
        ) : incoming.length === 0 ? (
          <Text style={{ color: Colors.text }}>No incoming invites.</Text>
        ) : (
          incoming.map((row) => (
            <View key={row.id} style={styles.inviteCard}>
              <Text style={styles.inviteTitle}>{fmtName(row.requester)}</Text>
              <Text style={styles.inviteMeta}>
                User ID: {row.requester?.short_id}
              </Text>
              <View style={styles.rowBtns}>
                <TouchableOpacity
                  onPress={() => acceptRequest(row)}
                  style={[styles.smallBtn, styles.acceptBtn]}
                  activeOpacity={0.9}
                >
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.smallBtnText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => declineRequest(row)}
                  style={[styles.smallBtn, styles.declineBtn]}
                  activeOpacity={0.9}
                >
                  <Ionicons name="close" size={16} color="#fff" />
                  <Text style={styles.smallBtnText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 16 }} />

        <Text style={styles.sectionTitle}>Pending Requests</Text>
        {loadingLists ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={Colors.button} />
            <Text style={{ color: Colors.text, marginLeft: 8 }}>Loading…</Text>
          </View>
        ) : outgoing.length === 0 ? (
          <Text style={{ color: Colors.text }}>You haven’t sent any yet.</Text>
        ) : (
          outgoing.map((row) => (
            <View key={row.id} style={styles.inviteCard}>
              <Text style={styles.inviteTitle}>{fmtName(row.addressee)}</Text>
              <Text style={styles.inviteMeta}>
                User ID: {row.addressee?.short_id}
              </Text>
              <View style={styles.rowBtns}>
                <TouchableOpacity
                  onPress={() => cancelRequest(row)}
                  style={[styles.smallBtn, styles.declineBtn]}
                  activeOpacity={0.9}
                >
                  <Ionicons name="trash-outline" size={16} color="#fff" />
                  <Text style={styles.smallBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 17 },
  title: { fontSize: 32, fontWeight: '800', color: Colors.button },
  subtitle: { color: Colors.text, marginTop: 6, marginBottom: 12 },

  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  inputWrap: {
    flex: 1,
    backgroundColor: '#e9eef3',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { flex: 1, color: Colors.button, fontWeight: '700', fontSize: 16 },

  searchBtn: {
    backgroundColor: Colors.button,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchText: { color: '#fff', fontWeight: '800' },

  note: {
    marginTop: 12,
    backgroundColor: '#F5EEA6',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  noteText: { color: '#3c3c3c', fontWeight: '700', textAlign: 'center' },

  resultCard: {
    marginTop: 16,
    backgroundColor: '#1c7293',
    borderRadius: 16,
    padding: 14,
  },
  resultName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  resultMeta: { color: '#cfe1ee', fontSize: 12, marginBottom: 12 },

  primaryBtn: {
    backgroundColor: Colors.button,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },

  sectionTitle: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 20,
    fontWeight: '800',
    color: Colors.button,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },

  inviteCard: {
    backgroundColor: '#1c7293',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  inviteTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  inviteMeta: { color: '#cfe1ee', fontSize: 12, marginBottom: 12 },

  rowBtns: { flexDirection: 'row', gap: 8 },
  smallBtn: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  acceptBtn: { backgroundColor: '#1b8a5a' },
  declineBtn: { backgroundColor: '#b00020' },
  smallBtnText: { color: '#fff', fontWeight: '800' },
});
