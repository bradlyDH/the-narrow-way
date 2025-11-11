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

// // // // // import AppHeader from './src/components/AppHeader'; // ← shows AnimatedLogo
// // // // // import { Colors } from './src/constants/colors';
// // // // // import MainTabs from './src/navigation/MainTabs';

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

// // // // // (async () => {
// // // // //   const {
// // // // //     data: { session },
// // // // //   } = await supabase.auth.getSession();
// // // // //   if (!session) await supabase.auth.signInAnonymously();
// // // // // })();

// // // // // const Stack = createNativeStackNavigator();
// // // // // const Tab = createBottomTabNavigator();
// // // // // const HomeStack = createNativeStackNavigator();

// // // // // const AppTheme = {
// // // // //   ...DefaultTheme,
// // // // //   colors: { ...DefaultTheme.colors, background: 'transparent' },
// // // // // };

// // // // // // ---- Home tab gets a nested stack so tab bar stays visible on composer/inbox ----
// // // // // function HomeStackScreen() {
// // // // //   return (
// // // // //     <HomeStack.Navigator
// // // // //       initialRouteName="HomeMain"
// // // // //       screenOptions={{
// // // // //         headerShown: false,
// // // // //         contentStyle: { backgroundColor: Colors.background },
// // // // //       }}
// // // // //     >
// // // // //       {/* NOTE: "HomeMain" avoids the 'Home nested inside Home' warning */}
// // // // //       <HomeStack.Screen name="HomeMain" component={HomeScreen} />
// // // // //       <HomeStack.Screen name="Encouragement" component={EncouragementScreen} />
// // // // //       <HomeStack.Screen
// // // // //         name="ReceivedEncouragements"
// // // // //         component={ReceivedEncouragementsScreen}
// // // // //       />
// // // // //     </HomeStack.Navigator>
// // // // //   );
// // // // // }

// // // // // // ---- Bottom Tabs (home + core areas) ----

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

// // // // //               {/* Non-tab screens stay on the root stack */}
// // // // //               <Stack.Screen
// // // // //                 name="AnsweredPrayers"
// // // // //                 component={AnsweredPrayersScreen}
// // // // //               />
// // // // //               <Stack.Screen name="MakeFriends" component={MakeFriendsScreen} />
// // // // //               <Stack.Screen name="Profile" component={ProfileScreen} />
// // // // //               <Stack.Screen name="Donations" component={DonationsScreen} />
// // // // //               <Stack.Screen name="Resources" component={ResourcesScreen} />
// // // // //             </Stack.Navigator>
// // // // //           </NavigationContainer>
// // // // //         </View>
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

// // // // import AppHeader from './src/components/AppHeader'; // ← shows AnimatedLogo
// // // // import { Colors } from './src/constants/colors';
// // // // import MainTabs from './src/navigation/MainTabs';

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
// // // //   colors: { ...DefaultTheme.colors, background: 'transparent' },
// // // // };

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
// // // //         <View style={{ flex: 1 }}>
// // // //           {/* Static App Header visible on ALL pages; shows AnimatedLogo */}
// // // //           <AppHeader />

// // // //           <NavigationContainer theme={AppTheme}>
// // // //             <Stack.Navigator
// // // //               screenOptions={{
// // // //                 headerShown: false,
// // // //                 contentStyle: { backgroundColor: 'transparent' },
// // // //               }}
// // // //             >
// // // //               {/* Tabs are the entry point */}
// // // //               <Stack.Screen name="MainTabs" component={MainTabs} />

// // // //               {/* Non-tab screens stay on the root stack */}
// // // //               <Stack.Screen
// // // //                 name="AnsweredPrayers"
// // // //                 component={AnsweredPrayersScreen}
// // // //               />
// // // //               <Stack.Screen name="MakeFriends" component={MakeFriendsScreen} />
// // // //               <Stack.Screen name="Profile" component={ProfileScreen} />
// // // //               <Stack.Screen name="Donations" component={DonationsScreen} />
// // // //               <Stack.Screen name="Resources" component={ResourcesScreen} />
// // // //             </Stack.Navigator>
// // // //           </NavigationContainer>
// // // //         </View>
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
// // // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // // import { SafeAreaProvider } from 'react-native-safe-area-context';

// // // import { Ionicons } from '@expo/vector-icons';

// // // import AppHeader from './src/components/AppHeader'; // ← shows AnimatedLogo
// // // import { Colors } from './src/constants/colors';
// // // import MainTabs from './src/navigation/MainTabs';

// // // import AnsweredPrayersScreen from './src/screens/AnsweredPrayersScreen';

// // // import { ensureSessionAndProfile } from './src/auth/bootstrap';
// // // import { supabase } from './src/supabase';

// // // (async () => {
// // //   const {
// // //     data: { session },
// // //   } = await supabase.auth.getSession();
// // //   if (!session) await supabase.auth.signInAnonymously();
// // // })();

