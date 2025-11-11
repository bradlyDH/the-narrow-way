// // // // // // // // // // // // // // // src/navigation/MainTabs.js
// // // // // // // // // // // // // // import React from 'react';
// // // // // // // // // // // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // // // // // // // // // // import { Ionicons } from '@expo/vector-icons';

// // // // // // // // // // // // // // import HomeScreen from '../screens/HomeScreen';
// // // // // // // // // // // // // // import PrayerListScreen from '../screens/PrayerListScreen';
// // // // // // // // // // // // // // import QuestScreen from '../screens/QuestScreen';
// // // // // // // // // // // // // // import ProgressScreen from '../screens/ProgressScreen';
// // // // // // // // // // // // // // import FriendsListScreen from '../screens/FriendsListScreen';
// // // // // // // // // // // // // // import { Colors } from '../constants/colors';

// // // // // // // // // // // // // // const Tab = createBottomTabNavigator();

// // // // // // // // // // // // // // export default function MainTabs() {
// // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // //     <Tab.Navigator
// // // // // // // // // // // // // //       screenOptions={({ route }) => ({
// // // // // // // // // // // // // //         headerShown: false, // We'll keep your own in-screen headers for now
// // // // // // // // // // // // // //         tabBarActiveTintColor: '#fff',
// // // // // // // // // // // // // //         tabBarInactiveTintColor: '#cfe1ee',
// // // // // // // // // // // // // //         tabBarStyle: {
// // // // // // // // // // // // // //           backgroundColor: Colors.button, // your dark navy
// // // // // // // // // // // // // //           borderTopColor: 'transparent',
// // // // // // // // // // // // // //           height: 60,
// // // // // // // // // // // // // //           paddingBottom: 8,
// // // // // // // // // // // // // //           paddingTop: 6,
// // // // // // // // // // // // // //         },
// // // // // // // // // // // // // //         tabBarIcon: ({ color, size }) => {
// // // // // // // // // // // // // //           const map = {
// // // // // // // // // // // // // //             Home: 'home-outline',
// // // // // // // // // // // // // //             'Prayer List': 'book-outline',
// // // // // // // // // // // // // //             'Today’s Quest': 'target',
// // // // // // // // // // // // // //             Progress: 'stats-chart-outline',
// // // // // // // // // // // // // //             'Friends List': 'people-outline',
// // // // // // // // // // // // // //           };
// // // // // // // // // // // // // //           const name = map[route.name] || 'ellipse-outline';
// // // // // // // // // // // // // //           return <Ionicons name={name} size={22} color={color} />;
// // // // // // // // // // // // // //         },
// // // // // // // // // // // // // //         tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
// // // // // // // // // // // // // //       })}
// // // // // // // // // // // // // //     >
// // // // // // // // // // // // // //       <Tab.Screen name="Home" component={HomeScreen} />
// // // // // // // // // // // // // //       <Tab.Screen name="Prayer List" component={PrayerListScreen} />
// // // // // // // // // // // // // //       <Tab.Screen name="Today’s Quest" component={QuestScreen} />
// // // // // // // // // // // // // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // // // // // // // // // // // // //       <Tab.Screen name="Friends List" component={FriendsListScreen} />
// // // // // // // // // // // // // //     </Tab.Navigator>
// // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // src/navigation/MainTabs.js
// // // // // // // // // // // // // import React from 'react';
// // // // // // // // // // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // // // // // // // // // import { Ionicons } from '@expo/vector-icons';

// // // // // // // // // // // // // import HomeScreen from '../screens/HomeScreen';
// // // // // // // // // // // // // import PrayerListScreen from '../screens/PrayerListScreen';
// // // // // // // // // // // // // import QuestScreen from '../screens/QuestScreen';
// // // // // // // // // // // // // import ProgressScreen from '../screens/ProgressScreen';
// // // // // // // // // // // // // import FriendsListScreen from '../screens/FriendsListScreen';
// // // // // // // // // // // // // import { Colors } from '../constants/colors';

// // // // // // // // // // // // // const Tab = createBottomTabNavigator();

// // // // // // // // // // // // // export default function MainTabs() {
// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <Tab.Navigator
// // // // // // // // // // // // //       screenOptions={({ route }) => ({
// // // // // // // // // // // // //         headerShown: false,
// // // // // // // // // // // // //         tabBarActiveTintColor: '#fff',
// // // // // // // // // // // // //         tabBarInactiveTintColor: '#cfe1ee',
// // // // // // // // // // // // //         tabBarStyle: {
// // // // // // // // // // // // //           backgroundColor: Colors.button,
// // // // // // // // // // // // //           borderTopColor: 'transparent',
// // // // // // // // // // // // //           height: 64, // a touch taller
// // // // // // // // // // // // //           paddingBottom: 12, // pushes icon/label up a bit
// // // // // // // // // // // // //           paddingTop: 6,
// // // // // // // // // // // // //           marginBottom: 6, // lifts the whole bar off the bottom edge
// // // // // // // // // // // // //         },
// // // // // // // // // // // // //         tabBarIcon: ({ color }) => {
// // // // // // // // // // // // //           const map = {
// // // // // // // // // // // // //             Home: 'home-outline',
// // // // // // // // // // // // //             'Prayer List': 'book-outline',
// // // // // // // // // // // // //             'Today’s Quest': 'target',
// // // // // // // // // // // // //             Progress: 'stats-chart-outline',
// // // // // // // // // // // // //             'Friends List': 'people-outline',
// // // // // // // // // // // // //           };
// // // // // // // // // // // // //           const name = map[route.name] || 'ellipse-outline';
// // // // // // // // // // // // //           return <Ionicons name={name} size={22} color={color} />;
// // // // // // // // // // // // //         },
// // // // // // // // // // // // //         tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
// // // // // // // // // // // // //       })}
// // // // // // // // // // // // //     >
// // // // // // // // // // // // //       <Tab.Screen name="Home" component={HomeScreen} />
// // // // // // // // // // // // //       <Tab.Screen name="Prayer List" component={PrayerListScreen} />
// // // // // // // // // // // // //       <Tab.Screen name="Today’s Quest" component={QuestScreen} />
// // // // // // // // // // // // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // // // // // // // // // // // //       <Tab.Screen name="Friends List" component={FriendsListScreen} />
// // // // // // // // // // // // //     </Tab.Navigator>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // }

