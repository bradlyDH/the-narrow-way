// // // // // src/navigation/MainTabs.js
// // // // import React from 'react';
// // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // import { Ionicons } from '@expo/vector-icons';
// // // // import { Colors } from '../constants/colors';

// // // // import HomeScreen from '../screens/HomeScreen';
// // // // import PrayerListScreen from '../screens/PrayerListScreen';
// // // // import QuestScreen from '../screens/QuestScreen';
// // // // import ProgressScreen from '../screens/ProgressScreen';
// // // // import FriendsListScreen from '../screens/FriendsListScreen';
// // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // import EncouragementScreen from '../screens/EncouragementScreen';
// // // // import ReceivedEncouragementsScreen from '../screens/ReceivedEncouragementsScreen';
// // // // import ProfileScreen from '../screens/ProfileScreen';
// // // // import MakeFriendsScreen from '../screens/MakeFriendsScreen';
// // // // import ResourcesScreen from '../screens/ResourcesScreen';
// // // // import DonationsScreen from '../screens/DonationsScreen';
// // // // import AnsweredPrayersScreen from '../screens/AnsweredPrayersScreen';

// // // // const Tab = createBottomTabNavigator();
// // // // const HomeStack = createNativeStackNavigator();

// // // // // Mirror the HomeStack used in App.js so <Home> tab routes match:
// // // // function HomeStackScreen() {
// // // //   return (
// // // //     <HomeStack.Navigator screenOptions={{ headerShown: false }}>
// // // //       <HomeStack.Screen name="HomeMain" component={HomeScreen} />
// // // //       <HomeStack.Screen name="Encouragement" component={EncouragementScreen} />
// // // //       <HomeStack.Screen
// // // //         name="ReceivedEncouragements"
// // // //         component={ReceivedEncouragementsScreen}
// // // //       />
// // // //       <HomeStack.Screen
// // // //         name="AnsweredPrayers"
// // // //         component={AnsweredPrayersScreen}
// // // //       />

// // // //       <HomeStack.Screen name="Profile" component={ProfileScreen} />
// // // //       <HomeStack.Screen name="MakeFriends" component={MakeFriendsScreen} />
// // // //       <HomeStack.Screen name="Resources" component={ResourcesScreen} />
// // // //       <HomeStack.Screen name="Donations" component={DonationsScreen} />
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
// // // //           // ✨ Important: no custom justify/align/flex here
// // // //         },
// // // //         tabBarLabelStyle: {
// // // //           fontWeight: '700',
// // // //           textAlign: 'center',
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
// // // //       {/* Home tab renders the nested Home stack */}
// // // //       <Tab.Screen
// // // //         name="Home"
// // // //         component={HomeStackScreen}
// // // //         options={{ tabBarLabel: 'Home' }}
// // // //         listeners={({ navigation }) => ({
// // // //           tabPress: (e) => {
// // // //             // Always take the Home stack back to its first screen
// // // //             navigation.navigate('Home', { screen: 'HomeMain' });
// // // //           },
// // // //         })}
// // // //       />
// // // //       <Tab.Screen name="PrayerList" component={PrayerListScreen} />
// // // //       <Tab.Screen name="Quest" component={QuestScreen} />
// // // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // // //       <Tab.Screen name="Friends" component={FriendsListScreen} />
// // // //     </Tab.Navigator>
// // // //   );
// // // // }

// // // // src/navigation/MainTabs.js
// // // import React from 'react';
// // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // import { CommonActions, StackActions } from '@react-navigation/native';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import { Colors } from '../constants/colors';

// // // import HomeScreen from '../screens/HomeScreen';
// // // import PrayerListScreen from '../screens/PrayerListScreen';
// // // import QuestScreen from '../screens/QuestScreen';
// // // import ProgressScreen from '../screens/ProgressScreen';
// // // import FriendsListScreen from '../screens/FriendsListScreen';

// // // import EncouragementScreen from '../screens/EncouragementScreen';
// // // import ReceivedEncouragementsScreen from '../screens/ReceivedEncouragementsScreen';
// // // import AnsweredPrayersScreen from '../screens/AnsweredPrayersScreen';

