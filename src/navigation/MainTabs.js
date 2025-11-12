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
// // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // import EncouragementScreen from '../screens/EncouragementScreen';
// // import ReceivedEncouragementsScreen from '../screens/ReceivedEncouragementsScreen';
// // import ProfileScreen from '../screens/ProfileScreen';
// // import MakeFriendsScreen from '../screens/MakeFriendsScreen';
// // import ResourcesScreen from '../screens/ResourcesScreen';
// // import DonationsScreen from '../screens/DonationsScreen';
// // import AnsweredPrayersScreen from '../screens/AnsweredPrayersScreen';

// // const Tab = createBottomTabNavigator();
// // const HomeStack = createNativeStackNavigator();

// // // Mirror the HomeStack used in App.js so <Home> tab routes match:
// // function HomeStackScreen() {
// //   return (
// //     <HomeStack.Navigator screenOptions={{ headerShown: false }}>
// //       <HomeStack.Screen name="HomeMain" component={HomeScreen} />
// //       <HomeStack.Screen name="Encouragement" component={EncouragementScreen} />
// //       <HomeStack.Screen
// //         name="ReceivedEncouragements"
// //         component={ReceivedEncouragementsScreen}
// //       />
// //       <HomeStack.Screen
// //         name="AnsweredPrayers"
// //         component={AnsweredPrayersScreen}
// //       />

// //       <HomeStack.Screen name="Profile" component={ProfileScreen} />
// //       <HomeStack.Screen name="MakeFriends" component={MakeFriendsScreen} />
// //       <HomeStack.Screen name="Resources" component={ResourcesScreen} />
// //       <HomeStack.Screen name="Donations" component={DonationsScreen} />
// //     </HomeStack.Navigator>
// //   );
// // }

// // export default function MainTabs() {
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
// //           // ✨ Important: no custom justify/align/flex here
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
// //       {/* Home tab renders the nested Home stack */}
// //       <Tab.Screen
// //         name="Home"
// //         component={HomeStackScreen}
// //         options={{ tabBarLabel: 'Home' }}
// //         listeners={({ navigation }) => ({
// //           tabPress: (e) => {
// //             // Always take the Home stack back to its first screen
// //             navigation.navigate('Home', { screen: 'HomeMain' });
// //           },
// //         })}
// //       />
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
// import { CommonActions, StackActions } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { Colors } from '../constants/colors';

// import HomeScreen from '../screens/HomeScreen';
// import PrayerListScreen from '../screens/PrayerListScreen';
// import QuestScreen from '../screens/QuestScreen';
// import ProgressScreen from '../screens/ProgressScreen';
// import FriendsListScreen from '../screens/FriendsListScreen';

// import EncouragementScreen from '../screens/EncouragementScreen';
// import ReceivedEncouragementsScreen from '../screens/ReceivedEncouragementsScreen';
// import AnsweredPrayersScreen from '../screens/AnsweredPrayersScreen';

// import ProfileScreen from '../screens/ProfileScreen';
// import MakeFriendsScreen from '../screens/MakeFriendsScreen';
// import ResourcesScreen from '../screens/ResourcesScreen';
// import DonationsScreen from '../screens/DonationsScreen';

// const Tab = createBottomTabNavigator();
// const HomeStack = createNativeStackNavigator();

// // Nested Home stack keeps tab bar visible on composer/inbox & detail pages
// function HomeStackScreen() {
//   return (
//     <HomeStack.Navigator
//       initialRouteName="HomeMain"
//       screenOptions={{
//         headerShown: false,
//         contentStyle: { backgroundColor: Colors.background },
//       }}
//     >
//       <HomeStack.Screen name="HomeMain" component={HomeScreen} />
//       <HomeStack.Screen name="Encouragement" component={EncouragementScreen} />
//       <HomeStack.Screen
//         name="ReceivedEncouragements"
//         component={ReceivedEncouragementsScreen}
//       />
//       <HomeStack.Screen
//         name="AnsweredPrayers"
//         component={AnsweredPrayersScreen}
//       />
//       <HomeStack.Screen name="Profile" component={ProfileScreen} />
//       <HomeStack.Screen name="MakeFriends" component={MakeFriendsScreen} />
//       <HomeStack.Screen name="Resources" component={ResourcesScreen} />
//       <HomeStack.Screen name="Donations" component={DonationsScreen} />
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
//         },
//         tabBarLabelStyle: { fontWeight: '700', textAlign: 'center' },
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
//       <Tab.Screen
//         name="Home"
//         component={HomeStackScreen}
//         options={{ tabBarLabel: 'Home' }}
//         listeners={({ navigation }) => ({
//           tabPress: (e) => {
//             const state = navigation.getState();
//             const homeRoute = state.routes.find((r) => r.name === 'Home');