// // // // // // // // // // // // // src/navigation/MainTabs.js
// // // // // // // // // // // // import React from 'react';
// // // // // // // // // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // // // // // // // // import { Ionicons } from '@expo/vector-icons';

// // // // // // // // // // // // import HomeScreen from '../screens/HomeScreen';
// // // // // // // // // // // // import PrayerListScreen from '../screens/PrayerListScreen';
// // // // // // // // // // // // import QuestScreen from '../screens/QuestScreen';
// // // // // // // // // // // // import ProgressScreen from '../screens/ProgressScreen';
// // // // // // // // // // // // import FriendsListScreen from '../screens/FriendsListScreen';
// // // // // // // // // // // // import { Colors } from '../constants/colors';

// // // // // // // // // // // // const Tab = createBottomTabNavigator();

// // // // // // // // // // // // export default function MainTabs() {
// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <Tab.Navigator
// // // // // // // // // // // //       screenOptions={({ route }) => {
// // // // // // // // // // // //         // Use stable route keys for icon mapping
// // // // // // // // // // // //         const iconByRoute = {
// // // // // // // // // // // //           Home: 'home-outline',
// // // // // // // // // // // //           PrayerList: 'book-outline',
// // // // // // // // // // // //           Quest: 'target',
// // // // // // // // // // // //           Progress: 'stats-chart-outline',
// // // // // // // // // // // //           FriendsList: 'people-outline',
// // // // // // // // // // // //         };
// // // // // // // // // // // //         const iconName = iconByRoute[route.name] || 'ellipse-outline';

// // // // // // // // // // // //         return {
// // // // // // // // // // // //           headerShown: false,
// // // // // // // // // // // //           tabBarActiveTintColor: '#fff',
// // // // // // // // // // // //           tabBarInactiveTintColor: '#cfe1ee',
// // // // // // // // // // // //           tabBarStyle: {
// // // // // // // // // // // //             backgroundColor: Colors.button,
// // // // // // // // // // // //             borderTopColor: 'transparent',
// // // // // // // // // // // //             height: 60,
// // // // // // // // // // // //             paddingBottom: 8,
// // // // // // // // // // // //             paddingTop: 6,
// // // // // // // // // // // //           },
// // // // // // // // // // // //           tabBarIcon: ({ color }) => (
// // // // // // // // // // // //             <Ionicons name={iconName} size={22} color={color} />
// // // // // // // // // // // //           ),
// // // // // // // // // // // //           tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
// // // // // // // // // // // //         };
// // // // // // // // // // // //       }}
// // // // // // // // // // // //     >
// // // // // // // // // // // //       <Tab.Screen
// // // // // // // // // // // //         name="Home"
// // // // // // // // // // // //         component={HomeScreen}
// // // // // // // // // // // //         options={{ tabBarLabel: 'Home' }}
// // // // // // // // // // // //       />
// // // // // // // // // // // //       <Tab.Screen
// // // // // // // // // // // //         name="PrayerList"
// // // // // // // // // // // //         component={PrayerListScreen}
// // // // // // // // // // // //         options={{ tabBarLabel: 'Prayer List' }}
// // // // // // // // // // // //       />
// // // // // // // // // // // //       <Tab.Screen
// // // // // // // // // // // //         name="Quest"
// // // // // // // // // // // //         component={QuestScreen}
// // // // // // // // // // // //         options={{ tabBarLabel: 'Today’s Quest' }}
// // // // // // // // // // // //       />
// // // // // // // // // // // //       <Tab.Screen
// // // // // // // // // // // //         name="Progress"
// // // // // // // // // // // //         component={ProgressScreen}
// // // // // // // // // // // //         options={{ tabBarLabel: 'Progress' }}
// // // // // // // // // // // //       />
// // // // // // // // // // // //       <Tab.Screen
// // // // // // // // // // // //         name="FriendsList"
// // // // // // // // // // // //         component={FriendsListScreen}
// // // // // // // // // // // //         // 👇 This is where you rename the visible label
// // // // // // // // // // // //         options={{ tabBarLabel: 'My Friends' }}
// // // // // // // // // // // //       />
// // // // // // // // // // // //     </Tab.Navigator>
// // // // // // // // // // // //   );
// // // // // // // // // // // // }

// // // // // // // // // // // // ---- Bottom Tabs (home + core areas) ----
// // // // // // // // // // // function MainTabs() {
// // // // // // // // // // //   return (
// // // // // // // // // // //     <Tab.Navigator
// // // // // // // // // // //       screenOptions={({ route }) => ({
// // // // // // // // // // //         headerShown: false,
// // // // // // // // // // //         tabBarActiveTintColor: '#fff',
// // // // // // // // // // //         tabBarInactiveTintColor: '#c7d2fe',
// // // // // // // // // // //         tabBarStyle: {
// // // // // // // // // // //           backgroundColor: Colors.button,
// // // // // // // // // // //           borderTopWidth: 0,
// // // // // // // // // // //           height: 58,
// // // // // // // // // // //           paddingBottom: 8,
// // // // // // // // // // //           paddingTop: 6,
// // // // // // // // // // //         },
// // // // // // // // // // //         // 👇 keep items centered regardless of padding/OS quirks
// // // // // // // // // // //         tabBarItemStyle: { alignItems: 'center', justifyContent: 'center' },
// // // // // // // // // // //         tabBarLabelStyle: {
// // // // // // // // // // //           fontWeight: '700',
// // // // // // // // // // //           fontSize: 11,
// // // // // // // // // // //           textAlign: 'center',
// // // // // // // // // // //         },
// // // // // // // // // // //         tabBarIconStyle: { margin: 0 },
// // // // // // // // // // //         tabBarIcon: ({ color, size }) => {
// // // // // // // // // // //           const map = {
// // // // // // // // // // //             Home: 'home-outline',
// // // // // // // // // // //             PrayerList: 'book-outline',
// // // // // // // // // // //             Quest: 'flag-outline',
// // // // // // // // // // //             Progress: 'stats-chart-outline',
// // // // // // // // // // //             Friends: 'people-outline', // matches your current Tab.Screen name
// // // // // // // // // // //           };
// // // // // // // // // // //           return <Ionicons name={map[route.name]} size={22} color={color} />;
// // // // // // // // // // //         },
// // // // // // // // // // //       })}
// // // // // // // // // // //     >
// // // // // // // // // // //       <Tab.Screen name="Home" component={HomeScreen} />
// // // // // // // // // // //       <Tab.Screen name="PrayerList" component={PrayerListScreen} />
// // // // // // // // // // //       <Tab.Screen name="Quest" component={QuestScreen} />
// // // // // // // // // // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // // // // // // // // // //       <Tab.Screen name="Friends" component={FriendsListScreen} />
// // // // // // // // // // //     </Tab.Navigator>
// // // // // // // // // // //   );
// // // // // // // // // // // }

