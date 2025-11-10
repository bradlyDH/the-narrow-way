// // // // // // // // // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // // // // // // // // import React from 'react';
// // // // // // // // // import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// // // // // // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // // // // // import { Colors } from './src/constants/colors';
// // // // // // // // // import HomeScreen from './src/screens/HomeScreen';
// // // // // // // // // import PrayerListScreen from './src/screens/PrayerListScreen';
// // // // // // // // // import AnsweredPrayersScreen from './src/screens/AnsweredPrayersScreen';
// // // // // // // // // import QuestScreen from './src/screens/QuestScreen';
// // // // // // // // // import ProgressScreen from './src/screens/ProgressScreen';
// // // // // // // // // import EncouragementScreen from './src/screens/EncouragementScreen';
// // // // // // // // // import ReceivedEncouragementsScreen from './src/screens/ReceivedEncouragementsScreen';
// // // // // // // // // import MakeFriendsScreen from './src/screens/MakeFriendsScreen';
// // // // // // // // // import FriendsListScreen from './src/screens/FriendsListScreen';
// // // // // // // // // import ProfileScreen from './src/screens/ProfileScreen';
// // // // // // // // // import DonationsScreen from './src/screens/DonationsScreen';
// // // // // // // // // import ResourcesScreen from './src/screens/ResourcesScreen';
// // // // // // // // // import { useEffect, useState } from 'react';
// // // // // // // // // import { ActivityIndicator, View } from 'react-native';
// // // // // // // // // import { ensureSessionAndProfile } from './src/auth/bootstrap';
// // // // // // // // // import { supabase } from './src/supabase';

// // // // // // // // // // ✅ Run this immediately on app load
// // // // // // // // // (async () => {
// // // // // // // // //   const {
// // // // // // // // //     data: { session },
// // // // // // // // //   } = await supabase.auth.getSession();
// // // // // // // // //   if (!session) {
// // // // // // // // //     await supabase.auth.signInAnonymously();
// // // // // // // // //   }
// // // // // // // // // })();

// // // // // // // // // const Stack = createNativeStackNavigator();
// // // // // // // // // const AppTheme = {
// // // // // // // // //   ...DefaultTheme,
// // // // // // // // //   colors: { ...DefaultTheme.colors, background: Colors.background },
// // // // // // // // // };

