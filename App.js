// // // // App.js
// // // import 'react-native-gesture-handler';
// // // import React, { useEffect, useState } from 'react';
// // // import { ActivityIndicator, View } from 'react-native';
// // // import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// // // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // // import { SafeAreaProvider } from 'react-native-safe-area-context';

// // // import AppHeader from './src/components/AppHeader';
// // // import MainTabs from './src/navigation/MainTabs';
// // // import { ensureSessionAndProfile } from './src/auth/bootstrap';
// // // import { supabase } from './src/supabase';

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
// // //           <AppHeader />

// // //           {/* ✅ Only ONE NavigationContainer */}
// // //           <NavigationContainer theme={AppTheme}>
// // //             {/* ✅ Only ONE navigator at the root (MainTabs) */}
// // //             <MainTabs />
// // //           </NavigationContainer>
// // //         </View>
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

// // import AppHeader from './src/components/AppHeader';
// // import { Colors } from './src/constants/colors';
// // import MainTabs from './src/navigation/MainTabs';

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
// // import SplashScreenView from './src/screens/SplashScreen';

// // (async () => {
// //   const {
// //     data: { session },
// //   } = await supabase.auth.getSession();
// //   if (!session) await supabase.auth.signInAnonymously();
// // })();

// // const Stack = createNativeStackNavigator();
// // const Tab = createBottomTabNavigator();
// // const HomeStack = createNativeStackNavigator();

// // const AppTheme = {
// //   ...DefaultTheme,
// //   colors: { ...DefaultTheme.colors, background: 'transparent' },
// // };

// // // ---- Home tab gets a nested stack so tab bar stays visible on composer/inbox ----
// // function HomeStackScreen() {
// //   return (
// //     <HomeStack.Navigator
// //       initialRouteName="HomeMain"
// //       screenOptions={{
// //         headerShown: false,
// //         contentStyle: { backgroundColor: Colors.background },
// //       }}
// //     >
// //       {/* NOTE: "HomeMain" avoids the 'Home nested inside Home' warning */}
// //       <HomeStack.Screen name="HomeMain" component={HomeScreen} />
// //       <HomeStack.Screen name="Encouragement" component={EncouragementScreen} />
// //       <HomeStack.Screen
// //         name="ReceivedEncouragements"
// //         component={ReceivedEncouragementsScreen}
// //       />

// //       {/* NEW: put these here so tab bar stays visible + navigation works */}
// //       <HomeStack.Screen name="Profile" component={ProfileScreen} />
// //       {/* <HomeStack.Screen name="MakeFriends" component={MakeFriendsScreen} /> */}
// //       <HomeStack.Screen name="Resources" component={ResourcesScreen} />
// //       <HomeStack.Screen name="Donations" component={DonationsScreen} />
// //       {/* If you also want AnsweredPrayers to keep the tab bar, register it here too: */}
// //       <HomeStack.Screen
// //         name="AnsweredPrayers"
// //         component={AnsweredPrayersScreen}
// //       />
// //     </HomeStack.Navigator>
// //   );
// // }

// // // ---- Root app shell: Tabs are the entry point ----
// // export default function App() {
// //   const [ready, setReady] = useState(false);

// //   // We’ll run ensureSessionAndProfile inside SplashScreenView so the overlay
// //   // can time its fade-out to the loading duration.

// //   if (!ready) {
// //     return (
// //       <GestureHandlerRootView style={{ flex: 1 }}>
// //         <SafeAreaProvider>
// //           <View style={{ flex: 1 }}>
// //             <SplashScreenView
// //               load={ensureSessionAndProfile}
// //               onFinish={() => setReady(true)}
// //               animationMs={1800} // tweak speed to taste
// //               minVisibleMs={900}
// //               maxWaitMs={8000}
// //             />
// //           </View>
// //         </SafeAreaProvider>
// //       </GestureHandlerRootView>
// //     );
// //   }

// //   return (
// //     <GestureHandlerRootView style={{ flex: 1 }}>
// //       <SafeAreaProvider>
// //         <View style={{ flex: 1 }}>
// //           <AppHeader />
// //           <NavigationContainer theme={AppTheme}>
// //             <Stack.Navigator
// //               screenOptions={{
// //                 headerShown: false,
// //                 contentStyle: { backgroundColor: 'transparent' },
// //               }}
// //             >
// //               {/* Tabs are the entry point */}
// //               <Stack.Screen name="MainTabs" component={MainTabs} />
// //               {/* NOTE: the screens we moved into HomeStack have been removed from here */}
// //             </Stack.Navigator>
// //           </NavigationContainer>
// //         </View>
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

// import AppHeader from './src/components/AppHeader';
// import { Colors } from './src/constants/colors';
// import MainTabs from './src/navigation/MainTabs';

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
// import SplashScreenView from './src/screens/SplashScreen';

// (async () => {
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();
//   if (!session) await supabase.auth.signInAnonymously();
// })();

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
// const HomeStack = createNativeStackNavigator();

// const AppTheme = {
//   ...DefaultTheme,
//   colors: { ...DefaultTheme.colors, background: Colors.background },
// };