// // // import ProfileScreen from '../screens/ProfileScreen';
// // // import MakeFriendsScreen from '../screens/MakeFriendsScreen';
// // // import ResourcesScreen from '../screens/ResourcesScreen';
// // // import DonationsScreen from '../screens/DonationsScreen';

// // // const Tab = createBottomTabNavigator();
// // // const HomeStack = createNativeStackNavigator();

// // // // Nested Home stack keeps tab bar visible on composer/inbox & detail pages
// // // function HomeStackScreen() {
// // //   return (
// // //     <HomeStack.Navigator
// // //       initialRouteName="HomeMain"
// // //       screenOptions={{
// // //         headerShown: false,
// // //         contentStyle: { backgroundColor: Colors.background },
// // //       }}
// // //     >
// // //       <HomeStack.Screen name="HomeMain" component={HomeScreen} />
// // //       <HomeStack.Screen name="Encouragement" component={EncouragementScreen} />
// // //       <HomeStack.Screen
// // //         name="ReceivedEncouragements"
// // //         component={ReceivedEncouragementsScreen}
// // //       />
// // //       <HomeStack.Screen
// // //         name="AnsweredPrayers"
// // //         component={AnsweredPrayersScreen}
// // //       />
// // //       <HomeStack.Screen name="Profile" component={ProfileScreen} />
// // //       <HomeStack.Screen name="MakeFriends" component={MakeFriendsScreen} />
// // //       <HomeStack.Screen name="Resources" component={ResourcesScreen} />
// // //       <HomeStack.Screen name="Donations" component={DonationsScreen} />
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
// // //         },
// // //         tabBarLabelStyle: { fontWeight: '700', textAlign: 'center' },
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
// // //       <Tab.Screen
// // //         name="Home"
// // //         component={HomeStackScreen}
// // //         options={{ tabBarLabel: 'Home' }}
// // //         listeners={({ navigation }) => ({
// // //           tabPress: (e) => {
// // //             const state = navigation.getState();
// // //             const homeRoute = state.routes.find((r) => r.name === 'Home');

// // //             const isFocused = navigation.isFocused?.() ?? false;
// // //             const nestedKey = homeRoute?.state?.key; // key of the nested HomeStack (when mounted)

// // //             if (isFocused && nestedKey) {
// // //               // Reselect on Home: pop Home stack to top, no extra navigate animation.
// // //               e.preventDefault();
// // //               navigation.dispatch({
// // //                 ...StackActions.popToTop(),
// // //                 target: nestedKey,
// // //               });
// // //               return;
// // //             }

// // //             // Coming from another tab (or nested not mounted yet):
// // //             // Focus Home and ensure HomeMain is visible without a second transition.
// // //             e.preventDefault();
// // //             navigation.dispatch(
// // //               CommonActions.navigate({
// // //                 name: 'Home',
// // //                 params: { screen: 'HomeMain' },
// // //                 merge: true, // avoid pushing a duplicate state
// // //               })
// // //             );
// // //           },
// // //         })}
// // //       />

// // //       <Tab.Screen name="PrayerList" component={PrayerListScreen} />
// // //       <Tab.Screen name="Quest" component={QuestScreen} />
// // //       <Tab.Screen name="Progress" component={ProgressScreen} />
// // //       <Tab.Screen name="Friends" component={FriendsListScreen} />
// // //     </Tab.Navigator>
// // //   );
// // // }

// // // src/navigation/MainTabs.js
// // import React from 'react';
// // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // import { CommonActions, StackActions } from '@react-navigation/native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { Colors } from '../constants/colors';

// // import HomeScreen from '../screens/HomeScreen';
// // import PrayerListScreen from '../screens/PrayerListScreen';
// // import QuestScreen from '../screens/QuestScreen';
// // import ProgressScreen from '../screens/ProgressScreen';

// // // Friends tab screens
// // import FriendsListScreen from '../screens/FriendsListScreen';
// // import MakeFriendsScreen from '../screens/MakeFriendsScreen';

// // // Home stack extras
// // import EncouragementScreen from '../screens/EncouragementScreen';
// // import ReceivedEncouragementsScreen from '../screens/ReceivedEncouragementsScreen';
// // import AnsweredPrayersScreen from '../screens/AnsweredPrayersScreen';
// // import ProfileScreen from '../screens/ProfileScreen';
// // import ResourcesScreen from '../screens/ResourcesScreen';
// // import DonationsScreen from '../screens/DonationsScreen';