// // // // // // // // // export default function App() {
// // // // // // // // //   const [ready, setReady] = useState(false);

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     (async () => {
// // // // // // // // //       try {
// // // // // // // // //         await ensureSessionAndProfile();
// // // // // // // // //       } finally {
// // // // // // // // //         setReady(true);
// // // // // // // // //       }
// // // // // // // // //     })();
// // // // // // // // //   }, []);

// // // // // // // // //   if (!ready) {
// // // // // // // // //     return (
// // // // // // // // //       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
// // // // // // // // //         <ActivityIndicator />
// // // // // // // // //       </View>
// // // // // // // // //     );
// // // // // // // // //   }
// // // // // // // // //   return (
// // // // // // // // //     <SafeAreaProvider>
// // // // // // // // //       <NavigationContainer theme={AppTheme}>
// // // // // // // // //         <Stack.Navigator
// // // // // // // // //           screenOptions={{
// // // // // // // // //             headerShown: false, // hide native header so our custom banner is the only one
// // // // // // // // //             contentStyle: { backgroundColor: Colors.background },
// // // // // // // // //           }}
// // // // // // // // //         >
// // // // // // // // //           <Stack.Screen name="Home" component={HomeScreen} />
// // // // // // // // //           <Stack.Screen name="PrayerList" component={PrayerListScreen} />
// // // // // // // // //           <Stack.Screen
// // // // // // // // //             name="AnsweredPrayers"
// // // // // // // // //             component={AnsweredPrayersScreen}
// // // // // // // // //           />
// // // // // // // // //           <Stack.Screen name="Quest" component={QuestScreen} />
// // // // // // // // //           <Stack.Screen name="Progress" component={ProgressScreen} />
// // // // // // // // //           <Stack.Screen name="Encouragement" component={EncouragementScreen} />
// // // // // // // // //           <Stack.Screen
// // // // // // // // //             name="ReceivedEncouragements"
// // // // // // // // //             component={ReceivedEncouragementsScreen}
// // // // // // // // //           />
// // // // // // // // //           <Stack.Screen name="MakeFriends" component={MakeFriendsScreen} />
// // // // // // // // //           <Stack.Screen name="FriendsList" component={FriendsListScreen} />
// // // // // // // // //           <Stack.Screen name="Profile" component={ProfileScreen} />
// // // // // // // // //           <Stack.Screen name="Donations" component={DonationsScreen} />
// // // // // // // // //           <Stack.Screen name="Resources" component={ResourcesScreen} />
// // // // // // // // //         </Stack.Navigator>
// // // // // // // // //       </NavigationContainer>
// // // // // // // // //     </SafeAreaProvider>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // App.js
// // // // // // // // import 'react-native-gesture-handler'; // (keeps things safe in Expo too)
// // // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // // import { ActivityIndicator, View } from 'react-native';
// // // // // // // // import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// // // // // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // // // // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // // // // // // // import { SafeAreaProvider } from 'react-native-safe-area-context';

// // // // // // // // import { Colors } from './src/constants/colors';
// // // // // // // // import HomeScreen from './src/screens/HomeScreen';
// // // // // // // // import PrayerListScreen from './src/screens/PrayerListScreen';
// // // // // // // // import AnsweredPrayersScreen from './src/screens/AnsweredPrayersScreen';
// // // // // // // // import QuestScreen from './src/screens/QuestScreen';
// // // // // // // // import ProgressScreen from './src/screens/ProgressScreen';
// // // // // // // // import EncouragementScreen from './src/screens/EncouragementScreen';
// // // // // // // // import ReceivedEncouragementsScreen from './src/screens/ReceivedEncouragementsScreen';
// // // // // // // // import MakeFriendsScreen from './src/screens/MakeFriendsScreen';
// // // // // // // // import FriendsListScreen from './src/screens/FriendsListScreen';
// // // // // // // // import ProfileScreen from './src/screens/ProfileScreen';
// // // // // // // // import DonationsScreen from './src/screens/DonationsScreen';
// // // // // // // // import ResourcesScreen from './src/screens/ResourcesScreen';

// // // // // // // // import { ensureSessionAndProfile } from './src/auth/bootstrap';
// // // // // // // // import { supabase } from './src/supabase';

// // // // // // // // // ✅ Ensure an anonymous session exists on boot
// // // // // // // // (async () => {
// // // // // // // //   const {
// // // // // // // //     data: { session },
// // // // // // // //   } = await supabase.auth.getSession();
// // // // // // // //   if (!session) {
// // // // // // // //     await supabase.auth.signInAnonymously();
// // // // // // // //   }
// // // // // // // // })();

// // // // // // // // const Stack = createNativeStackNavigator();
// // // // // // // // const AppTheme = {
// // // // // // // //   ...DefaultTheme,
// // // // // // // //   colors: { ...DefaultTheme.colors, background: Colors.background },
// // // // // // // // };

// // // // // // // // export default function App() {
// // // // // // // //   const [ready, setReady] = useState(false);

// // // // // // // //   useEffect(() => {
// // // // // // // //     (async () => {
// // // // // // // //       try {
// // // // // // // //         await ensureSessionAndProfile();
// // // // // // // //       } finally {
// // // // // // // //         setReady(true);
// // // // // // // //       }
// // // // // // // //     })();
// // // // // // // //   }, []);

// // // // // // // //   if (!ready) {
// // // // // // // //     return (
// // // // // // // //       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
// // // // // // // //         <ActivityIndicator />
// // // // // // // //       </View>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return (
// // // // // // // //     <GestureHandlerRootView style={{ flex: 1 }}>
// // // // // // // //       <SafeAreaProvider>
// // // // // // // //         <NavigationContainer theme={AppTheme}>
// // // // // // // //           <Stack.Navigator
// // // // // // // //             screenOptions={{
// // // // // // // //               headerShown: false,
// // // // // // // //               contentStyle: { backgroundColor: Colors.background },
// // // // // // // //             }}
// // // // // // // //           >
// // // // // // // //             <Stack.Screen name="Home" component={HomeScreen} />
// // // // // // // //             <Stack.Screen name="PrayerList" component={PrayerListScreen} />
// // // // // // // //             <Stack.Screen
// // // // // // // //               name="AnsweredPrayers"
// // // // // // // //               component={AnsweredPrayersScreen}
// // // // // // // //             />
// // // // // // // //             <Stack.Screen name="Quest" component={QuestScreen} />
// // // // // // // //             <Stack.Screen name="Progress" component={ProgressScreen} />
// // // // // // // //             <Stack.Screen
// // // // // // // //               name="Encouragement"
// // // // // // // //               component={EncouragementScreen}
// // // // // // // //             />
// // // // // // // //             <Stack.Screen
// // // // // // // //               name="ReceivedEncouragements"
// // // // // // // //               component={ReceivedEncouragementsScreen}
// // // // // // // //             />
// // // // // // // //             <Stack.Screen name="MakeFriends" component={MakeFriendsScreen} />
// // // // // // // //             <Stack.Screen name="FriendsList" component={FriendsListScreen} />
// // // // // // // //             <Stack.Screen name="Profile" component={ProfileScreen} />
// // // // // // // //             <Stack.Screen name="Donations" component={DonationsScreen} />
// // // // // // // //             <Stack.Screen name="Resources" component={ResourcesScreen} />
// // // // // // // //           </Stack.Navigator>
// // // // // // // //         </NavigationContainer>
// // // // // // // //       </SafeAreaProvider>
// // // // // // // //     </GestureHandlerRootView>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // // App.js
// // // // // // // // import 'react-native-gesture-handler';
// // // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // // import { ActivityIndicator, View } from 'react-native';
// // // // // // // // import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// // // // // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // // // // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // // // // // // // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // // // // // // // import { Ionicons } from '@expo/vector-icons';

// // // // // // // // import { Colors } from './src/constants/colors';
// // // // // // // // import HomeScreen from './src/screens/HomeScreen';
// // // // // // // // import PrayerListScreen from './src/screens/PrayerListScreen';
// // // // // // // // import AnsweredPrayersScreen from './src/screens/AnsweredPrayersScreen';
// // // // // // // // import QuestScreen from './src/screens/QuestScreen';
// // // // // // // // import ProgressScreen from './src/screens/ProgressScreen';
// // // // // // // // import EncouragementScreen from './src/screens/EncouragementScreen';
// // // // // // // // import ReceivedEncouragementsScreen from './src/screens/ReceivedEncouragementsScreen';
// // // // // // // // import MakeFriendsScreen from './src/screens/MakeFriendsScreen';
// // // // // // // // import FriendsListScreen from './src/screens/FriendsListScreen';
// // // // // // // // import ProfileScreen from './src/screens/ProfileScreen';
// // // // // // // // import DonationsScreen from './src/screens/DonationsScreen';
// // // // // // // // import ResourcesScreen from './src/screens/ResourcesScreen';

// // // // // // // // import { ensureSessionAndProfile } from './src/auth/bootstrap';
// // // // // // // // import { supabase } from './src/supabase';

// // // // // // // // // Ensure an anonymous session exists on boot
// // // // // // // // (async () => {
// // // // // // // //   const {
// // // // // // // //     data: { session },
// // // // // // // //   } = await supabase.auth.getSession();
// // // // // // // //   if (!session) await supabase.auth.signInAnonymously();
// // // // // // // // })();

// // // // // // // // const Stack = createNativeStackNavigator();
// // // // // // // // const Tab = createBottomTabNavigator();

// // // // // // // // const AppTheme = {
// // // // // // // //   ...DefaultTheme,
// // // // // // // //   colors: { ...DefaultTheme.colors, background: Colors.background },
// // // // // // // // };

// // // // // // // // // ---- Bottom Tabs (home + core areas) ----
// // // // // // // // function MainTabs() {
// // // // // // // //   return (
// // // // // // // //     <Tab.Navigator
// // // // // // // //       screenOptions={({ route }) => ({
// // // // // // // //         headerShown: false,
// // // // // // // //         tabBarActiveTintColor: '#fff',
// // // // // // // //         tabBarInactiveTintColor: '#c7d2fe',
// // // // // // // //         tabBarStyle: {
// // // // // // // //           backgroundColor: Colors.button,
// // // // // // // //           borderTopWidth: 0,
// // // // // // // //           height: 58,
// // // // // // // //           paddingBottom: 8,
// // // // // // // //           paddingTop: 6,
// // // // // // // //         },
// // // // // // // //         tabBarIcon: ({ color, size }) => {
// // // // // // // //           const map = {
// // // // // // // //             Home: 'home-outline',
// // // // // // // //             PrayerList: 'book-outline',
// // // // // // // //             Quest: 'flag-outline',
// // // // // // // //             Progress: 'stats-chart-outline',
// // // // // // // //             FriendsList: 'people-outline',
// // // // // // // //           };
// // // // // // // //           return <Ionicons name={map[route.name]} size={size} color={color} />;
// // // // // // // //         },
// // // // // // // //       })}
// // // // // // // //     >
// // // // // // // //       <Tab.Screen name="Home" component={HomeScreen} />
// // // // // // // //       <Tab.Screen name="PrayerList" component={PrayerListScreen} />
// // // // // // // //       <Tab.Screen name="Quest" component={QuestScreen} />
// // // // // // // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // // // // // // //       <Tab.Screen name="Friends" component={FriendsListScreen} />
// // // // // // // //     </Tab.Navigator>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // // ---- Root Stack (everything, with tabs as the entry) ----
// // // // // // // // export default function App() {
// // // // // // // //   const [ready, setReady] = useState(false);

// // // // // // // //   useEffect(() => {
// // // // // // // //     (async () => {
// // // // // // // //       try {
// // // // // // // //         await ensureSessionAndProfile();
// // // // // // // //       } finally {
// // // // // // // //         setReady(true);
// // // // // // // //       }
// // // // // // // //     })();
// // // // // // // //   }, []);

// // // // // // // //   if (!ready) {
// // // // // // // //     return (
// // // // // // // //       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
// // // // // // // //         <ActivityIndicator />
// // // // // // // //       </View>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return (
// // // // // // // //     <GestureHandlerRootView style={{ flex: 1 }}>
// // // // // // // //       <SafeAreaProvider>
// // // // // // // //         <NavigationContainer theme={AppTheme}>
// // // // // // // //           <Stack.Navigator
// // // // // // // //             screenOptions={{
// // // // // // // //               headerShown: false,
// // // // // // // //               contentStyle: { backgroundColor: Colors.background },
// // // // // // // //             }}
// // // // // // // //           >
// // // // // // // //             {/* Tabs are now the app's entry point */}
// // // // // // // //             <Stack.Screen name="MainTabs" component={MainTabs} />

// // // // // // // //             {/* Non-tab screens live on the stack */}
// // // // // // // //             <Stack.Screen
// // // // // // // //               name="AnsweredPrayers"
// // // // // // // //               component={AnsweredPrayersScreen}
// // // // // // // //             />
// // // // // // // //             <Stack.Screen
// // // // // // // //               name="Encouragement"
// // // // // // // //               component={EncouragementScreen}
// // // // // // // //             />
// // // // // // // //             <Stack.Screen
// // // // // // // //               name="ReceivedEncouragements"
// // // // // // // //               component={ReceivedEncouragementsScreen}
// // // // // // // //             />
// // // // // // // //             <Stack.Screen name="MakeFriends" component={MakeFriendsScreen} />
// // // // // // // //             <Stack.Screen name="Profile" component={ProfileScreen} />
// // // // // // // //             <Stack.Screen name="Donations" component={DonationsScreen} />
// // // // // // // //             <Stack.Screen name="Resources" component={ResourcesScreen} />
// // // // // // // //           </Stack.Navigator>
// // // // // // // //         </NavigationContainer>
// // // // // // // //       </SafeAreaProvider>
// // // // // // // //     </GestureHandlerRootView>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // App.js
// // // // // // // import 'react-native-gesture-handler';
// // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // import { ActivityIndicator, View } from 'react-native';
// // // // // // // import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// // // // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // // // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // // // // // // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // // // // // // import { Ionicons } from '@expo/vector-icons';

// // // // // // // import { Colors } from './src/constants/colors';
// // // // // // // import HomeScreen from './src/screens/HomeScreen';
// // // // // // // import PrayerListScreen from './src/screens/PrayerListScreen';
// // // // // // // import AnsweredPrayersScreen from './src/screens/AnsweredPrayersScreen';
// // // // // // // import QuestScreen from './src/screens/QuestScreen';
// // // // // // // import ProgressScreen from './src/screens/ProgressScreen';
// // // // // // // import EncouragementScreen from './src/screens/EncouragementScreen';
// // // // // // // import ReceivedEncouragementsScreen from './src/screens/ReceivedEncouragementsScreen';
// // // // // // // import MakeFriendsScreen from './src/screens/MakeFriendsScreen';
// // // // // // // import FriendsListScreen from './src/screens/FriendsListScreen';
// // // // // // // import ProfileScreen from './src/screens/ProfileScreen';
// // // // // // // import DonationsScreen from './src/screens/DonationsScreen';
// // // // // // // import ResourcesScreen from './src/screens/ResourcesScreen';

// // // // // // // import { ensureSessionAndProfile } from './src/auth/bootstrap';
// // // // // // // import { supabase } from './src/supabase';

// // // // // // // // Ensure an anonymous session exists on boot
// // // // // // // (async () => {
// // // // // // //   const {
// // // // // // //     data: { session },
// // // // // // //   } = await supabase.auth.getSession();
// // // // // // //   if (!session) await supabase.auth.signInAnonymously();
// // // // // // // })();

// // // // // // // const Stack = createNativeStackNavigator();
// // // // // // // const Tab = createBottomTabNavigator();

// // // // // // // const AppTheme = {
// // // // // // //   ...DefaultTheme,
// // // // // // //   colors: { ...DefaultTheme.colors, background: Colors.background },
// // // // // // // };

// // // // // // // // ---- Bottom Tabs (home + core areas) ----
// // // // // // // function MainTabs() {
// // // // // // //   return (
// // // // // // //     <Tab.Navigator
// // // // // // //       initialRouteName="Home"
// // // // // // //       screenOptions={({ route }) => ({
// // // // // // //         headerShown: false,
// // // // // // //         tabBarActiveTintColor: '#fff',
// // // // // // //         tabBarInactiveTintColor: '#c7d2fe',
// // // // // // //         tabBarStyle: {
// // // // // // //           backgroundColor: Colors.button,
// // // // // // //           borderTopWidth: 0,
// // // // // // //           height: 58,
// // // // // // //           paddingBottom: 8,
// // // // // // //           paddingTop: 6,
// // // // // // //         },
// // // // // // //         tabBarIcon: ({ color, size }) => {
// // // // // // //           // Map icon per route name used below
// // // // // // //           const iconMap = {
// // // // // // //             Home: 'home-outline',
// // // // // // //             PrayerList: 'book-outline',
// // // // // // //             Quest: 'flag-outline',
// // // // // // //             Progress: 'stats-chart-outline',
// // // // // // //             Friends: 'people-outline',
// // // // // // //           };
// // // // // // //           const name = iconMap[route.name] || 'ellipse-outline';
// // // // // // //           return <Ionicons name={name} size={size ?? 22} color={color} />;
// // // // // // //         },
// // // // // // //         tabBarLabelStyle: { fontWeight: '700' },
// // // // // // //       })}
// // // // // // //     >
// // // // // // //       <Tab.Screen name="Home" component={HomeScreen} />
// // // // // // //       <Tab.Screen
// // // // // // //         name="PrayerList"
// // // // // // //         component={PrayerListScreen}
// // // // // // //         options={{ tabBarLabel: 'Prayer List' }}
// // // // // // //       />
// // // // // // //       <Tab.Screen
// // // // // // //         name="Quest"
// // // // // // //         component={QuestScreen}
// // // // // // //         options={{ tabBarLabel: 'Today’s Quest' }}
// // // // // // //       />
// // // // // // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // // // // // //       <Tab.Screen
// // // // // // //         name="Friends"
// // // // // // //         component={FriendsListScreen}
// // // // // // //         // If you want the label to read "My Friends" in the UI:
// // // // // // //         options={{ tabBarLabel: 'My Friends' }}
// // // // // // //       />
// // // // // // //     </Tab.Navigator>
// // // // // // //   );
// // // // // // // }

// // // // // // // // ---- Root Stack (tabs as entry + extra screens) ----
// // // // // // // export default function App() {
// // // // // // //   const [ready, setReady] = useState(false);

// // // // // // //   useEffect(() => {
// // // // // // //     (async () => {
// // // // // // //       try {
// // // // // // //         await ensureSessionAndProfile();
// // // // // // //       } finally {
// // // // // // //         setReady(true);
// // // // // // //       }
// // // // // // //     })();
// // // // // // //   }, []);

// // // // // // //   if (!ready) {
// // // // // // //     return (
// // // // // // //       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
// // // // // // //         <ActivityIndicator />
// // // // // // //       </View>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <GestureHandlerRootView style={{ flex: 1 }}>
// // // // // // //       <SafeAreaProvider>
// // // // // // //         <NavigationContainer theme={AppTheme}>
// // // // // // //           <Stack.Navigator
// // // // // // //             screenOptions={{
// // // // // // //               headerShown: false,
// // // // // // //               contentStyle: { backgroundColor: Colors.background },
// // // // // // //             }}
// // // // // // //           >
// // // // // // //             {/* Tabs are the app's entry point */}
// // // // // // //             <Stack.Screen name="MainTabs" component={MainTabs} />

// // // // // // //             {/* Non-tab screens */}
// // // // // // //             <Stack.Screen
// // // // // // //               name="AnsweredPrayers"
// // // // // // //               component={AnsweredPrayersScreen}
// // // // // // //             />
// // // // // // //             <Stack.Screen
// // // // // // //               name="Encouragement"
// // // // // // //               component={EncouragementScreen}
// // // // // // //             />
// // // // // // //             <Stack.Screen
// // // // // // //               name="ReceivedEncouragements"
// // // // // // //               component={ReceivedEncouragementsScreen}
// // // // // // //             />
// // // // // // //             <Stack.Screen name="MakeFriends" component={MakeFriendsScreen} />
// // // // // // //             <Stack.Screen name="Profile" component={ProfileScreen} />
// // // // // // //             <Stack.Screen name="Donations" component={DonationsScreen} />
// // // // // // //             <Stack.Screen name="Resources" component={ResourcesScreen} />
// // // // // // //           </Stack.Navigator>
// // // // // // //         </NavigationContainer>
// // // // // // //       </SafeAreaProvider>
// // // // // // //     </GestureHandlerRootView>
// // // // // // //   );
// // // // // // // }

// // // // // // // App.js
// // // // // // import 'react-native-gesture-handler';
// // // // // // import React, { useEffect, useState } from 'react';
// // // // // // import { ActivityIndicator, View } from 'react-native';
// // // // // // import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// // // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // // // // // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // // // // // import { Ionicons } from '@expo/vector-icons';

// // // // // // import { Colors } from './src/constants/colors';
// // // // // // import HomeScreen from './src/screens/HomeScreen';
// // // // // // import PrayerListScreen from './src/screens/PrayerListScreen';
// // // // // // import AnsweredPrayersScreen from './src/screens/AnsweredPrayersScreen';
// // // // // // import QuestScreen from './src/screens/QuestScreen';
// // // // // // import ProgressScreen from './src/screens/ProgressScreen';
// // // // // // import EncouragementScreen from './src/screens/EncouragementScreen';
// // // // // // import ReceivedEncouragementsScreen from './src/screens/ReceivedEncouragementsScreen';
// // // // // // import MakeFriendsScreen from './src/screens/MakeFriendsScreen';
// // // // // // import FriendsListScreen from './src/screens/FriendsListScreen';
// // // // // // import ProfileScreen from './src/screens/ProfileScreen';
// // // // // // import DonationsScreen from './src/screens/DonationsScreen';
// // // // // // import ResourcesScreen from './src/screens/ResourcesScreen';

// // // // // // import { ensureSessionAndProfile } from './src/auth/bootstrap';
// // // // // // import { supabase } from './src/supabase';

// // // // // // // Ensure an anonymous session exists on boot
// // // // // // (async () => {
// // // // // //   const {
// // // // // //     data: { session },
// // // // // //   } = await supabase.auth.getSession();
// // // // // //   if (!session) await supabase.auth.signInAnonymously();
// // // // // // })();

// // // // // // const Stack = createNativeStackNavigator();
// // // // // // const Tab = createBottomTabNavigator();

// // // // // // const AppTheme = {
// // // // // //   ...DefaultTheme,
// // // // // //   colors: { ...DefaultTheme.colors, background: Colors.background },
// // // // // // };

// // // // // // // ---- Bottom Tabs (home + core areas) ----
// // // // // // function MainTabs() {
// // // // // //   return (
// // // // // //     <Tab.Navigator
// // // // // //       initialRouteName="Home"
// // // // // //       screenOptions={({ route }) => ({
// // // // // //         headerShown: false,
// // // // // //         tabBarActiveTintColor: '#fff',
// // // // // //         tabBarInactiveTintColor: '#c7d2fe',
// // // // // //         tabBarStyle: {
// // // // // //           backgroundColor: Colors.button,
// // // // // //           borderTopWidth: 0,
// // // // // //           height: 58,
// // // // // //           paddingBottom: 8,
// // // // // //           paddingTop: 6,
// // // // // //         },
// // // // // //         tabBarIcon: ({ color, size }) => {
// // // // // //           const iconMap = {
// // // // // //             Home: 'home-outline',
// // // // // //             PrayerList: 'book-outline',
// // // // // //             Quest: 'flag-outline',
// // // // // //             Progress: 'stats-chart-outline',
// // // // // //             Friends: 'people-outline',
// // // // // //           };
// // // // // //           const name = iconMap[route.name] || 'ellipse-outline';
// // // // // //           return <Ionicons name={name} size={size ?? 22} color={color} />;
// // // // // //         },
// // // // // //         tabBarLabelStyle: { fontWeight: '700' },
// // // // // //       })}
// // // // // //     >
// // // // // //       <Tab.Screen name="Home" component={HomeScreen} />
// // // // // //       <Tab.Screen
// // // // // //         name="PrayerList"
// // // // // //         component={PrayerListScreen}
// // // // // //         options={{ tabBarLabel: 'Prayer List' }}
// // // // // //       />
// // // // // //       <Tab.Screen
// // // // // //         name="Quest"
// // // // // //         component={QuestScreen}
// // // // // //         options={{ tabBarLabel: 'Today’s Quest' }}
// // // // // //       />
// // // // // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // // // // //       <Tab.Screen
// // // // // //         name="Friends"
// // // // // //         component={FriendsListScreen}
// // // // // //         options={{ tabBarLabel: 'My Friends' }} // label shown in UI
// // // // // //       />
// // // // // //     </Tab.Navigator>
// // // // // //   );
// // // // // // }

// // // // // // // ---- Root Stack (tabs as entry + extra screens) ----
// // // // // // export default function App() {
// // // // // //   const [ready, setReady] = useState(false);

// // // // // //   useEffect(() => {
// // // // // //     (async () => {
// // // // // //       try {
// // // // // //         await ensureSessionAndProfile();
// // // // // //       } finally {
// // // // // //         setReady(true);
// // // // // //       }
// // // // // //     })();
// // // // // //   }, []);

// // // // // //   if (!ready) {
// // // // // //     return (
// // // // // //       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
// // // // // //         <ActivityIndicator />
// // // // // //       </View>
// // // // // //     );
// // // // // //   }

// // // // // //   return (
// // // // // //     <GestureHandlerRootView style={{ flex: 1 }}>
// // // // // //       <SafeAreaProvider>
// // // // // //         <NavigationContainer theme={AppTheme}>
// // // // // //           <Stack.Navigator
// // // // // //             screenOptions={{
// // // // // //               headerShown: false,
// // // // // //               contentStyle: { backgroundColor: Colors.background },
// // // // // //             }}
// // // // // //           >
// // // // // //             {/* Tabs are the app's entry point */}
// // // // // //             <Stack.Screen name="MainTabs" component={MainTabs} />

// // // // // //             {/* Non-tab screens */}
// // // // // //             <Stack.Screen
// // // // // //               name="AnsweredPrayers"
// // // // // //               component={AnsweredPrayersScreen}
// // // // // //             />
// // // // // //             <Stack.Screen
// // // // // //               name="Encouragement"
// // // // // //               component={EncouragementScreen}
// // // // // //             />
// // // // // //             <Stack.Screen
// // // // // //               name="ReceivedEncouragements"
// // // // // //               component={ReceivedEncouragementsScreen}
// // // // // //             />
// // // // // //             <Stack.Screen name="MakeFriends" component={MakeFriendsScreen} />
// // // // // //             <Stack.Screen name="Profile" component={ProfileScreen} />
// // // // // //             <Stack.Screen name="Donations" component={DonationsScreen} />
// // // // // //             <Stack.Screen name="Resources" component={ResourcesScreen} />
// // // // // //           </Stack.Navigator>
// // // // // //         </NavigationContainer>
// // // // // //       </SafeAreaProvider>
// // // // // //     </GestureHandlerRootView>
// // // // // //   );
// // // // // // }

// // // // // // App.js
// // // // // import 'react-native-gesture-handler';
// // // // // import React, { useEffect, useState } from 'react';
// // // // // import { ActivityIndicator, View } from 'react-native';
// // // // // import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // // // // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // // // // import { Ionicons } from '@expo/vector-icons';

// // // // // import { Colors } from './src/constants/colors';
// // // // // import HomeScreen from './src/screens/HomeScreen';
// // // // // import PrayerListScreen from './src/screens/PrayerListScreen';
// // // // // import AnsweredPrayersScreen from './src/screens/AnsweredPrayersScreen';
// // // // // import QuestScreen from './src/screens/QuestScreen';
// // // // // import ProgressScreen from './src/screens/ProgressScreen';
// // // // // import EncouragementScreen from './src/screens/EncouragementScreen';
// // // // // import ReceivedEncouragementsScreen from './src/screens/ReceivedEncouragementsScreen';
// // // // // import MakeFriendsScreen from './src/screens/MakeFriendsScreen';
// // // // // import FriendsListScreen from './src/screens/FriendsListScreen';
// // // // // import ProfileScreen from './src/screens/ProfileScreen';
// // // // // import DonationsScreen from './src/screens/DonationsScreen';
// // // // // import ResourcesScreen from './src/screens/ResourcesScreen';

// // // // // import { ensureSessionAndProfile } from './src/auth/bootstrap';
// // // // // import { supabase } from './src/supabase';

// // // // // // Ensure an anonymous session exists on boot
// // // // // (async () => {
// // // // //   const {
// // // // //     data: { session },
// // // // //   } = await supabase.auth.getSession();
// // // // //   if (!session) await supabase.auth.signInAnonymously();
// // // // // })();

// // // // // const Stack = createNativeStackNavigator();
// // // // // const Tab = createBottomTabNavigator();

// // // // // const AppTheme = {
// // // // //   ...DefaultTheme,
// // // // //   colors: { ...DefaultTheme.colors, background: Colors.background },
// // // // // };

// // // // // // ---- Bottom Tabs (home + core areas) ----
// // // // // // NOTE: We add Encouragement and ReceivedEncouragements as *hidden* tabs so the tab bar stays visible.
// // // // // function MainTabs() {
// // // // //   return (
// // // // //     <Tab.Navigator
// // // // //       screenOptions={({ route }) => ({
// // // // //         headerShown: false,
// // // // //         tabBarActiveTintColor: '#fff',
// // // // //         tabBarInactiveTintColor: '#c7d2fe',
// // // // //         tabBarStyle: {
// // // // //           backgroundColor: Colors.button,
// // // // //           borderTopWidth: 0,
// // // // //           height: 58,
// // // // //           paddingBottom: 8,
// // // // //           paddingTop: 6,
// // // // //         },
// // // // //         // Ensure every tab’s content uses the app background (fills under the iOS home indicator area).
// // // // //         sceneContainerStyle: { backgroundColor: Colors.background },
// // // // //         tabBarIcon: ({ color, size }) => {
// // // // //           const map = {
// // // // //             Home: 'home-outline',
// // // // //             PrayerList: 'book-outline',
// // // // //             Quest: 'flag-outline',
// // // // //             Progress: 'stats-chart-outline',
// // // // //             Friends: 'people-outline',
// // // // //           };
// // // // //           return <Ionicons name={map[route.name]} size={size} color={color} />;
// // // // //         },
// // // // //         tabBarLabelStyle: { fontWeight: '700' },
// // // // //       })}
// // // // //     >
// // // // //       <Tab.Screen name="Home" component={HomeScreen} />
// // // // //       <Tab.Screen name="PrayerList" component={PrayerListScreen} />
// // // // //       <Tab.Screen name="Quest" component={QuestScreen} />
// // // // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // // // //       <Tab.Screen name="Friends" component={FriendsListScreen} />

// // // // //       {/* Hidden tabs (keep tab bar visible when navigating to these) */}
// // // // //       <Tab.Screen
// // // // //         name="Encouragement"
// // // // //         component={EncouragementScreen}
// // // // //         options={{ tabBarButton: () => null }}
// // // // //       />
// // // // //       <Tab.Screen
// // // // //         name="ReceivedEncouragements"
// // // // //         component={ReceivedEncouragementsScreen}
// // // // //         options={{ tabBarButton: () => null }}
// // // // //       />
// // // // //     </Tab.Navigator>
// // // // //   );
// // // // // }

// // // // // // ---- Root Stack (everything, with tabs as the entry) ----
// // // // // export default function App() {
// // // // //   const [ready, setReady] = useState(false);

// // // // //   useEffect(() => {
// // // // //     (async () => {
// // // // //       try {
// // // // //         await ensureSessionAndProfile();
// // // // //       } finally {
// // // // //         setReady(true);
// // // // //       }
// // // // //     })();
// // // // //   }, []);

// // // // //   if (!ready) {
// // // // //     return (
// // // // //       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
// // // // //         <ActivityIndicator />
// // // // //       </View>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <GestureHandlerRootView style={{ flex: 1 }}>
// // // // //       <SafeAreaProvider>
// // // // //         <NavigationContainer theme={AppTheme}>
// // // // //           <Stack.Navigator
// // // // //             screenOptions={{
// // // // //               headerShown: false,
// // // // //               contentStyle: { backgroundColor: Colors.background },
// // // // //             }}
// // // // //           >
// // // // //             {/* Tabs are now the app's entry point */}
// // // // //             <Stack.Screen name="MainTabs" component={MainTabs} />

// // // // //             {/* Non-tab screens that truly need to be outside the tabs */}
// // // // //             <Stack.Screen
// // // // //               name="AnsweredPrayers"
// // // // //               component={AnsweredPrayersScreen}
// // // // //             />
// // // // //             <Stack.Screen name="MakeFriends" component={MakeFriendsScreen} />
// // // // //             <Stack.Screen name="Profile" component={ProfileScreen} />
// // // // //             <Stack.Screen name="Donations" component={DonationsScreen} />
// // // // //             <Stack.Screen name="Resources" component={ResourcesScreen} />
// // // // //           </Stack.Navigator>
// // // // //         </NavigationContainer>
// // // // //       </SafeAreaProvider>
// // // // //     </GestureHandlerRootView>
// // // // //   );
// // // // // }

// // // // // App.js
// // // // import 'react-native-gesture-handler';
// // // // import React, { useEffect, useState } from 'react';
// // // // import { ActivityIndicator, View } from 'react-native';
// // // // import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // // // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // // // import { Ionicons } from '@expo/vector-icons';

// // // // import { Colors } from './src/constants/colors';
// // // // import HomeScreen from './src/screens/HomeScreen';
// // // // import PrayerListScreen from './src/screens/PrayerListScreen';
// // // // import AnsweredPrayersScreen from './src/screens/AnsweredPrayersScreen';
// // // // import QuestScreen from './src/screens/QuestScreen';
// // // // import ProgressScreen from './src/screens/ProgressScreen';
// // // // import EncouragementScreen from './src/screens/EncouragementScreen';
// // // // import ReceivedEncouragementsScreen from './src/screens/ReceivedEncouragementsScreen';
// // // // import MakeFriendsScreen from './src/screens/MakeFriendsScreen';
// // // // import FriendsListScreen from './src/screens/FriendsListScreen';
// // // // import ProfileScreen from './src/screens/ProfileScreen';
// // // // import DonationsScreen from './src/screens/DonationsScreen';
// // // // import ResourcesScreen from './src/screens/ResourcesScreen';

// // // // import { ensureSessionAndProfile } from './src/auth/bootstrap';
// // // // import { supabase } from './src/supabase';

// // // // // Ensure an anonymous session exists on boot
// // // // (async () => {
// // // //   const {
// // // //     data: { session },
// // // //   } = await supabase.auth.getSession();
// // // //   if (!session) await supabase.auth.signInAnonymously();
// // // // })();

// // // // const Stack = createNativeStackNavigator();
// // // // const Tab = createBottomTabNavigator();

// // // // const AppTheme = {
// // // //   ...DefaultTheme,
// // // //   colors: { ...DefaultTheme.colors, background: Colors.background },
// // // // };

// // // // // ---- Bottom Tabs (home + core areas) ----
// // // // function MainTabs() {
// // // //   return (
// // // //     <Tab.Navigator
// // // //       screenOptions={({ route }) => ({
// // // //         headerShown: false,
// // // //         tabBarActiveTintColor: '#fff',
// // // //         tabBarInactiveTintColor: '#c7d2fe',
// // // //         // Keep the same bar look
// // // //         tabBarStyle: {
// // // //           backgroundColor: Colors.button,
// // // //           borderTopWidth: 0,
// // // //           height: 58,
// // // //           paddingBottom: 8,
// // // //           paddingTop: 6,
// // // //         },
// // // //         // 👇 Ensure each tab item (icon + label) stays centered
// // // //         tabBarItemStyle: {
// // // //           justifyContent: 'center',
// // // //           alignItems: 'center',
// // // //         },
// // // //         tabBarLabelStyle: {
// // // //           fontWeight: '700',
// // // //           fontSize: 11,
// // // //           textAlign: 'center',
// // // //         },
// // // //         tabBarIcon: ({ color, size }) => {
// // // //           const map = {
// // // //             Home: 'home-outline',
// // // //             PrayerList: 'book-outline',
// // // //             Quest: 'flag-outline',
// // // //             Progress: 'stats-chart-outline',
// // // //             Friends: 'people-outline', // keep in sync with Tab.Screen name below
// // // //           };
// // // //           const iconName = map[route.name] || 'ellipse-outline';
// // // //           return <Ionicons name={iconName} size={size} color={color} />;
// // // //         },
// // // //       })}
// // // //     >
// // // //       <Tab.Screen name="Home" component={HomeScreen} />
// // // //       <Tab.Screen name="PrayerList" component={PrayerListScreen} />
// // // //       <Tab.Screen name="Quest" component={QuestScreen} />
// // // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // // //       <Tab.Screen name="Friends" component={FriendsListScreen} />
// // // //     </Tab.Navigator>
// // // //   );
// // // // }

// // // // // ---- Root Stack (everything, with tabs as the entry) ----
// // // // export default function App() {
// // // //   const [ready, setReady] = useState(false);

// // // //   useEffect(() => {
// // // //     (async () => {
// // // //       try {
// // // //         await ensureSessionAndProfile();
// // // //       } finally {
// // // //         setReady(true);
// // // //       }
// // // //     })();
// // // //   }, []);

// // // //   if (!ready) {
// // // //     return (
// // // //       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
// // // //         <ActivityIndicator />
// // // //       </View>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <GestureHandlerRootView style={{ flex: 1 }}>
// // // //       <SafeAreaProvider>
// // // //         <NavigationContainer theme={AppTheme}>
// // // //           <Stack.Navigator
// // // //             screenOptions={{
// // // //               headerShown: false,
// // // //               contentStyle: { backgroundColor: Colors.background },
// // // //             }}
// // // //           >
// // // //             {/* Tabs are now the app's entry point */}
// // // //             <Stack.Screen name="MainTabs" component={MainTabs} />

// // // //             {/* Non-tab screens live on the stack */}
// // // //             <Stack.Screen
// // // //               name="AnsweredPrayers"
// // // //               component={AnsweredPrayersScreen}
// // // //             />
// // // //             <Stack.Screen
// // // //               name="Encouragement"
// // // //               component={EncouragementScreen}
// // // //             />
// // // //             <Stack.Screen
// // // //               name="ReceivedEncouragements"
// // // //               component={ReceivedEncouragementsScreen}
// // // //             />
// // // //             <Stack.Screen name="MakeFriends" component={MakeFriendsScreen} />
// // // //             <Stack.Screen name="Profile" component={ProfileScreen} />
// // // //             <Stack.Screen name="Donations" component={DonationsScreen} />
// // // //             <Stack.Screen name="Resources" component={ResourcesScreen} />
// // // //           </Stack.Navigator>
// // // //         </NavigationContainer>
// // // //       </SafeAreaProvider>
// // // //     </GestureHandlerRootView>
// // // //   );
// // // // }

// // // // App.js
// // // import 'react-native-gesture-handler';
// // // import React, { useEffect, useState } from 'react';
// // // import { ActivityIndicator, View } from 'react-native';
// // // import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // // import { Ionicons } from '@expo/vector-icons';

// // // import { Colors } from './src/constants/colors';
// // // import HomeScreen from './src/screens/HomeScreen';
// // // import PrayerListScreen from './src/screens/PrayerListScreen';
// // // import AnsweredPrayersScreen from './src/screens/AnsweredPrayersScreen';
// // // import QuestScreen from './src/screens/QuestScreen';
// // // import ProgressScreen from './src/screens/ProgressScreen';
// // // import EncouragementScreen from './src/screens/EncouragementScreen';
// // // import ReceivedEncouragementsScreen from './src/screens/ReceivedEncouragementsScreen';
// // // import MakeFriendsScreen from './src/screens/MakeFriendsScreen';
// // // import FriendsListScreen from './src/screens/FriendsListScreen';
// // // import ProfileScreen from './src/screens/ProfileScreen';
// // // import DonationsScreen from './src/screens/DonationsScreen';
// // // import ResourcesScreen from './src/screens/ResourcesScreen';

// // // import { ensureSessionAndProfile } from './src/auth/bootstrap';
// // // import { supabase } from './src/supabase';

// // // // Ensure an anonymous session exists on boot
// // // (async () => {
// // //   const {
// // //     data: { session },
// // //   } = await supabase.auth.getSession();
// // //   if (!session) await supabase.auth.signInAnonymously();
// // // })();

// // // const RootStack = createNativeStackNavigator();
// // // const HomeStack = createNativeStackNavigator(); // <— NEW: stack that lives inside the Home tab
// // // const Tab = createBottomTabNavigator();

// // // const AppTheme = {
// // //   ...DefaultTheme,
// // //   colors: { ...DefaultTheme.colors, background: Colors.background },
// // // };

// // // // ---- Home tab's nested stack so the tab bar stays visible on Encouragement screens ----
// // // function HomeStackNavigator() {
// // //   return (
// // //     <HomeStack.Navigator
// // //       screenOptions={{
// // //         headerShown: false,
// // //         contentStyle: { backgroundColor: Colors.background },
// // //       }}
// // //     >
// // //       <HomeStack.Screen name="Home" component={HomeScreen} />
// // //       <HomeStack.Screen name="Encouragement" component={EncouragementScreen} />
// // //       <HomeStack.Screen
// // //         name="ReceivedEncouragements"
// // //         component={ReceivedEncouragementsScreen}
// // //       />
// // //     </HomeStack.Navigator>
// // //   );
// // // }

// // // // ---- Bottom Tabs (home + core areas) ----
// // // function MainTabs() {
// // //   return (
// // //     <Tab.Navigator
// // //       screenOptions={({ route }) => ({
// // //         headerShown: false,
// // //         tabBarActiveTintColor: '#fff',
// // //         tabBarInactiveTintColor: '#c7d2fe',
// // //         tabBarStyle: {
// // //           backgroundColor: Colors.button,
// // //           borderTopWidth: 0,
// // //           height: 58,
// // //           paddingBottom: 8,
// // //           paddingTop: 6,
// // //         },
// // //         tabBarIcon: ({ color, size }) => {
// // //           const map = {
// // //             Home: 'home-outline',
// // //             PrayerList: 'book-outline',
// // //             Quest: 'flag-outline',
// // //             Progress: 'stats-chart-outline',
// // //             Friends: 'people-outline',
// // //           };
// // //           return <Ionicons name={map[route.name]} size={size} color={color} />;
// // //         },
// // //       })}
// // //     >
// // //       {/* Home tab uses the nested stack above */}
// // //       <Tab.Screen name="Home" component={HomeStackNavigator} />
// // //       <Tab.Screen name="PrayerList" component={PrayerListScreen} />
// // //       <Tab.Screen name="Quest" component={QuestScreen} />
// // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // //       <Tab.Screen name="Friends" component={FriendsListScreen} />
// // //     </Tab.Navigator>
// // //   );
// // // }

// // // // ---- Root Stack (everything, with tabs as the entry) ----
// // // export default function App() {
// // //   const [ready, setReady] = useState(false);

// // //   useEffect(() => {
// // //     (async () => {
// // //       try {
// // //         await ensureSessionAndProfile();
// // //       } finally {
// // //         setReady(true);
// // //       }
// // //     })();
// // //   }, []);

// // //   if (!ready) {
// // //     return (
// // //       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
// // //         <ActivityIndicator />
// // //       </View>
// // //     );
// // //   }

// // //   return (
// // //     <GestureHandlerRootView style={{ flex: 1 }}>
// // //       <SafeAreaProvider>
// // //         <NavigationContainer theme={AppTheme}>
// // //           <RootStack.Navigator
// // //             screenOptions={{
// // //               headerShown: false,
// // //               contentStyle: { backgroundColor: Colors.background },
// // //             }}
// // //           >
// // //             {/* Tabs are now the app's entry point */}
// // //             <RootStack.Screen name="MainTabs" component={MainTabs} />

// // //             {/* Non-tab screens live on the root stack */}
// // //             <RootStack.Screen
// // //               name="AnsweredPrayers"
// // //               component={AnsweredPrayersScreen}
// // //             />
// // //             <RootStack.Screen
// // //               name="MakeFriends"
// // //               component={MakeFriendsScreen}
// // //             />
// // //             <RootStack.Screen name="Profile" component={ProfileScreen} />
// // //             <RootStack.Screen name="Donations" component={DonationsScreen} />
// // //             <RootStack.Screen name="Resources" component={ResourcesScreen} />
// // //           </RootStack.Navigator>
// // //         </NavigationContainer>
// // //       </SafeAreaProvider>
// // //     </GestureHandlerRootView>
// // //   );
// // // }

// // // App.js
// // import 'react-native-gesture-handler';
// // import React, { useEffect, useState } from 'react';
// // import { ActivityIndicator, View } from 'react-native';
// // import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // import { Ionicons } from '@expo/vector-icons';

// // import { Colors } from './src/constants/colors';
// // import HomeScreen from './src/screens/HomeScreen';
// // import PrayerListScreen from './src/screens/PrayerListScreen';
// // import AnsweredPrayersScreen from './src/screens/AnsweredPrayersScreen';
// // import QuestScreen from './src/screens/QuestScreen';
// // import ProgressScreen from './src/screens/ProgressScreen';
// // import EncouragementScreen from './src/screens/EncouragementScreen';
// // import ReceivedEncouragementsScreen from './src/screens/ReceivedEncouragementsScreen';
// // import MakeFriendsScreen from './src/screens/MakeFriendsScreen';
// // import FriendsListScreen from './src/screens/FriendsListScreen';
// // import ProfileScreen from './src/screens/ProfileScreen';
// // import DonationsScreen from './src/screens/DonationsScreen';
// // import ResourcesScreen from './src/screens/ResourcesScreen';

// // import { ensureSessionAndProfile } from './src/auth/bootstrap';
// // import { supabase } from './src/supabase';

// // // Ensure an anonymous session exists on boot
// // (async () => {
// //   const {
// //     data: { session },
// //   } = await supabase.auth.getSession();
// //   if (!session) await supabase.auth.signInAnonymously();
// // })();

// // const RootStack = createNativeStackNavigator();
// // const HomeStack = createNativeStackNavigator();
// // const Tab = createBottomTabNavigator();

// // const AppTheme = {
// //   ...DefaultTheme,
// //   colors: { ...DefaultTheme.colors, background: Colors.background },
// // };

// // /**
// //  * Home tab gets its own stack so we can push Encouragement screens
// //  * without leaving the tab bar.
// //  *
// //  * Routes inside this stack:
// //  * - HomeMain (the visible Home screen)
// //  * - Encouragement
// //  * - ReceivedEncouragements
// //  */
// // function HomeStackNavigator() {
// //   return (
// //     <HomeStack.Navigator
// //       screenOptions={{
// //         headerShown: false,
// //         contentStyle: { backgroundColor: Colors.background },
// //       }}
// //     >
// //       <HomeStack.Screen name="HomeMain" component={HomeScreen} />
// //       <HomeStack.Screen name="Encouragement" component={EncouragementScreen} />
// //       <HomeStack.Screen
// //         name="ReceivedEncouragements"
// //         component={ReceivedEncouragementsScreen}
// //       />
// //     </HomeStack.Navigator>
// //   );
// // }

// // // Bottom tabs
// // // ---- Bottom Tabs (home + core areas) ----
// // function MainTabs() {
// //   return (
// //     <Tab.Navigator
// //       initialRouteName="Home"
// //       screenOptions={({ route }) => ({
// //         headerShown: false,
// //         tabBarActiveTintColor: '#fff',
// //         tabBarInactiveTintColor: '#c7d2fe',
// //         tabBarStyle: {
// //           backgroundColor: Colors.button,
// //           borderTopWidth: 0,
// //           height: 58,
// //           paddingBottom: 8,
// //           paddingTop: 6,
// //         },
// //         tabBarIcon: ({ color, size }) => {
// //           // keep the keys in sync with the Tab.Screen names below
// //           const map = {
// //             Home: 'home-outline',
// //             PrayerList: 'book-outline',
// //             Quest: 'flag-outline',
// //             Progress: 'stats-chart-outline',
// //             Friends: 'people-outline', // <-- make sure this matches the Tab.Screen name
// //           };
// //           const icon = map[route.name] || 'ellipse-outline';
// //           return <Ionicons name={icon} size={size} color={color} />;
// //         },
// //       })}
// //     >
// //       <Tab.Screen name="Home" component={HomeScreen} />
// //       <Tab.Screen name="PrayerList" component={PrayerListScreen} />
// //       <Tab.Screen name="Quest" component={QuestScreen} />
// //       <Tab.Screen name="Progress" component={ProgressScreen} />
// //       <Tab.Screen name="Friends" component={FriendsListScreen} />
// //     </Tab.Navigator>
// //   );
// // }

// // /**
// //  * Root stack now only holds tabs and the non-tab flows.
// //  * (Encouragement screens are inside the Home tab stack above,
// //  * so the tab bar stays visible.)
// //  */
// // export default function App() {
// //   const [ready, setReady] = useState(false);

// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         await ensureSessionAndProfile();
// //       } finally {
// //         setReady(true);
// //       }
// //     })();
// //   }, []);

// //   if (!ready) {
// //     return (
// //       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
// //         <ActivityIndicator />
// //       </View>
// //     );
// //   }

// //   return (
// //     <GestureHandlerRootView style={{ flex: 1 }}>
// //       <SafeAreaProvider>
// //         <NavigationContainer theme={AppTheme}>
// //           <RootStack.Navigator
// //             screenOptions={{
// //               headerShown: false,
// //               contentStyle: { backgroundColor: Colors.background },
// //             }}
// //           >
// //             {/* Tabs are the entry point */}
// //             <RootStack.Screen name="MainTabs" component={MainTabs} />

// //             {/* Non-tab screens */}
// //             <RootStack.Screen
// //               name="AnsweredPrayers"
// //               component={AnsweredPrayersScreen}
// //             />
// //             <RootStack.Screen
// //               name="MakeFriends"
// //               component={MakeFriendsScreen}
// //             />
// //             <RootStack.Screen name="Profile" component={ProfileScreen} />
// //             <RootStack.Screen name="Donations" component={DonationsScreen} />
// //             <RootStack.Screen name="Resources" component={ResourcesScreen} />
// //           </RootStack.Navigator>
// //         </NavigationContainer>
// //       </SafeAreaProvider>
// //     </GestureHandlerRootView>
// //   );
// // }

// // App.js
// import 'react-native-gesture-handler';
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, View } from 'react-native';
// import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';

// import { Colors } from './src/constants/colors';
// import HomeScreen from './src/screens/HomeScreen';
// import PrayerListScreen from './src/screens/PrayerListScreen';
// import AnsweredPrayersScreen from './src/screens/AnsweredPrayersScreen';
// import QuestScreen from './src/screens/QuestScreen';
// import ProgressScreen from './src/screens/ProgressScreen';
// import EncouragementScreen from './src/screens/EncouragementScreen';
// import ReceivedEncouragementsScreen from './src/screens/ReceivedEncouragementsScreen';
// import MakeFriendsScreen from './src/screens/MakeFriendsScreen';
// import FriendsListScreen from './src/screens/FriendsListScreen';
// import ProfileScreen from './src/screens/ProfileScreen';
// import DonationsScreen from './src/screens/DonationsScreen';
// import ResourcesScreen from './src/screens/ResourcesScreen';

// import { ensureSessionAndProfile } from './src/auth/bootstrap';
// import { supabase } from './src/supabase';

// // Ensure an anonymous session exists on boot
// (async () => {
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();
//   if (!session) await supabase.auth.signInAnonymously();
// })();

// const RootStack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
// const HomeStack = createNativeStackNavigator();

// const AppTheme = {
//   ...DefaultTheme,
//   colors: { ...DefaultTheme.colors, background: Colors.background },
// };

// // ----- Home tab gets its own small stack so tabs stay visible -----
// function HomeStackScreen() {
//   return (
//     <HomeStack.Navigator
//       initialRouteName="HomeMain"
//       screenOptions={{
//         headerShown: false,
//         contentStyle: { backgroundColor: Colors.background },
//       }}
//     >
//       {/* NOTE: name = "HomeMain" to avoid 'Home nested inside Home' warnings */}
//       <HomeStack.Screen name="HomeMain" component={HomeScreen} />
//       <HomeStack.Screen name="Encouragement" component={EncouragementScreen} />
//       <HomeStack.Screen
//         name="ReceivedEncouragements"
//         component={ReceivedEncouragementsScreen}
//       />
//     </HomeStack.Navigator>
//   );
// }

// // ---- Bottom Tabs (home + core areas) ----
// function MainTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarActiveTintColor: '#fff',
//         tabBarInactiveTintColor: '#c7d2fe',
//         tabBarStyle: {
//           backgroundColor: Colors.button,
//           borderTopWidth: 0,
//           height: 64,
//           paddingBottom: 8,
//           paddingTop: 6,
//         },
//         tabBarIcon: ({ color, size }) => {
//           const map = {
//             Home: 'home-outline',
//             PrayerList: 'book-outline',
//             Quest: 'flag-outline',
//             Progress: 'stats-chart-outline',
//             Friends: 'people-outline',
//           };
//           return <Ionicons name={map[route.name]} size={size} color={color} />;
//         },
//       })}
//     >
//       {/* Home tab now renders the HomeStack */}
//       <Tab.Screen name="Home" component={HomeStackScreen} />
//       <Tab.Screen name="PrayerList" component={PrayerListScreen} />
//       <Tab.Screen name="Quest" component={QuestScreen} />
//       <Tab.Screen name="Progress" component={ProgressScreen} />
//       <Tab.Screen name="Friends" component={FriendsListScreen} />
//     </Tab.Navigator>
//   );
// }

// // ---- Root Stack (tabs as entry; keep non-tab screens here) ----
// export default function App() {
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     (async () => {
//       try {
//         await ensureSessionAndProfile();
//       } finally {
//         setReady(true);
//       }
//     })();
//   }, []);

//   if (!ready) {
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <ActivityIndicator />
//       </View>
//     );
//   }

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <SafeAreaProvider>
//         <NavigationContainer theme={AppTheme}>
//           <RootStack.Navigator
//             screenOptions={{
//               headerShown: false,
//               contentStyle: { backgroundColor: Colors.background },
//             }}
//           >
//             {/* Tabs are the app's entry point */}
//             <RootStack.Screen name="MainTabs" component={MainTabs} />

//             {/* Non-tab screens live on the root stack */}
//             <RootStack.Screen
//               name="AnsweredPrayers"
//               component={AnsweredPrayersScreen}
//             />
//             <RootStack.Screen
//               name="MakeFriends"
//               component={MakeFriendsScreen}
//             />
//             <RootStack.Screen name="Profile" component={ProfileScreen} />
//             <RootStack.Screen name="Donations" component={DonationsScreen} />
//             <RootStack.Screen name="Resources" component={ResourcesScreen} />
//           </RootStack.Navigator>
//         </NavigationContainer>
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// }

// App.js
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from './src/components/AppHeader'; // ✅ NEW
import { Colors } from './src/constants/colors';

import HomeScreen from './src/screens/HomeScreen';
import PrayerListScreen from './src/screens/PrayerListScreen';
import AnsweredPrayersScreen from './src/screens/AnsweredPrayersScreen';
import QuestScreen from './src/screens/QuestScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import EncouragementScreen from './src/screens/EncouragementScreen';
import ReceivedEncouragementsScreen from './src/screens/ReceivedEncouragementsScreen';
import MakeFriendsScreen from './src/screens/MakeFriendsScreen';
import FriendsListScreen from './src/screens/FriendsListScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DonationsScreen from './src/screens/DonationsScreen';
import ResourcesScreen from './src/screens/ResourcesScreen';

import { ensureSessionAndProfile } from './src/auth/bootstrap';
import { supabase } from './src/supabase';

(async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) await supabase.auth.signInAnonymously();
})();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'transparent' },
};