// // // // // // // // // // // src/navigation/MainTabs.js
// // // // // // // // // // import React from 'react';
// // // // // // // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // // // // // // import { Ionicons } from '@expo/vector-icons';

// // // // // // // // // // import HomeScreen from '../screens/HomeScreen';
// // // // // // // // // // import PrayerListScreen from '../screens/PrayerListScreen';
// // // // // // // // // // import QuestScreen from '../screens/QuestScreen';
// // // // // // // // // // import ProgressScreen from '../screens/ProgressScreen';
// // // // // // // // // // import FriendsListScreen from '../screens/FriendsListScreen';
// // // // // // // // // // import { Colors } from '../constants/colors';

// // // // // // // // // // const Tab = createBottomTabNavigator();

// // // // // // // // // // export default function MainTabs() {
// // // // // // // // // //   return (
// // // // // // // // // //     <Tab.Navigator
// // // // // // // // // //       screenOptions={({ route }) => ({
// // // // // // // // // //         headerShown: false,

// // // // // // // // // //         // Colors
// // // // // // // // // //         tabBarActiveTintColor: '#fff',
// // // // // // // // // //         tabBarInactiveTintColor: '#cfe1ee',

// // // // // // // // // //         // Make the bar a touch taller and push items up a bit
// // // // // // // // // //         tabBarStyle: {
// // // // // // // // // //           backgroundColor: Colors.button,
// // // // // // // // // //           borderTopColor: 'transparent',
// // // // // // // // // //           height: 64,
// // // // // // // // // //           paddingBottom: 12, // lifts items off the very bottom
// // // // // // // // // //           paddingTop: 6,
// // // // // // // // // //         },

// // // // // // // // // //         // FORCE center alignment (fixes the “pushed left” look)
// // // // // // // // // //         tabBarItemStyle: {
// // // // // // // // // //           justifyContent: 'center',
// // // // // // // // // //           alignItems: 'center',
// // // // // // // // // //         },
// // // // // // // // // //         tabBarLabelStyle: {
// // // // // // // // // //           fontWeight: '700',
// // // // // // // // // //           fontSize: 11,
// // // // // // // // // //           textAlign: 'center',
// // // // // // // // // //         },
// // // // // // // // // //         tabBarIconStyle: {
// // // // // // // // // //           marginBottom: -2, // tiny visual balance tweak
// // // // // // // // // //         },

// // // // // // // // // //         // Icons per route
// // // // // // // // // //         tabBarIcon: ({ color, size }) => {
// // // // // // // // // //           const iconByRoute = {
// // // // // // // // // //             Home: 'home-outline',
// // // // // // // // // //             'Prayer List': 'book-outline',
// // // // // // // // // //             'Today’s Quest': 'flag-outline',
// // // // // // // // // //             Progress: 'stats-chart-outline',
// // // // // // // // // //             'My Friends': 'people-outline',
// // // // // // // // // //             // Fallback
// // // // // // // // // //             default: 'ellipse-outline',
// // // // // // // // // //           };
// // // // // // // // // //           const name = iconByRoute[route.name] ?? iconByRoute.default;
// // // // // // // // // //           return <Ionicons name={name} size={22 ?? size} color={color} />;
// // // // // // // // // //         },
// // // // // // // // // //       })}
// // // // // // // // // //     >
// // // // // // // // // //       <Tab.Screen name="Home" component={HomeScreen} />
// // // // // // // // // //       <Tab.Screen name="Prayer List" component={PrayerListScreen} />
// // // // // // // // // //       <Tab.Screen name="Today’s Quest" component={QuestScreen} />
// // // // // // // // // //       <Tab.Screen name="Progress" component={ProgressScreen} />

// // // // // // // // // //       {/* Explicit label ensures it updates even if Metro cached old name */}
// // // // // // // // // //       <Tab.Screen
// // // // // // // // // //         name="My Friends"
// // // // // // // // // //         component={FriendsListScreen}
// // // // // // // // // //         options={{ tabBarLabel: 'My Friends', title: 'My Friends' }}
// // // // // // // // // //       />
// // // // // // // // // //     </Tab.Navigator>
// // // // // // // // // //   );
// // // // // // // // // // }

// // // // // // // // // // src/navigation/MainTabs.js
// // // // // // // // // import React from 'react';
// // // // // // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // // // // // import { Ionicons } from '@expo/vector-icons';

// // // // // // // // // import HomeScreen from '../screens/HomeScreen';
// // // // // // // // // import PrayerListScreen from '../screens/PrayerListScreen';
// // // // // // // // // import QuestScreen from '../screens/QuestScreen';
// // // // // // // // // import ProgressScreen from '../screens/ProgressScreen';
// // // // // // // // // import FriendsListScreen from '../screens/FriendsListScreen';
// // // // // // // // // import { Colors } from '../constants/colors';

// // // // // // // // // const Tab = createBottomTabNavigator();