// // // const Stack = createNativeStackNavigator();

// // // const AppTheme = {
// // //   ...DefaultTheme,
// // //   colors: { ...DefaultTheme.colors, background: 'transparent' },
// // // };

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
// // //         <View style={{ flex: 1 }}>
// // //           {/* Static App Header visible on ALL pages; shows AnimatedLogo */}
// // //           <AppHeader />

// // //           <NavigationContainer theme={AppTheme}>
// // //             <Stack.Navigator
// // //               screenOptions={{
// // //                 headerShown: false,
// // //                 contentStyle: { backgroundColor: 'transparent' },
// // //               }}
// // //             >
// // //               {/* Tabs are the entry point */}
// // //               <Stack.Screen name="MainTabs" component={MainTabs} />

// // //               {/* Keep only the screens you want OUTSIDE the tab bar here */}
// // //               <Stack.Screen
// // //                 name="AnsweredPrayers"
// // //                 component={AnsweredPrayersScreen}
// // //               />
// // //             </Stack.Navigator>
// // //           </NavigationContainer>
// // //         </View>
// // //       </SafeAreaProvider>
// // //     </GestureHandlerRootView>
// // //   );
// // // }

// // // src/navigation/MainTabs.js
// // import React from 'react';
// // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import { Ionicons } from '@expo/vector-icons';
// // import { Colors } from './src/constants/colors';

// // import HomeScreen from './src/screens/HomeScreen';
// // import PrayerListScreen from './src/screens/PrayerListScreen';
// // import QuestScreen from './src/screens/QuestScreen';
// // import ProgressScreen from './src/screens/ProgressScreen';
// // import FriendsListScreen from './src/screens/FriendsListScreen';

// // const Tab = createBottomTabNavigator();

// // export default function MainTabs() {
// //   return (
// //     <Tab.Navigator
// //       screenOptions={({ route }) => ({
// //         headerShown: false,
// //         tabBarActiveTintColor: '#fff',
// //         tabBarInactiveTintColor: '#c7d2fe',

// //         // Only keep visual styling here; remove layout overrides that misalign items
// //         tabBarStyle: {
// //           backgroundColor: Colors.button,
// //           borderTopWidth: 0,
// //           height: 58,
// //           paddingBottom: 8,
// //           paddingTop: 6,
// //         },

// //         // Center each item’s icon+label without forcing weird flex on the container
// //         tabBarItemStyle: {
// //           // flex: 1 is OK (evenly distribute 5 items)
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

// // App.js
// import 'react-native-gesture-handler';
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, View } from 'react-native';
// import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// import AppHeader from './src/components/AppHeader';
// import MainTabs from './src/navigation/MainTabs';
// import { ensureSessionAndProfile } from './src/auth/bootstrap';
// import { supabase } from './src/supabase';

// const AppTheme = {
//   ...DefaultTheme,
//   colors: { ...DefaultTheme.colors, background: 'transparent' },
// };

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
//         <View style={{ flex: 1 }}>
//           <AppHeader />

//           {/* ✅ Only ONE NavigationContainer */}
//           <NavigationContainer theme={AppTheme}>
//             {/* ✅ Only ONE navigator at the root (MainTabs) */}
//             <MainTabs />
//           </NavigationContainer>
//         </View>
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// }

// App.js
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from './src/components/AppHeader';
import { Colors } from './src/constants/colors';
import MainTabs from './src/navigation/MainTabs';

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
const HomeStack = createNativeStackNavigator();

const AppTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'transparent' },
};

// ---- Home tab gets a nested stack so tab bar stays visible on composer/inbox ----
function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName="HomeMain"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      {/* NOTE: "HomeMain" avoids the 'Home nested inside Home' warning */}
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Encouragement" component={EncouragementScreen} />
      <HomeStack.Screen
        name="ReceivedEncouragements"
        component={ReceivedEncouragementsScreen}
      />

      {/* NEW: put these here so tab bar stays visible + navigation works */}
      <HomeStack.Screen name="Profile" component={ProfileScreen} />
      <HomeStack.Screen name="MakeFriends" component={MakeFriendsScreen} />
      <HomeStack.Screen name="Resources" component={ResourcesScreen} />
      <HomeStack.Screen name="Donations" component={DonationsScreen} />
      {/* If you also want AnsweredPrayers to keep the tab bar, register it here too: */}
      <HomeStack.Screen
        name="AnsweredPrayers"
        component={AnsweredPrayersScreen}
      />
    </HomeStack.Navigator>
  );
}

// ---- Root app shell: Tabs are the entry point ----
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
          <AppHeader />
          <NavigationContainer theme={AppTheme}>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
              }}
            >
              {/* Tabs are the entry point */}
              <Stack.Screen name="MainTabs" component={MainTabs} />
              {/* NOTE: the screens we moved into HomeStack have been removed from here */}
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