//             const isFocused = navigation.isFocused?.() ?? false;
//             const nestedKey = homeRoute?.state?.key; // key of the nested HomeStack (when mounted)

//             if (isFocused && nestedKey) {
//               // Reselect on Home: pop Home stack to top, no extra navigate animation.
//               e.preventDefault();
//               navigation.dispatch({
//                 ...StackActions.popToTop(),
//                 target: nestedKey,
//               });
//               return;
//             }

//             // Coming from another tab (or nested not mounted yet):
//             // Focus Home and ensure HomeMain is visible without a second transition.
//             e.preventDefault();
//             navigation.dispatch(
//               CommonActions.navigate({
//                 name: 'Home',
//                 params: { screen: 'HomeMain' },
//                 merge: true, // avoid pushing a duplicate state
//               })
//             );
//           },
//         })}
//       />

//       <Tab.Screen name="PrayerList" component={PrayerListScreen} />
//       <Tab.Screen name="Quest" component={QuestScreen} />
//       <Tab.Screen name="Progress" component={ProgressScreen} />
//       <Tab.Screen name="Friends" component={FriendsListScreen} />
//     </Tab.Navigator>
//   );
// }

// src/navigation/MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions, StackActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

import HomeScreen from '../screens/HomeScreen';
import PrayerListScreen from '../screens/PrayerListScreen';
import QuestScreen from '../screens/QuestScreen';
import ProgressScreen from '../screens/ProgressScreen';

// Friends tab screens
import FriendsListScreen from '../screens/FriendsListScreen';
import MakeFriendsScreen from '../screens/MakeFriendsScreen';

// Home stack extras
import EncouragementScreen from '../screens/EncouragementScreen';
import ReceivedEncouragementsScreen from '../screens/ReceivedEncouragementsScreen';
import AnsweredPrayersScreen from '../screens/AnsweredPrayersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import DonationsScreen from '../screens/DonationsScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const FriendsStack = createNativeStackNavigator();

// ----- Home tab stack -----
function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName="HomeMain"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
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
      {/* NOTE: MakeFriends moved to FriendsStack below */}
      <HomeStack.Screen name="Resources" component={ResourcesScreen} />
      <HomeStack.Screen name="Donations" component={DonationsScreen} />
    </HomeStack.Navigator>
  );
}

// ----- Friends tab stack (NEW) -----
function FriendsStackScreen() {
  return (
    <FriendsStack.Navigator
      initialRouteName="FriendsList"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <FriendsStack.Screen name="FriendsList" component={FriendsListScreen} />
      <FriendsStack.Screen name="MakeFriends" component={MakeFriendsScreen} />
    </FriendsStack.Navigator>
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
        },
        tabBarLabelStyle: { fontWeight: '700', textAlign: 'center' },
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
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{ tabBarLabel: 'Home' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const rootState = navigation.getState();
            const homeRoute = rootState.routes.find((r) => r.name === 'Home');
            const isFocused = navigation.isFocused?.() ?? false;
            const nestedState = homeRoute?.state; // state of HomeStack
            const nestedKey = nestedState?.key;
            const nestedIndex =
              typeof nestedState?.index === 'number' ? nestedState.index : 0;

            // If switching *from another tab* to Home, reset the Home stack to its root
            if (!isFocused) {
              e.preventDefault();
              if (nestedKey) {
                // pop everything in HomeStack so we land on HomeMain
                navigation.dispatch({
                  ...StackActions.popToTop(),
                  target: nestedKey,
                });
              }
              // now focus/select the Home tab
              navigation.navigate('Home');
              return;
            }

            // If Home tab is already focused and the nested stack has items above root,
            // intercept and pop to the top (no extra pushes, no duplicate slide).
            if (isFocused && nestedKey && nestedIndex > 0) {
              e.preventDefault();
              navigation.dispatch({
                ...StackActions.popToTop(),
                target: nestedKey,
              });
            }
            // else: don't preventDefault — let the tab focus normally
          },
        })}
      />

      <Tab.Screen name="PrayerList" component={PrayerListScreen} />
      <Tab.Screen name="Quest" component={QuestScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />

      {/* Use the Friends stack here */}
      <Tab.Screen name="Friends" component={FriendsStackScreen} />
    </Tab.Navigator>
  );
}