// // // // // // // // // export default function MainTabs() {
// // // // // // // // //   return (
// // // // // // // // //     <Tab.Navigator
// // // // // // // // //       screenOptions={({ route }) => ({
// // // // // // // // //         headerShown: false,
// // // // // // // // //         tabBarActiveTintColor: '#fff',
// // // // // // // // //         tabBarInactiveTintColor: '#cfe1ee',
// // // // // // // // //         tabBarStyle: {
// // // // // // // // //           backgroundColor: Colors.button,
// // // // // // // // //           borderTopColor: 'transparent',
// // // // // // // // //           height: 60,
// // // // // // // // //           paddingBottom: 8,
// // // // // // // // //           paddingTop: 6,
// // // // // // // // //         },
// // // // // // // // //         // 👇 center the label & the whole item so it doesn't look left-aligned
// // // // // // // // //         tabBarLabelStyle: {
// // // // // // // // //           fontWeight: '700',
// // // // // // // // //           fontSize: 11,
// // // // // // // // //           textAlign: 'center',
// // // // // // // // //           paddingBottom: 8,
// // // // // // // // //         },
// // // // // // // // //         tabBarItemStyle: {
// // // // // // // // //           alignItems: 'center',
// // // // // // // // //           justifyContent: 'center',
// // // // // // // // //         },
// // // // // // // // //         tabBarIcon: ({ color, size }) => {
// // // // // // // // //           const map = {
// // // // // // // // //             Home: 'home-outline',
// // // // // // // // //             'Prayer List': 'book-outline',
// // // // // // // // //             'Today’s Quest': 'target',
// // // // // // // // //             Progress: 'stats-chart-outline',
// // // // // // // // //             'Friends List': 'people-outline',
// // // // // // // // //           };
// // // // // // // // //           const name = map[route.name] || 'ellipse-outline';
// // // // // // // // //           return <Ionicons name={name} size={22} color={color} />;
// // // // // // // // //         },
// // // // // // // // //       })}
// // // // // // // // //     >
// // // // // // // // //       <Tab.Screen name="Home" component={HomeScreen} />
// // // // // // // // //       <Tab.Screen name="Prayer List" component={PrayerListScreen} />
// // // // // // // // //       <Tab.Screen name="Today’s Quest" component={QuestScreen} />
// // // // // // // // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // // // // // // // //       <Tab.Screen name="Friends List" component={FriendsListScreen} />
// // // // // // // // //     </Tab.Navigator>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // // src/navigation/MainTabs.js
// // // // // // // // // import React from 'react';
// // // // // // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // // // // import { Colors } from '../constants/colors';

// // // // // // // // // import HomeScreen from '../screens/HomeScreen';
// // // // // // // // // import PrayerListScreen from '../screens/PrayerListScreen';
// // // // // // // // // import QuestScreen from '../screens/QuestScreen';
// // // // // // // // // import ProgressScreen from '../screens/ProgressScreen';
// // // // // // // // // import FriendsListScreen from '../screens/FriendsListScreen';

// // // // // // // // // // If you prefer using this file, export the same Tab setup as in App.js
// // // // // // // // // const Tab = createBottomTabNavigator();

// // // // // // // // // export default function MainTabs() {
// // // // // // // // //   return (
// // // // // // // // //     <Tab.Navigator
// // // // // // // // //       screenOptions={({ route }) => ({
// // // // // // // // //         headerShown: false,
// // // // // // // // //         tabBarActiveTintColor: '#fff',
// // // // // // // // //         tabBarInactiveTintColor: '#c7d2fe',
// // // // // // // // //         tabBarStyle: {
// // // // // // // // //           backgroundColor: Colors.button,
// // // // // // // // //           borderTopWidth: 0,
// // // // // // // // //           height: 58,
// // // // // // // // //           paddingBottom: 8,
// // // // // // // // //           paddingTop: 6,
// // // // // // // // //         },
// // // // // // // // //         tabBarIcon: ({ color, size }) => {
// // // // // // // // //           const iconMap = {
// // // // // // // // //             Home: 'home-outline',
// // // // // // // // //             PrayerList: 'book-outline',
// // // // // // // // //             Quest: 'flag-outline',
// // // // // // // // //             Progress: 'stats-chart-outline',
// // // // // // // // //             Friends: 'people-outline',
// // // // // // // // //           };
// // // // // // // // //           const name = iconMap[route.name] || 'ellipse-outline';
// // // // // // // // //           return <Ionicons name={name} size={size} color={color} />;
// // // // // // // // //         },
// // // // // // // // //         tabBarLabelStyle: { fontWeight: '700' },
// // // // // // // // //       })}
// // // // // // // // //     >
// // // // // // // // //       <Tab.Screen name="Home" component={HomeScreen} />
// // // // // // // // //       <Tab.Screen name="PrayerList" component={PrayerListScreen} />
// // // // // // // // //       <Tab.Screen name="Quest" component={QuestScreen} />
// // // // // // // // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // // // // // // // //       <Tab.Screen name="Friends" component={FriendsListScreen} />
// // // // // // // // //     </Tab.Navigator>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // src/navigation/MainTabs.js
// // // // // // // // import React from 'react';
// // // // // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // // // import { Colors } from '../constants/colors';

// // // // // // // // import HomeScreen from '../screens/HomeScreen';
// // // // // // // // import PrayerListScreen from '../screens/PrayerListScreen';
// // // // // // // // import QuestScreen from '../screens/QuestScreen';
// // // // // // // // import ProgressScreen from '../screens/ProgressScreen';
// // // // // // // // import FriendsListScreen from '../screens/FriendsListScreen';

// // // // // // // // const Tab = createBottomTabNavigator();

// // // // // // // // export default function MainTabs() {
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
// // // // // // // //         // ✅ keep icon + label centered in each item
// // // // // // // //         tabBarItemStyle: {
// // // // // // // //           justifyContent: 'center',
// // // // // // // //           alignItems: 'center',
// // // // // // // //         },
// // // // // // // //         tabBarLabelStyle: { fontWeight: '700' },
// // // // // // // //         tabBarIcon: ({ color, size }) => {
// // // // // // // //           const iconMap = {
// // // // // // // //             Home: 'home-outline',
// // // // // // // //             PrayerList: 'book-outline',
// // // // // // // //             Quest: 'flag-outline',
// // // // // // // //             Progress: 'stats-chart-outline',
// // // // // // // //             Friends: 'people-outline',
// // // // // // // //           };
// // // // // // // //           const name = iconMap[route.name] || 'ellipse-outline';
// // // // // // // //           return <Ionicons name={name} size={size} color={color} />;
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