// // const Tab = createBottomTabNavigator();
// // const HomeStack = createNativeStackNavigator();
// // const FriendsStack = createNativeStackNavigator();
// // const PrayerStack = createNativeStackNavigator();

// // // ----- Prayer tab stack -----
// // function PrayerStackScreen() {
// //   return (
// //     <PrayerStack.Navigator
// //       initialRouteName="PrayerList"
// //       screenOptions={{
// //         headerShown: false,
// //         contentStyle: { backgroundColor: Colors.background },
// //         animation: 'slide_from_right', // ← default slide for this tab
// //         gestureEnabled: true,
// //         fullScreenSwipeEnabled: true,
// //       }}
// //     >
// //       <PrayerStack.Screen name="PrayerList" component={PrayerListScreen} />
// //       <PrayerStack.Screen
// //         name="AnsweredPrayers"
// //         component={AnsweredPrayersScreen}
// //       />
// //     </PrayerStack.Navigator>
// //   );
// // }

// // // ----- Home tab stack -----
// // function HomeStackScreen() {
// //   return (
// //     <HomeStack.Navigator
// //       initialRouteName="HomeMain"
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
// //       <HomeStack.Screen
// //         name="AnsweredPrayers"
// //         component={AnsweredPrayersScreen}
// //       />
// //       <HomeStack.Screen name="Profile" component={ProfileScreen} />
// //       {/* NOTE: MakeFriends moved to FriendsStack below */}
// //       <HomeStack.Screen name="Resources" component={ResourcesScreen} />
// //       <HomeStack.Screen name="Donations" component={DonationsScreen} />
// //     </HomeStack.Navigator>
// //   );
// // }

// // // ----- Friends tab stack (NEW) -----
// // function FriendsStackScreen() {
// //   return (
// //     <FriendsStack.Navigator
// //       initialRouteName="FriendsList"
// //       screenOptions={{
// //         headerShown: false,
// //         contentStyle: { backgroundColor: Colors.background },
// //       }}
// //     >
// //       <FriendsStack.Screen name="FriendsList" component={FriendsListScreen} />
// //       <FriendsStack.Screen name="MakeFriends" component={MakeFriendsScreen} />
// //     </FriendsStack.Navigator>
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
// //         },
// //         tabBarLabelStyle: { fontWeight: '700', textAlign: 'center' },
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
// //       <Tab.Screen
// //         name="Home"
// //         component={HomeStackScreen}
// //         options={{ tabBarLabel: 'Home' }}
// //         listeners={({ navigation }) => ({
// //           tabPress: (e) => {
// //             const rootState = navigation.getState();
// //             const homeRoute = rootState.routes.find((r) => r.name === 'Home');
// //             const isFocused = navigation.isFocused?.() ?? false;
// //             const nestedState = homeRoute?.state; // state of HomeStack
// //             const nestedKey = nestedState?.key;
// //             const nestedIndex =
// //               typeof nestedState?.index === 'number' ? nestedState.index : 0;

// //             // If switching *from another tab* to Home, reset the Home stack to its root
// //             if (!isFocused) {
// //               e.preventDefault();
// //               if (nestedKey) {
// //                 // pop everything in HomeStack so we land on HomeMain
// //                 navigation.dispatch({
// //                   ...StackActions.popToTop(),
// //                   target: nestedKey,
// //                 });
// //               }
// //               // now focus/select the Home tab
// //               navigation.navigate('Home');
// //               return;
// //             }

// //             // If Home tab is already focused and the nested stack has items above root,
// //             // intercept and pop to the top (no extra pushes, no duplicate slide).
// //             if (isFocused && nestedKey && nestedIndex > 0) {
// //               e.preventDefault();
// //               navigation.dispatch({
// //                 ...StackActions.popToTop(),
// //                 target: nestedKey,
// //               });
// //             }
// //             // else: don't preventDefault — let the tab focus normally
// //           },
// //         })}
// //       />

// //       <Tab.Screen name="PrayerList" component={PrayerStackScreen} />
// //       <Tab.Screen name="Quest" component={QuestScreen} />
// //       <Tab.Screen name="Progress" component={ProgressScreen} />