// NEW: tiny header used by the tabs
const HeaderBar = ({ title }) => (
  <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
    <View style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8 }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: '#000' }}>
        {title}
      </Text>
    </View>
  </SafeAreaView>
);

// NEW: friendly names for the header per tab
const prettyTitle = (routeName) => {
  if (routeName === 'Home') return 'The Narrow Way';
  if (routeName === 'PrayerList') return 'Prayer List';
  if (routeName === 'Quest') return 'Today’s Quest';
  if (routeName === 'Progress') return 'Progress';
  if (routeName === 'Friends') return 'Friends';
  return routeName;
};

// ✅ Your bottom tabs (unchanged)
function MainTabs() {
  return (
    <Tab.Navigator
      // screenOptions={({ route }) => ({
      //   headerShown: false,
      screenOptions={({ route }) => ({
        // Show our custom header on every tab
        header: () => <HeaderBar title={prettyTitle(route.name)} />, // NEW
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#c7d2fe',
        tabBarStyle: {
          backgroundColor: Colors.button,
          borderTopWidth: 0,
          height: 58,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarIcon: ({ color, size }) => {
          const map = {
            Home: 'home-outline',
            PrayerList: 'book-outline',
            Quest: 'flag-outline',
            Progress: 'stats-chart-outline',
            Friends: 'people-outline',
          };
          return <Ionicons name={map[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="PrayerList" component={PrayerListScreen} />
      <Tab.Screen name="Quest" component={QuestScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Friends" component={FriendsListScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await ensureSessionAndProfile();
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          {/* ✅ Static App Header visible on ALL pages */}
          <AppHeader />

          <NavigationContainer theme={AppTheme}>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
              }}
            >
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen
                name="AnsweredPrayers"
                component={AnsweredPrayersScreen}
              />
              <Stack.Screen
                name="Encouragement"
                component={EncouragementScreen}
              />
              <Stack.Screen
                name="ReceivedEncouragements"
                component={ReceivedEncouragementsScreen}
              />
              <Stack.Screen name="MakeFriends" component={MakeFriendsScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Donations" component={DonationsScreen} />
              <Stack.Screen name="Resources" component={ResourcesScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