// // // // // // // // src/navigation/MainTabs.js
// // // // // // // import React from 'react';
// // // // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // // import { Colors } from '../constants/colors';

// // // // // // // import HomeScreen from '../screens/HomeScreen';
// // // // // // // import PrayerListScreen from '../screens/PrayerListScreen';
// // // // // // // import QuestScreen from '../screens/QuestScreen';
// // // // // // // import ProgressScreen from '../screens/ProgressScreen';
// // // // // // // import FriendsListScreen from '../screens/FriendsListScreen';

// // // // // // // const Tab = createBottomTabNavigator();

// // // // // // // export default function MainTabs() {
// // // // // // //   return (
// // // // // // //     <Tab.Navigator
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
// // // // // // //         // 👇 Keep every tab item centered (icon + label)
// // // // // // //         tabBarItemStyle: {
// // // // // // //           justifyContent: 'center',
// // // // // // //           alignItems: 'center',
// // // // // // //         },
// // // // // // //         tabBarLabelStyle: {
// // // // // // //           fontWeight: '700',
// // // // // // //           textAlign: 'center',
// // // // // // //           // (Optional) prevent long labels from pushing layout
// // // // // // //           // includeFontPadding: false, // Android-only; uncomment if needed
// // // // // // //         },
// // // // // // //         tabBarIcon: ({ color, size }) => {
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
// // // // // // //       })}
// // // // // // //     >
// // // // // // //       <Tab.Screen name="Home" component={HomeScreen} />
// // // // // // //       <Tab.Screen name="PrayerList" component={PrayerListScreen} />
// // // // // // //       <Tab.Screen name="Quest" component={QuestScreen} />
// // // // // // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // // // // // //       <Tab.Screen name="Friends" component={FriendsListScreen} />
// // // // // // //     </Tab.Navigator>
// // // // // // //   );
// // // // // // // }

// // // // // // // src/navigation/MainTabs.js
// // // // // // import React from 'react';
// // // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // import { Colors } from '../constants/colors';

// // // // // // import HomeScreen from '../screens/HomeScreen';
// // // // // // import PrayerListScreen from '../screens/PrayerListScreen';
// // // // // // import QuestScreen from '../screens/QuestScreen';
// // // // // // import ProgressScreen from '../screens/ProgressScreen';
// // // // // // import FriendsListScreen from '../screens/FriendsListScreen';
// // // // // // import EncouragementScreen from '../screens/EncouragementScreen';
// // // // // // import ReceivedEncouragementsScreen from '../screens/ReceivedEncouragementsScreen';

// // // // // // const Tab = createBottomTabNavigator();
// // // // // // const HomeStack = createNativeStackNavigator();

// // // // // // // --- Nested Home stack so the tab bar stays visible on sub-screens ---
// // // // // // function HomeStackScreen() {
// // // // // //   return (
// // // // // //     <HomeStack.Navigator
// // // // // //       initialRouteName="HomeMain"
// // // // // //       screenOptions={{
// // // // // //         headerShown: false,
// // // // // //         contentStyle: { backgroundColor: Colors.background },
// // // // // //       }}
// // // // // //     >
// // // // // //       {/* "HomeMain" avoids 'Home nested inside Home' warning */}
// // // // // //       <HomeStack.Screen name="HomeMain" component={HomeScreen} />
// // // // // //       <HomeStack.Screen name="Encouragement" component={EncouragementScreen} />
// // // // // //       <HomeStack.Screen
// // // // // //         name="ReceivedEncouragements"
// // // // // //         component={ReceivedEncouragementsScreen}
// // // // // //       />
// // // // // //     </HomeStack.Navigator>
// // // // // //   );
// // // // // // }

// // // // // // export default function MainTabs() {
// // // // // //   return (
// // // // // //     <Tab.Navigator
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
// // // // // //           paddingHorizontal: 0,
// // // // // //           justifyContent: 'space-between',
// // // // // //           alignItems: 'stretch',
// // // // // //         },
// // // // // //         // keep each tab item centered (icon + label)
// // // // // //         tabBarItemStyle: {
// // // // // //           flex: 1,
// // // // // //           justifyContent: 'center',
// // // // // //           alignItems: 'center',
// // // // // //         },
// // // // // //         tabBarLabelStyle: {
// // // // // //           fontWeight: '700',
// // // // // //           textAlign: 'center',
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
// // // // // //       })}
// // // // // //     >
// // // // // //       {/* Home uses the nested stack so 'Encouragement' exists */}
// // // // // //       <Tab.Screen name="Home" component={HomeStackScreen} />
// // // // // //       <Tab.Screen name="PrayerList" component={PrayerListScreen} />
// // // // // //       <Tab.Screen name="Quest" component={QuestScreen} />
// // // // // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // // // // //       <Tab.Screen name="Friends" component={FriendsListScreen} />
// // // // // //     </Tab.Navigator>
// // // // // //   );
// // // // // // }

// // // // // // App.js
// // // // // import 'react-native-gesture-handler';
// // // // // import React, { useEffect, useState } from 'react';
// // // // // import { ActivityIndicator, View } from 'react-native';
// // // // // import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // // // // import { SafeAreaProvider } from 'react-native-safe-area-context';

// // // // // import { Ionicons } from '@expo/vector-icons';

// // // // // import AppHeader from './src/components/AppHeader'; // ← shows AnimatedLogo
// // // // // import { Colors } from './src/constants/colors';
// // // // // import MainTabs from './src/navigation/MainTabs';

// // // // // import AnsweredPrayersScreen from './src/screens/AnsweredPrayersScreen';

// // // // // import { ensureSessionAndProfile } from './src/auth/bootstrap';
// // // // // import { supabase } from './src/supabase';

// // // // // (async () => {
// // // // //   const {
// // // // //     data: { session },
// // // // //   } = await supabase.auth.getSession();
// // // // //   if (!session) await supabase.auth.signInAnonymously();
// // // // // })();