// //       {/* Use the Friends stack here */}
// //       <Tab.Screen name="Friends" component={FriendsStackScreen} />
// //     </Tab.Navigator>
// //   );
// // }

// // // src/navigation/MainTabs.js
// // import React from 'react';
// // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // import { Ionicons } from '@expo/vector-icons';
// // import { Colors } from '../constants/colors';

// // import HomeScreen from '../screens/HomeScreen';
// // import PrayerListScreen from '../screens/PrayerListScreen';
// // import QuestScreen from '../screens/QuestScreen';
// // import ProgressScreen from '../screens/ProgressScreen';

// // import FriendsListScreen from '../screens/FriendsListScreen';
// // import MakeFriendsScreen from '../screens/MakeFriendsScreen';

// // import EncouragementScreen from '../screens/EncouragementScreen';
// // import ReceivedEncouragementsScreen from '../screens/ReceivedEncouragementsScreen';
// // import AnsweredPrayersScreen from '../screens/AnsweredPrayersScreen';
// // import ProfileScreen from '../screens/ProfileScreen';
// // import ResourcesScreen from '../screens/ResourcesScreen';
// // import DonationsScreen from '../screens/DonationsScreen';

// // const Tab = createBottomTabNavigator();
// // const HomeStack = createNativeStackNavigator();
// // const PrayerStack = createNativeStackNavigator();
// // const FriendsStack = createNativeStackNavigator();

// // // ----- Home tab stack -----
// // function HomeStackScreen() {
// //   return (
// //     <HomeStack.Navigator
// //       initialRouteName="HomeMain"
// //       screenOptions={{
// //         headerShown: false,
// //         contentStyle: { backgroundColor: Colors.background },
// //         animation: 'fade_from_bottom',
// //         gestureEnabled: true,
// //         fullScreenSwipeEnabled: true,
// //       }}
// //     >
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
// //       <HomeStack.Screen name="Resources" component={ResourcesScreen} />
// //       <HomeStack.Screen name="Donations" component={DonationsScreen} />
// //     </HomeStack.Navigator>
// //   );
// // }

// // // ----- Prayer tab stack (unique inner names) -----
// // function PrayerStackScreen() {
// //   return (
// //     <PrayerStack.Navigator
// //       initialRouteName="PrayerListMain" // ← unique
// //       screenOptions={{
// //         headerShown: false,
// //         contentStyle: { backgroundColor: Colors.background },
// //         presentation: 'modal',
// //         animation: 'slide_from_right',
// //         gestureEnabled: true,
// //         fullScreenSwipeEnabled: true,
// //       }}
// //     >
// //       <PrayerStack.Screen name="PrayerListMain" component={PrayerListScreen} />
// //       {/* Modal-style screen: slides up */}
// //       <PrayerStack.Screen
// //         name="AnsweredPrayers"
// //         component={AnsweredPrayersScreen}
// //         options={{
// //           presentation: 'modal',
// //           animation: 'slide_from_bottom',
// //         }}
// //       />
// //     </PrayerStack.Navigator>
// //   );
// // }

// // // ----- Friends tab stack -----
// // function FriendsStackScreen() {
// //   return (
// //     <FriendsStack.Navigator
// //       initialRouteName="FriendsList"
// //       screenOptions={{
// //         headerShown: false,
// //         contentStyle: { backgroundColor: Colors.background },
// //         animation: 'slide_from_right',
// //         gestureEnabled: true,
// //         fullScreenSwipeEnabled: true,
// //       }}
// //     >
// //       <FriendsStack.Screen name="FriendsList" component={FriendsListScreen} />
// //       <FriendsStack.Screen name="MakeFriends" component={MakeFriendsScreen} />
// //     </FriendsStack.Navigator>
// //   );
// // }

// // export default function MainTabs() {
// //   return (
// //     <Tab.Navigator
// //       screenOptions={({ route }) => ({
// //         headerShown: false,
// //         tabBarHideOnKeyboard: true,

// //         // keep your icon colors
// //         tabBarActiveTintColor: '#b1c63dff',
// //         tabBarInactiveTintColor: '#475569',

