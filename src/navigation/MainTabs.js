// // // // // // src/navigation/MainTabs.js
// // // // // import React from 'react';
// // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // import { Ionicons } from '@expo/vector-icons';

// // // // // import HomeScreen from '../screens/HomeScreen';
// // // // // import PrayerListScreen from '../screens/PrayerListScreen';
// // // // // import QuestScreen from '../screens/QuestScreen';
// // // // // import ProgressScreen from '../screens/ProgressScreen';
// // // // // import FriendsListScreen from '../screens/FriendsListScreen';
// // // // // import { Colors } from '../constants/colors';

// // // // // const Tab = createBottomTabNavigator();

// // // // // export default function MainTabs() {
// // // // //   return (
// // // // //     <Tab.Navigator
// // // // //       screenOptions={({ route }) => ({
// // // // //         headerShown: false, // We'll keep your own in-screen headers for now
// // // // //         tabBarActiveTintColor: '#fff',
// // // // //         tabBarInactiveTintColor: '#cfe1ee',
// // // // //         tabBarStyle: {
// // // // //           backgroundColor: Colors.button, // your dark navy
// // // // //           borderTopColor: 'transparent',
// // // // //           height: 60,
// // // // //           paddingBottom: 8,
// // // // //           paddingTop: 6,
// // // // //         },
// // // // //         tabBarIcon: ({ color, size }) => {
// // // // //           const map = {
// // // // //             Home: 'home-outline',
// // // // //             'Prayer List': 'book-outline',
// // // // //             'Today’s Quest': 'target',
// // // // //             Progress: 'stats-chart-outline',
// // // // //             'Friends List': 'people-outline',
// // // // //           };
// // // // //           const name = map[route.name] || 'ellipse-outline';
// // // // //           return <Ionicons name={name} size={22} color={color} />;
// // // // //         },
// // // // //         tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
// // // // //       })}
// // // // //     >
// // // // //       <Tab.Screen name="Home" component={HomeScreen} />
// // // // //       <Tab.Screen name="Prayer List" component={PrayerListScreen} />
// // // // //       <Tab.Screen name="Today’s Quest" component={QuestScreen} />
// // // // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // // // //       <Tab.Screen name="Friends List" component={FriendsListScreen} />
// // // // //     </Tab.Navigator>
// // // // //   );
// // // // // }

// // // // // src/navigation/MainTabs.js
// // // // import React from 'react';
// // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // import { Ionicons } from '@expo/vector-icons';

// // // // import HomeScreen from '../screens/HomeScreen';
// // // // import PrayerListScreen from '../screens/PrayerListScreen';
// // // // import QuestScreen from '../screens/QuestScreen';
// // // // import ProgressScreen from '../screens/ProgressScreen';
// // // // import FriendsListScreen from '../screens/FriendsListScreen';
// // // // import { Colors } from '../constants/colors';

// // // // const Tab = createBottomTabNavigator();

// // // // export default function MainTabs() {
// // // //   return (
// // // //     <Tab.Navigator
// // // //       screenOptions={({ route }) => ({
// // // //         headerShown: false,
// // // //         tabBarActiveTintColor: '#fff',
// // // //         tabBarInactiveTintColor: '#cfe1ee',
// // // //         tabBarStyle: {
// // // //           backgroundColor: Colors.button,
// // // //           borderTopColor: 'transparent',
// // // //           height: 64, // a touch taller
// // // //           paddingBottom: 12, // pushes icon/label up a bit
// // // //           paddingTop: 6,
// // // //           marginBottom: 6, // lifts the whole bar off the bottom edge
// // // //         },
// // // //         tabBarIcon: ({ color }) => {
// // // //           const map = {
// // // //             Home: 'home-outline',
// // // //             'Prayer List': 'book-outline',
// // // //             'Today’s Quest': 'target',
// // // //             Progress: 'stats-chart-outline',
// // // //             'Friends List': 'people-outline',
// // // //           };
// // // //           const name = map[route.name] || 'ellipse-outline';
// // // //           return <Ionicons name={name} size={22} color={color} />;
// // // //         },
// // // //         tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
// // // //       })}
// // // //     >
// // // //       <Tab.Screen name="Home" component={HomeScreen} />
// // // //       <Tab.Screen name="Prayer List" component={PrayerListScreen} />
// // // //       <Tab.Screen name="Today’s Quest" component={QuestScreen} />
// // // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // // //       <Tab.Screen name="Friends List" component={FriendsListScreen} />
// // // //     </Tab.Navigator>
// // // //   );
// // // // }

// // // // src/navigation/MainTabs.js
// // // import React from 'react';
// // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // import { Ionicons } from '@expo/vector-icons';

// // // import HomeScreen from '../screens/HomeScreen';
// // // import PrayerListScreen from '../screens/PrayerListScreen';
// // // import QuestScreen from '../screens/QuestScreen';
// // // import ProgressScreen from '../screens/ProgressScreen';
// // // import FriendsListScreen from '../screens/FriendsListScreen';
// // // import { Colors } from '../constants/colors';

// // // const Tab = createBottomTabNavigator();

// // // export default function MainTabs() {
// // //   return (
// // //     <Tab.Navigator
// // //       screenOptions={({ route }) => {
// // //         // Use stable route keys for icon mapping
// // //         const iconByRoute = {
// // //           Home: 'home-outline',
// // //           PrayerList: 'book-outline',
// // //           Quest: 'target',
// // //           Progress: 'stats-chart-outline',
// // //           FriendsList: 'people-outline',
// // //         };
// // //         const iconName = iconByRoute[route.name] || 'ellipse-outline';