// // // // // const Stack = createNativeStackNavigator();

// // // // // const AppTheme = {
// // // // //   ...DefaultTheme,
// // // // //   colors: { ...DefaultTheme.colors, background: 'transparent' },
// // // // // };

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
// // // // //         <View style={{ flex: 1 }}>
// // // // //           {/* Static App Header visible on ALL pages; shows AnimatedLogo */}
// // // // //           <AppHeader />

// // // // //           <NavigationContainer theme={AppTheme}>
// // // // //             <Stack.Navigator
// // // // //               screenOptions={{
// // // // //                 headerShown: false,
// // // // //                 contentStyle: { backgroundColor: 'transparent' },
// // // // //               }}
// // // // //             >
// // // // //               {/* Tabs are the entry point */}
// // // // //               <Stack.Screen name="MainTabs" component={MainTabs} />

// // // // //               {/* Keep only the screens you want OUTSIDE the tab bar here */}
// // // // //               <Stack.Screen
// // // // //                 name="AnsweredPrayers"
// // // // //                 component={AnsweredPrayersScreen}
// // // // //               />
// // // // //             </Stack.Navigator>
// // // // //           </NavigationContainer>
// // // // //         </View>
// // // // //       </SafeAreaProvider>
// // // // //     </GestureHandlerRootView>
// // // // //   );
// // // // // }

// // // // // src/navigation/MainTabs.js
// // // // import React from 'react';
// // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // import { Ionicons } from '@expo/vector-icons';
// // // // import { Colors } from '../constants/colors';

// // // // // Tab screens
// // // // import HomeScreen from '../screens/HomeScreen';
// // // // import PrayerListScreen from '../screens/PrayerListScreen';
// // // // import QuestScreen from '../screens/QuestScreen';
// // // // import ProgressScreen from '../screens/ProgressScreen';
// // // // import FriendsListScreen from '../screens/FriendsListScreen';

// // // // // Home stack-only screens
// // // // import EncouragementScreen from '../screens/EncouragementScreen';
// // // // import ReceivedEncouragementsScreen from '../screens/ReceivedEncouragementsScreen';

// // // // // Hidden-but-tabbed screens so the tab bar stays visible
// // // // import ProfileScreen from '../screens/ProfileScreen';
// // // // import MakeFriendsScreen from '../screens/MakeFriendsScreen';
// // // // import DonationsScreen from '../screens/DonationsScreen';
// // // // import ResourcesScreen from '../screens/ResourcesScreen';

// // // // const Tab = createBottomTabNavigator();
// // // // const HomeStack = createNativeStackNavigator();

// // // // // Nested stack JUST for the Home tab so we can push into Encouragement routes
// // // // function HomeStackScreen() {
// // // //   return (
// // // //     <HomeStack.Navigator
// // // //       initialRouteName="HomeMain"
// // // //       screenOptions={{
// // // //         headerShown: false,
// // // //         contentStyle: { backgroundColor: Colors.background },
// // // //       }}
// // // //     >
// // // //       {/* Use HomeMain to avoid 'Home nested inside Home' warnings */}
// // // //       <HomeStack.Screen name="HomeMain" component={HomeScreen} />
// // // //       <HomeStack.Screen name="Encouragement" component={EncouragementScreen} />
// // // //       <HomeStack.Screen
// // // //         name="ReceivedEncouragements"
// // // //         component={ReceivedEncouragementsScreen}
// // // //       />
// // // //     </HomeStack.Navigator>
// // // //   );
// // // // }

// // // // export default function MainTabs() {
// // // //   return (
// // // //     <Tab.Navigator
// // // //       screenOptions={({ route }) => ({
// // // //         headerShown: false,
// // // //         tabBarActiveTintColor: '#fff',
// // // //         tabBarInactiveTintColor: '#c7d2fe',
// // // //         tabBarStyle: {
// // // //           backgroundColor: Colors.button,
// // // //           borderTopWidth: 0,
// // // //           height: 58,
// // // //           paddingBottom: 8,
// // // //           paddingTop: 6,
// // // //           paddingHorizontal: 0,
// // // //           justifyContent: 'space-between',
// // // //           alignItems: 'stretch',
// // // //         },
// // // //         // Keep each tab item centered (icon + label)
// // // //         tabBarItemStyle: {
// // // //           flex: 1,
// // // //           justifyContent: 'center',
// // // //           alignItems: 'center',
// // // //         },
// // // //         tabBarLabelStyle: {
// // // //           fontWeight: '700',
// // // //           textAlign: 'center',
// // // //           // includeFontPadding: false, // (Android-only) uncomment if needed
// // // //         },
// // // //         tabBarIcon: ({ color, size }) => {
// // // //           const iconMap = {
// // // //             Home: 'home-outline',
// // // //             PrayerList: 'book-outline',
// // // //             Quest: 'flag-outline',
// // // //             Progress: 'stats-chart-outline',
// // // //             Friends: 'people-outline',
// // // //           };
// // // //           const name = iconMap[route.name] || 'ellipse-outline';
// // // //           return <Ionicons name={name} size={size ?? 22} color={color} />;
// // // //         },
// // // //       })}
// // // //     >
// // // //       {/* Visible tabs */}
// // // //       <Tab.Screen name="Home" component={HomeStackScreen} />
// // // //       <Tab.Screen name="PrayerList" component={PrayerListScreen} />
// // // //       <Tab.Screen name="Quest" component={QuestScreen} />
// // // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // // //       <Tab.Screen name="Friends" component={FriendsListScreen} />

// // // //       {/* Hidden tabs: keep bottom bar visible when navigating to these */}
// // // //       <Tab.Screen
// // // //         name="Profile"
// // // //         component={ProfileScreen}
// // // //         options={{ tabBarButton: () => null }}
// // // //       />
// // // //       <Tab.Screen
// // // //         name="MakeFriends"
// // // //         component={MakeFriendsScreen}
// // // //         options={{ tabBarButton: () => null }}
// // // //       />
// // // //       <Tab.Screen
// // // //         name="Donations"
// // // //         component={DonationsScreen}
// // // //         options={{ tabBarButton: () => null }}
// // // //       />
// // // //       <Tab.Screen
// // // //         name="Resources"
// // // //         component={ResourcesScreen}
// // // //         options={{ tabBarButton: () => null }}
// // // //       />
// // // //     </Tab.Navigator>
// // // //   );
// // // // }