// //         // ✅ Floating pill
// //         tabBarStyle: {
// //           position: 'absolute',
// //           left: 12,
// //           right: 12,
// //           bottom: 16,
// //           height: 60,
// //           paddingBottom: 8,
// //           paddingTop: 6,
// //           borderRadius: 18,
// //           backgroundColor: 'rgba(17,24,39,0.92)', // slight transparency
// //           borderTopWidth: 0,

// //           // soft shadow (both platforms)
// //           elevation: 12, // Android
// //           shadowColor: '#000', // iOS
// //           shadowOpacity: 0.1,
// //           shadowRadius: 16,
// //           shadowOffset: { width: 0, height: 8 },
// //         },

// //         // subtle “active chip” behind focused icon (keeps your icons)
// //         tabBarItemStyle: { borderRadius: 12, marginHorizontal: 4 },
// //         tabBarActiveBackgroundColor: 'rgba(0,0,0,0.05)',

// //         // keep your existing labels + icons
// //         tabBarLabelStyle: { fontWeight: '700', textAlign: 'center' },
// //         tabBarIcon: ({ color, size }) => {
// //           const iconMap = {
// //             Home: 'home-outline',
// //             Prayers: 'book-outline',
// //             Quest: 'flag-outline',
// //             Progress: 'stats-chart-outline',
// //             Friends: 'people-outline',
// //           };
// //           const name = iconMap[route.name] || 'ellipse-outline';
// //           return <Ionicons name={name} size={size ?? 22} color={color} />;
// //         },
// //       })}
// //     >
// //       <Tab.Screen name="Home" component={HomeStackScreen} />
// //       <Tab.Screen
// //         name="Prayers"
// //         component={PrayerStackScreen}
// //         options={{ tabBarLabel: 'Prayers' }}
// //         listeners={({ navigation }) => ({
// //           tabPress: (e) => {
// //             const rootState = navigation.getState();
// //             const prayersRoute = rootState.routes.find(
// //               (r) => r.name === 'Prayers'
// //             );
// //             const isFocused = navigation.isFocused?.() ?? false;
// //             const nestedState = prayersRoute?.state; // state of PrayerStack
// //             const nestedKey = nestedState?.key;
// //             const nestedIndex =
// //               typeof nestedState?.index === 'number' ? nestedState.index : 0;

// //             // If switching from another tab, reset the nested stack, then focus the tab
// //             if (!isFocused) {
// //               e.preventDefault();
// //               if (nestedKey) {
// //                 navigation.dispatch({ type: 'POP_TO_TOP', target: nestedKey });
// //               }
// //               navigation.navigate('Prayers');
// //               return;
// //             }

// //             // If already on Prayers and you're deep in the stack, pop to root
// //             if (isFocused && nestedKey && nestedIndex > 0) {
// //               e.preventDefault();
// //               navigation.dispatch({ type: 'POP_TO_TOP', target: nestedKey });
// //             }
// //           },
// //         })}
// //       />

// //       {/* ← was PrayerList */}
// //       <Tab.Screen name="Quest" component={QuestScreen} />
// //       <Tab.Screen name="Progress" component={ProgressScreen} />
// //       <Tab.Screen name="Friends" component={FriendsStackScreen} />
// //     </Tab.Navigator>
// //   );
// // }

// // src/navigation/MainTabs.js
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Ionicons } from '@expo/vector-icons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Colors } from '../constants/colors';

// import HomeScreen from '../screens/HomeScreen';
// import PrayerListScreen from '../screens/PrayerListScreen';
// import QuestScreen from '../screens/QuestScreen';
// import ProgressScreen from '../screens/ProgressScreen';

// import FriendsListScreen from '../screens/FriendsListScreen';
// import MakeFriendsScreen from '../screens/MakeFriendsScreen';

// import EncouragementScreen from '../screens/EncouragementScreen';
// import ReceivedEncouragementsScreen from '../screens/ReceivedEncouragementsScreen';
// import AnsweredPrayersScreen from '../screens/AnsweredPrayersScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import ResourcesScreen from '../screens/ResourcesScreen';
// import DonationsScreen from '../screens/DonationsScreen';