// // 🔧 central place to play with defaults for pushes inside stacks
// const defaultStackAnimation = 'slide_from_right';

// // ---- Home tab nested stack (kept as-is; used inside MainTabs) ----
// function HomeStackScreen() {
//   return (
//     <HomeStack.Navigator
//       initialRouteName="HomeMain"
//       screenOptions={{
//         headerShown: false,
//         contentStyle: { backgroundColor: Colors.background },
//         animation: defaultStackAnimation,
//         fullScreenSwipeEnabled: true,
//         gestureEnabled: true,
//       }}
//     >
//       <HomeStack.Screen name="HomeMain" component={HomeScreen} />
//       <HomeStack.Screen
//         name="ReceivedEncouragements"
//         component={ReceivedEncouragementsScreen}
//       />
//       <HomeStack.Screen name="Profile" component={ProfileScreen} />
//       <HomeStack.Screen name="Resources" component={ResourcesScreen} />
//       <HomeStack.Screen name="Donations" component={DonationsScreen} />
//       <HomeStack.Screen
//         name="AnsweredPrayers"
//         component={AnsweredPrayersScreen}
//       />
//       <HomeStack.Screen
//         name="Encouragement"
//         component={EncouragementScreen}
//         options={{ presentation: 'modal', animation: 'fade_from_bottom' }}
//       />
//     </HomeStack.Navigator>
//   );
// }

// // ---- Root app shell: Tabs are the entry point ----
// export default function App() {
//   const [ready, setReady] = useState(false);

//   if (!ready) {
//     return (
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <SafeAreaProvider>
//           <View style={{ flex: 1 }}>
//             <SplashScreenView
//               load={ensureSessionAndProfile}
//               onFinish={() => setReady(true)}
//               animationMs={1800}
//               minVisibleMs={900}
//               maxWaitMs={8000}
//             />
//           </View>
//         </SafeAreaProvider>
//       </GestureHandlerRootView>
//     );
//   }

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <SafeAreaProvider>
//         <View style={{ flex: 1 }}>
//           <NavigationContainer theme={AppTheme}>
//             <Stack.Navigator
//               screenOptions={{
//                 // ✅ make AppHeader the stack header so it has navigation context
//                 headerShown: true,
//                 header: () => <AppHeader />,
//                 headerTransparent: true, // AppHeader draws its own background
//                 contentStyle: { backgroundColor: Colors.background },
//                 animation: 'fade',
//               }}
//             >
//               {/* Tabs are the entry point */}
//               <Stack.Screen name="MainTabs" component={MainTabs} />
//             </Stack.Navigator>
//           </NavigationContainer>
//         </View>
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// }

// started building out questing logic

import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { View } from 'react-native';
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
import SplashScreenView from './src/screens/SplashScreen';

// 🔄 NEW: content sync (Supabase → SQLite)
import { syncContent } from './src/logic/syncContent';

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
  colors: { ...DefaultTheme.colors, background: Colors.background },
};

// 🔧 central place to play with defaults for pushes inside stacks
const defaultStackAnimation = 'slide_from_right';

// ---- Home tab nested stack (kept as-is; used inside MainTabs) ----
function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName="HomeMain"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: defaultStackAnimation,
        fullScreenSwipeEnabled: true,
        gestureEnabled: true,
      }}
    >
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen
        name="ReceivedEncouragements"
        component={ReceivedEncouragementsScreen}
      />
      <HomeStack.Screen name="Profile" component={ProfileScreen} />
      <HomeStack.Screen name="Resources" component={ResourcesScreen} />
      <HomeStack.Screen name="Donations" component={DonationsScreen} />
      <HomeStack.Screen
        name="AnsweredPrayers"
        component={AnsweredPrayersScreen}
      />
      <HomeStack.Screen
        name="Encouragement"
        component={EncouragementScreen}
        options={{ presentation: 'modal', animation: 'fade_from_bottom' }}
      />
    </HomeStack.Navigator>
  );
}

// ✅ NEW: combined bootstrap that does auth/profile + content sync
async function bootstrapApp() {
  // Ensure auth + profile is set
  await ensureSessionAndProfile();

  // Then sync questions/challenges from Supabase → SQLite
  try {
    await syncContent();
  } catch (e) {
    console.warn('Initial content sync failed:', e);
  }
}

// ---- Root app shell: Tabs are the entry point ----
export default function App() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <View style={{ flex: 1 }}>
            <SplashScreenView
              load={bootstrapApp} // ⬅️ was ensureSessionAndProfile
              onFinish={() => setReady(true)}
              animationMs={1800}
              minVisibleMs={900}
              maxWaitMs={8000}
            />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <NavigationContainer theme={AppTheme}>
            <Stack.Navigator
              screenOptions={{
                headerShown: true,
                header: () => <AppHeader />,
                headerTransparent: true,
                contentStyle: { backgroundColor: Colors.background },
                animation: 'fade',
              }}
            >
              {/* Tabs are the entry point */}
              <Stack.Screen name="MainTabs" component={MainTabs} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