// // // // src/navigation/MainTabs.js
// // // import React from 'react';
// // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import { Colors } from '../constants/colors';

// // // import HomeScreen from '../screens/HomeScreen';
// // // import PrayerListScreen from '../screens/PrayerListScreen';
// // // import QuestScreen from '../screens/QuestScreen';
// // // import ProgressScreen from '../screens/ProgressScreen';
// // // import FriendsListScreen from '../screens/FriendsListScreen';

// // // // Home-stack-only screens
// // // import EncouragementScreen from '../screens/EncouragementScreen';
// // // import ReceivedEncouragementsScreen from '../screens/ReceivedEncouragementsScreen';

// // // // Hidden-tab “global” screens you want with the tab bar visible
// // // import ProfileScreen from '../screens/ProfileScreen';
// // // import DonationsScreen from '../screens/DonationsScreen';
// // // import ResourcesScreen from '../screens/ResourcesScreen';
// // // import MakeFriendsScreen from '../screens/MakeFriendsScreen';

// // // const Tab = createBottomTabNavigator();
// // // const HomeStack = createNativeStackNavigator();

// // // function HomeStackScreen() {
// // //   return (
// // //     <HomeStack.Navigator
// // //       initialRouteName="HomeMain"
// // //       screenOptions={{
// // //         headerShown: false,
// // //         // keep your app background color
// // //         contentStyle: { backgroundColor: Colors?.background },
// // //       }}
// // //     >
// // //       {/* Avoid “Home nested inside Home” warning */}
// // //       <HomeStack.Screen name="HomeMain" component={HomeScreen} />
// // //       <HomeStack.Screen name="Encouragement" component={EncouragementScreen} />
// // //       <HomeStack.Screen
// // //         name="ReceivedEncouragements"
// // //         component={ReceivedEncouragementsScreen}
// // //       />
// // //     </HomeStack.Navigator>
// // //   );
// // // }

// // // export default function MainTabs() {
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
// // //           // ❌ no justifyContent/alignItems overrides—let RN lay out evenly
// // //         },
// // //         tabBarLabelStyle: {
// // //           fontWeight: '700',
// // //           textAlign: 'center',
// // //         },
// // //         tabBarIcon: ({ color, size }) => {
// // //           const iconMap = {
// // //             Home: 'home-outline',
// // //             PrayerList: 'book-outline',
// // //             Quest: 'flag-outline',
// // //             Progress: 'stats-chart-outline',
// // //             Friends: 'people-outline',
// // //           };
// // //           const name = iconMap[route.name] || 'ellipse-outline';
// // //           return <Ionicons name={name} size={size ?? 22} color={color} />;
// // //         },
// // //       })}
// // //     >
// // //       {/* Visible tabs */}
// // //       <Tab.Screen name="Home" component={HomeStackScreen} />
// // //       <Tab.Screen name="PrayerList" component={PrayerListScreen} />
// // //       <Tab.Screen name="Quest" component={QuestScreen} />
// // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // //       <Tab.Screen name="Friends" component={FriendsListScreen} />

// // //       {/* Hidden tabs: keep bottom bar visible when navigating to these */}
// // //       <Tab.Screen
// // //         name="Profile"
// // //         component={ProfileScreen}
// // //         options={{ tabBarButton: () => null }}
// // //       />
// // //       <Tab.Screen
// // //         name="Donations"
// // //         component={DonationsScreen}
// // //         options={{ tabBarButton: () => null }}
// // //       />
// // //       <Tab.Screen
// // //         name="Resources"
// // //         component={ResourcesScreen}
// // //         options={{ tabBarButton: () => null }}
// // //       />
// // //       <Tab.Screen
// // //         name="MakeFriends"
// // //         component={MakeFriendsScreen}
// // //         options={{ tabBarButton: () => null }}
// // //       />
// // //     </Tab.Navigator>
// // //   );
// // // }

// // // src/navigation/MainTabs.js
// // import React from 'react';
// // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import { Ionicons } from '@expo/vector-icons';
// // import { Colors } from '../constants/colors';

// // import HomeScreen from '../screens/HomeScreen';
// // import PrayerListScreen from '../screens/PrayerListScreen';
// // import QuestScreen from '../screens/QuestScreen';
// // import ProgressScreen from '../screens/ProgressScreen';
// // import FriendsListScreen from '../screens/FriendsListScreen';

// // const Tab = createBottomTabNavigator();

// // export default function MainTabs() {
// //   return (
// //     <Tab.Navigator
// //       screenOptions={({ route }) => ({
// //         headerShown: false,
// //         tabBarActiveTintColor: '#fff',
// //         tabBarInactiveTintColor: '#c7d2fe',
// //         // Keep the BAR simple — no flexbox layout rules here
// //         tabBarStyle: {
// //           backgroundColor: Colors.button,
// //           borderTopWidth: 0,
// //           height: 58,
// //           paddingBottom: 8,
// //           paddingTop: 6,
// //         },
// //         // Center each ITEM (icon + label) and let items share space evenly
// //         tabBarItemStyle: {
// //           flex: 1,
// //           justifyContent: 'center',
// //           alignItems: 'center',
// //         },
// //         tabBarLabelStyle: {
// //           fontWeight: '700',
// //           textAlign: 'center',
// //         },
// //         tabBarIcon: ({ color, size }) => {
// //           const iconMap = {
// //             Home: 'home-outline',
// //             PrayerList: 'book-outline',
// //             Quest: 'flag-outline',
// //             Progress: 'stats-chart-outline',
// //             Friends: 'people-outline',
// //           };
// //           const name = iconMap[route.name] || 'ellipse-outline';
// //           return <Ionicons name={name} size={size ?? 22} color={color} />;
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