// const Tab = createBottomTabNavigator();
// const HomeStack = createNativeStackNavigator();
// const PrayerStack = createNativeStackNavigator();
// const FriendsStack = createNativeStackNavigator();

// function HomeStackScreen() {
//   return (
//     <HomeStack.Navigator
//       initialRouteName="HomeMain"
//       screenOptions={{
//         headerShown: false,
//         contentStyle: { backgroundColor: Colors.background },
//         animation: 'fade_from_bottom',
//         gestureEnabled: true,
//         fullScreenSwipeEnabled: true,
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
//       <HomeStack.Screen name="Resources" component={ResourcesScreen} />
//       <HomeStack.Screen name="Donations" component={DonationsScreen} />
//     </HomeStack.Navigator>
//   );
// }

// function PrayerStackScreen() {
//   return (
//     <PrayerStack.Navigator
//       initialRouteName="PrayerListMain"
//       screenOptions={{
//         headerShown: false,
//         contentStyle: { backgroundColor: Colors.background },
//         presentation: 'modal',
//         animation: 'slide_from_right',
//         gestureEnabled: true,
//         fullScreenSwipeEnabled: true,
//       }}
//     >
//       <PrayerStack.Screen name="PrayerListMain" component={PrayerListScreen} />
//       <PrayerStack.Screen
//         name="AnsweredPrayers"
//         component={AnsweredPrayersScreen}
//         options={{
//           presentation: 'modal',
//           animation: 'slide_from_bottom',
//         }}
//       />
//     </PrayerStack.Navigator>
//   );
// }

// function FriendsStackScreen() {
//   return (
//     <FriendsStack.Navigator
//       initialRouteName="FriendsList"
//       screenOptions={{
//         headerShown: false,
//         contentStyle: { backgroundColor: Colors.background },
//         animation: 'slide_from_right',
//         gestureEnabled: true,
//         fullScreenSwipeEnabled: true,
//       }}
//     >
//       <FriendsStack.Screen name="FriendsList" component={FriendsListScreen} />
//       <FriendsStack.Screen name="MakeFriends" component={MakeFriendsScreen} />
//     </FriendsStack.Navigator>
//   );
// }

// export default function MainTabs() {
//   const insets = useSafeAreaInsets(); // ✅ Correct usage inside component
//   const TAB_HEIGHT = 60;
//   const FLOAT_GAP = 16;

//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarHideOnKeyboard: true,

//         // ✅ Adds space to all screens above the floating nav
//         sceneContainerStyle: {
//           backgroundColor: Colors.background,
//         },

//         tabBarActiveTintColor: '#b1c63dff',
//         tabBarInactiveTintColor: '#475569',

//         // ✅ Floating pill tab bar style
//         tabBarStyle: {
//           position: 'absolute',
//           left: 12,
//           right: 12,
//           bottom: FLOAT_GAP + insets.bottom,
//           // bottom: 16 + insets.bottom,
//           height: TAB_HEIGHT,
//           paddingTop: 6,
//           paddingBottom: 8,
//           borderRadius: 18,
//           backgroundColor: 'rgba(17,24,39,0.92)',
//           borderTopWidth: 0,
//           elevation: 12,
//           shadowColor: '#000',
//           shadowOpacity: 0.1,
//           shadowRadius: 16,
//           shadowOffset: { width: 0, height: 8 },
//         },

//         tabBarItemStyle: { borderRadius: 12, marginHorizontal: 4 },
//         tabBarActiveBackgroundColor: 'rgba(0,0,0,0.05)',

//         tabBarLabelStyle: { fontWeight: '700', textAlign: 'center' },
//         tabBarIcon: ({ color, size }) => {
//           const iconMap = {
//             Home: 'home-outline',
//             Prayers: 'book-outline',
//             Quest: 'flag-outline',
//             Progress: 'stats-chart-outline',
//             Friends: 'people-outline',
//           };
//           const name = iconMap[route.name] || 'ellipse-outline';
//           return <Ionicons name={name} size={size ?? 22} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeStackScreen} />
//       <Tab.Screen
//         name="Prayers"
//         component={PrayerStackScreen}
//         options={{ tabBarLabel: 'Prayers' }}
//       />
//       <Tab.Screen name="Quest" component={QuestScreen} />
//       <Tab.Screen name="Progress" component={ProgressScreen} />
//       <Tab.Screen name="Friends" component={FriendsStackScreen} />
//     </Tab.Navigator>
//   );
// }