// // //         return {
// // //           headerShown: false,
// // //           tabBarActiveTintColor: '#fff',
// // //           tabBarInactiveTintColor: '#cfe1ee',
// // //           tabBarStyle: {
// // //             backgroundColor: Colors.button,
// // //             borderTopColor: 'transparent',
// // //             height: 60,
// // //             paddingBottom: 8,
// // //             paddingTop: 6,
// // //           },
// // //           tabBarIcon: ({ color }) => (
// // //             <Ionicons name={iconName} size={22} color={color} />
// // //           ),
// // //           tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
// // //         };
// // //       }}
// // //     >
// // //       <Tab.Screen
// // //         name="Home"
// // //         component={HomeScreen}
// // //         options={{ tabBarLabel: 'Home' }}
// // //       />
// // //       <Tab.Screen
// // //         name="PrayerList"
// // //         component={PrayerListScreen}
// // //         options={{ tabBarLabel: 'Prayer List' }}
// // //       />
// // //       <Tab.Screen
// // //         name="Quest"
// // //         component={QuestScreen}
// // //         options={{ tabBarLabel: 'Today’s Quest' }}
// // //       />
// // //       <Tab.Screen
// // //         name="Progress"
// // //         component={ProgressScreen}
// // //         options={{ tabBarLabel: 'Progress' }}
// // //       />
// // //       <Tab.Screen
// // //         name="FriendsList"
// // //         component={FriendsListScreen}
// // //         // 👇 This is where you rename the visible label
// // //         options={{ tabBarLabel: 'My Friends' }}
// // //       />
// // //     </Tab.Navigator>
// // //   );
// // // }

// // // ---- Bottom Tabs (home + core areas) ----
// // function MainTabs() {
// //   return (
// //     <Tab.Navigator
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
// //         // 👇 keep items centered regardless of padding/OS quirks
// //         tabBarItemStyle: { alignItems: 'center', justifyContent: 'center' },
// //         tabBarLabelStyle: {
// //           fontWeight: '700',
// //           fontSize: 11,
// //           textAlign: 'center',
// //         },
// //         tabBarIconStyle: { margin: 0 },
// //         tabBarIcon: ({ color, size }) => {
// //           const map = {
// //             Home: 'home-outline',
// //             PrayerList: 'book-outline',
// //             Quest: 'flag-outline',
// //             Progress: 'stats-chart-outline',
// //             Friends: 'people-outline', // matches your current Tab.Screen name
// //           };
// //           return <Ionicons name={map[route.name]} size={22} color={color} />;
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
// import { Ionicons } from '@expo/vector-icons';

// import HomeScreen from '../screens/HomeScreen';
// import PrayerListScreen from '../screens/PrayerListScreen';
// import QuestScreen from '../screens/QuestScreen';
// import ProgressScreen from '../screens/ProgressScreen';
// import FriendsListScreen from '../screens/FriendsListScreen';
// import { Colors } from '../constants/colors';

// const Tab = createBottomTabNavigator();

// export default function MainTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,

//         // Colors
//         tabBarActiveTintColor: '#fff',
//         tabBarInactiveTintColor: '#cfe1ee',

//         // Make the bar a touch taller and push items up a bit
//         tabBarStyle: {
//           backgroundColor: Colors.button,
//           borderTopColor: 'transparent',
//           height: 64,
//           paddingBottom: 12, // lifts items off the very bottom
//           paddingTop: 6,
//         },

//         // FORCE center alignment (fixes the “pushed left” look)
//         tabBarItemStyle: {
//           justifyContent: 'center',
//           alignItems: 'center',
//         },
//         tabBarLabelStyle: {
//           fontWeight: '700',
//           fontSize: 11,
//           textAlign: 'center',
//         },
//         tabBarIconStyle: {
//           marginBottom: -2, // tiny visual balance tweak
//         },

//         // Icons per route
//         tabBarIcon: ({ color, size }) => {
//           const iconByRoute = {
//             Home: 'home-outline',
//             'Prayer List': 'book-outline',
//             'Today’s Quest': 'flag-outline',
//             Progress: 'stats-chart-outline',
//             'My Friends': 'people-outline',
//             // Fallback
//             default: 'ellipse-outline',
//           };
//           const name = iconByRoute[route.name] ?? iconByRoute.default;
//           return <Ionicons name={name} size={22 ?? size} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Prayer List" component={PrayerListScreen} />
//       <Tab.Screen name="Today’s Quest" component={QuestScreen} />
//       <Tab.Screen name="Progress" component={ProgressScreen} />

//       {/* Explicit label ensures it updates even if Metro cached old name */}
//       <Tab.Screen
//         name="My Friends"
//         component={FriendsListScreen}
//         options={{ tabBarLabel: 'My Friends', title: 'My Friends' }}
//       />
//     </Tab.Navigator>
//   );
// }

// src/navigation/MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import PrayerListScreen from '../screens/PrayerListScreen';
import QuestScreen from '../screens/QuestScreen';
import ProgressScreen from '../screens/ProgressScreen';
import FriendsListScreen from '../screens/FriendsListScreen';
import { Colors } from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#cfe1ee',
        tabBarStyle: {
          backgroundColor: Colors.button,
          borderTopColor: 'transparent',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        // 👇 center the label & the whole item so it doesn't look left-aligned
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 11,
          textAlign: 'center',
          paddingBottom: 8,
        },
        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarIcon: ({ color, size }) => {
          const map = {
            Home: 'home-outline',
            'Prayer List': 'book-outline',
            'Today’s Quest': 'target',
            Progress: 'stats-chart-outline',
            'Friends List': 'people-outline',
          };
          const name = map[route.name] || 'ellipse-outline';
          return <Ionicons name={name} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Prayer List" component={PrayerListScreen} />
      <Tab.Screen name="Today’s Quest" component={QuestScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Friends List" component={FriendsListScreen} />
    </Tab.Navigator>
  );
}