// // src/navigation/MainTabs.js
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Ionicons } from '@expo/vector-icons';
// import { Colors } from '../constants/colors';

// import HomeScreen from '../screens/HomeScreen';
// import PrayerListScreen from '../screens/PrayerListScreen';
// import QuestScreen from '../screens/QuestScreen';
// import ProgressScreen from '../screens/ProgressScreen';
// import FriendsListScreen from '../screens/FriendsListScreen';
// import EncouragementScreen from '../screens/EncouragementScreen';
// import ReceivedEncouragementsScreen from '../screens/ReceivedEncouragementsScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import MakeFriendsScreen from '../screens/MakeFriendsScreen';
// import ResourcesScreen from '../screens/ResourcesScreen';
// import DonationsScreen from '../screens/DonationsScreen';

// const Tab = createBottomTabNavigator();
// const HomeStack = createNativeStackNavigator();

// function HomeStackScreen() {
//   return (
//     <HomeStack.Navigator
//       initialRouteName="HomeMain"
//       screenOptions={{
//         headerShown: false,
//         // keep background consistent with your app
//         contentStyle: { backgroundColor: Colors?.background },
//       }}
//     >
//       {/* Avoids 'Home nested inside Home' warning */}
//       <HomeStack.Screen name="HomeMain" component={HomeScreen} />
//       <HomeStack.Screen name="Encouragement" component={EncouragementScreen} />
//       <HomeStack.Screen
//         name="ReceivedEncouragements"
//         component={ReceivedEncouragementsScreen}
//       />
//     </HomeStack.Navigator>
//   );
// }

// export default function MainTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarActiveTintColor: '#fff',
//         tabBarInactiveTintColor: '#c7d2fe',
//         tabBarStyle: {
//           backgroundColor: Colors.button,
//           borderTopWidth: 0,
//           height: 58,
//           paddingBottom: 8,
//           paddingTop: 6,
//           paddingHorizontal: 0,
//           justifyContent: 'space-between',
//           alignItems: 'stretch',
//         },
//         tabBarItemStyle: {
//           flex: 1,
//           justifyContent: 'center',
//           alignItems: 'center',
//         },
//         tabBarLabelStyle: {
//           fontWeight: '700',
//           textAlign: 'center',
//         },
//         tabBarIcon: ({ color, size }) => {
//           const iconMap = {
//             Home: 'home-outline',
//             PrayerList: 'book-outline',
//             Quest: 'flag-outline',
//             Progress: 'stats-chart-outline',
//             Friends: 'people-outline',
//           };
//           const name = iconMap[route.name] || 'ellipse-outline';
//           return <Ionicons name={name} size={size ?? 22} color={color} />;
//         },
//       })}
//     >
//       {/* Home now uses the stack so 'Encouragement' exists */}
//       <Tab.Screen name="Home" component={HomeStackScreen} />
//       <Tab.Screen name="PrayerList" component={PrayerListScreen} />
//       <Tab.Screen name="Quest" component={QuestScreen} />
//       <Tab.Screen name="Progress" component={ProgressScreen} />
//       <Tab.Screen name="Friends" component={FriendsListScreen} />

//       <Tab.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{ tabBarButton: () => null }}
//       />
//       <Tab.Screen
//         name="MakeFriends"
//         component={MakeFriendsScreen}
//         options={{ tabBarButton: () => null }}
//       />
//       <Tab.Screen
//         name="Resources"
//         component={ResourcesScreen}
//         options={{ tabBarButton: () => null }}
//       />
//       <Tab.Screen
//         name="Donations"
//         component={DonationsScreen}
//         options={{ tabBarButton: () => null }}
//       />
//     </Tab.Navigator>
//   );
// }

// src/navigation/MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

import HomeScreen from '../screens/HomeScreen';
import PrayerListScreen from '../screens/PrayerListScreen';
import QuestScreen from '../screens/QuestScreen';
import ProgressScreen from '../screens/ProgressScreen';
import FriendsListScreen from '../screens/FriendsListScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EncouragementScreen from '../screens/EncouragementScreen';
import ReceivedEncouragementsScreen from '../screens/ReceivedEncouragementsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MakeFriendsScreen from '../screens/MakeFriendsScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import DonationsScreen from '../screens/DonationsScreen';
import AnsweredPrayersScreen from '../screens/AnsweredPrayersScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

// Mirror the HomeStack used in App.js so <Home> tab routes match:
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Encouragement" component={EncouragementScreen} />
      <HomeStack.Screen
        name="ReceivedEncouragements"
        component={ReceivedEncouragementsScreen}
      />
      <HomeStack.Screen
        name="AnsweredPrayers"
        component={AnsweredPrayersScreen}
      />

      <HomeStack.Screen name="Profile" component={ProfileScreen} />
      <HomeStack.Screen name="MakeFriends" component={MakeFriendsScreen} />
      <HomeStack.Screen name="Resources" component={ResourcesScreen} />
      <HomeStack.Screen name="Donations" component={DonationsScreen} />
    </HomeStack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#c7d2fe',
        tabBarStyle: {
          backgroundColor: Colors.button,
          borderTopWidth: 0,
          height: 58,
          paddingBottom: 8,
          paddingTop: 6,
          // ✨ Important: no custom justify/align/flex here
        },
        tabBarLabelStyle: {
          fontWeight: '700',
          textAlign: 'center',
        },
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            Home: 'home-outline',
            PrayerList: 'book-outline',
            Quest: 'flag-outline',
            Progress: 'stats-chart-outline',
            Friends: 'people-outline',
          };
          const name = iconMap[route.name] || 'ellipse-outline';
          return <Ionicons name={name} size={size ?? 22} color={color} />;
        },
      })}
    >
      {/* Home tab renders the nested Home stack */}
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{ tabBarLabel: 'Home' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Always take the Home stack back to its first screen
            navigation.navigate('Home', { screen: 'HomeMain' });
          },
        })}
      />
      <Tab.Screen name="PrayerList" component={PrayerListScreen} />
      <Tab.Screen name="Quest" component={QuestScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Friends" component={FriendsListScreen} />
    </Tab.Navigator>
  );
}