// src/navigation/MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

import HomeScreen from '../screens/HomeScreen';
import PrayerListScreen from '../screens/PrayerListScreen';
import QuestScreen from '../screens/QuestScreen';
import JournalScreen from '../screens/JournalScreen';

import FriendsListScreen from '../screens/FriendsListScreen';
import MakeFriendsScreen from '../screens/MakeFriendsScreen';

import EncouragementScreen from '../screens/EncouragementScreen';
import ReceivedEncouragementsScreen from '../screens/ReceivedEncouragementsScreen';
import AnsweredPrayersScreen from '../screens/AnsweredPrayersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import DonationsScreen from '../screens/DonationsScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const PrayerStack = createNativeStackNavigator();
const FriendsStack = createNativeStackNavigator();

// ----- Home tab stack -----
function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName="HomeMain"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'fade_from_bottom',
        gestureEnabled: true,
        fullScreenSwipeEnabled: true,
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
      <HomeStack.Screen name="Resources" component={ResourcesScreen} />
      <HomeStack.Screen name="Donations" component={DonationsScreen} />
    </HomeStack.Navigator>
  );
}

// ----- Prayer tab stack -----
function PrayerStackScreen() {
  return (
    <PrayerStack.Navigator
      initialRouteName="PrayerListMain"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        presentation: 'modal',
        animation: 'slide_from_right',
        gestureEnabled: true,
        fullScreenSwipeEnabled: true,
      }}
    >
      <PrayerStack.Screen name="PrayerListMain" component={PrayerListScreen} />
      <PrayerStack.Screen
        name="AnsweredPrayers"
        component={AnsweredPrayersScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </PrayerStack.Navigator>
  );
}

// ----- Friends tab stack -----
function FriendsStackScreen() {
  return (
    <FriendsStack.Navigator
      initialRouteName="FriendsList"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
        gestureEnabled: true,
        fullScreenSwipeEnabled: true,
      }}
    >
      <FriendsStack.Screen name="FriendsList" component={FriendsListScreen} />
      <FriendsStack.Screen name="MakeFriends" component={MakeFriendsScreen} />
    </FriendsStack.Navigator>
  );
}

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,

        // scene itself just uses your app background
        sceneContainerStyle: {
          backgroundColor: Colors.background,
        },

        tabBarActiveTintColor: '#b1c63dff',
        tabBarInactiveTintColor: '#475569',

        // 🔹 Standard, non-floating tab bar
        tabBarStyle: {
          backgroundColor: Colors.button,
          borderTopWidth: 0,
          height: 58 + insets.bottom,
          paddingTop: 6,
          paddingBottom: 8 + insets.bottom,
        },

        tabBarLabelStyle: { fontWeight: '700', textAlign: 'center' },
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            Home: 'home-outline',
            Prayers: 'book-outline',
            Quest: 'flag-outline',
            Progress: 'stats-chart-outline',
            Friends: 'people-outline',
          };
          const name = iconMap[route.name] || 'ellipse-outline';
          return <Ionicons name={name} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen
        name="Prayers"
        component={PrayerStackScreen}
        options={{ tabBarLabel: 'Prayers' }}
      />
      <Tab.Screen name="Quest" component={QuestScreen} />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          title: 'Journal',
          // keep whatever icon config you had, or a new one, e.g.:
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="journal-outline" size={size} color={color} />
          ),
        }}
      />

      {/* <Tab.Screen name="Friends" component={FriendsStackScreen} /> */}
      <Tab.Screen
        name="Friends" // ← this is the tab route name
        component={FriendsStackScreen}
        options={{
          title: 'Friends',
          // tabBarIcon, etc. go here
          unmountOnBlur: false, // optional; leave as-is or tweak
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Make sure default behavior still runs
            // e.preventDefault(); // ← only use if you *don't* want the default

            // Always reset to FriendsList when the Friends tab is pressed
            navigation.navigate('Friends', {
              screen: 'FriendsList', // ← name inside FriendsStack.Navigator
            });
          },
        })}
      />
    </Tab.Navigator>
  );
}
