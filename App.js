// // // // root/App.js
// // // import 'react-native-gesture-handler';
// // // import React, { useState } from 'react';
// // // import { View, AppState } from 'react-native';
// // // import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import { seedBibleIfNeeded } from './src/logic/seedBible';

// // // import AppHeader from './src/components/AppHeader';
// // // import { Colors } from './src/constants/colors';
// // // import MainTabs from './src/navigation/MainTabs';

// // // import HomeScreen from './src/screens/HomeScreen';
// // // import PrayerListScreen from './src/screens/PrayerListScreen';
// // // import AnsweredPrayersScreen from './src/screens/AnsweredPrayersScreen';
// // // import QuestScreen from './src/screens/QuestScreen';
// // // import EncouragementScreen from './src/screens/EncouragementScreen';
// // // import ReceivedEncouragementsScreen from './src/screens/ReceivedEncouragementsScreen';
// // // import MakeFriendsScreen from './src/screens/MakeFriendsScreen';
// // // import FriendsListScreen from './src/screens/FriendsListScreen';
// // // import ProfileScreen from './src/screens/ProfileScreen';
// // // import DonationsScreen from './src/screens/DonationsScreen';
// // // import ResourcesScreen from './src/screens/ResourcesScreen';
// // // import BibleScreen from './src/screens/BibleScreen';

// // // import { supabase } from './src/supabase';
// // // import SplashScreenView from './src/screens/SplashScreen';
// // // import { syncUserData } from './src/logic/syncUserData';
// // // import { syncContent } from './src/logic/syncContent';
// // // import AuthScreen from './src/screens/AuthScreen'; // 👈 NEW

// // // const Stack = createNativeStackNavigator();
// // // const Tab = createBottomTabNavigator();
// // // const HomeStack = createNativeStackNavigator();

// // // const AppTheme = {
// // //   ...DefaultTheme,
// // //   colors: { ...DefaultTheme.colors, background: Colors.background },
// // // };

// // // const defaultStackAnimation = 'slide_from_right';

// // // // ---- Home tab nested stack (unchanged) ----
// // // function HomeStackScreen() {
// // //   return (
// // //     <HomeStack.Navigator
// // //       initialRouteName="HomeMain"
// // //       screenOptions={{
// // //         headerShown: false,
// // //         contentStyle: { backgroundColor: Colors.background },
// // //         animation: defaultStackAnimation,
// // //         fullScreenSwipeEnabled: true,
// // //         gestureEnabled: true,
// // //       }}
// // //     >
// // //       <HomeStack.Screen name="HomeMain" component={HomeScreen} />
// // //       <HomeStack.Screen
// // //         name="ReceivedEncouragements"
// // //         component={ReceivedEncouragementsScreen}
// // //       />
// // //       <HomeStack.Screen name="Profile" component={ProfileScreen} />

// // //       <HomeStack.Screen name="Resources" component={ResourcesScreen} />
// // //       <HomeStack.Screen name="Donations" component={DonationsScreen} />
// // //       <HomeStack.Screen
// // //         name="AnsweredPrayers"
// // //         component={AnsweredPrayersScreen}
// // //       />
// // //       <HomeStack.Screen
// // //         name="Encouragement"
// // //         component={EncouragementScreen}
// // //         options={{ presentation: 'modal', animation: 'fade_from_bottom' }}
// // //       />
// // //       <HomeStack.Screen name="Bible" component={BibleScreen} />
// // //     </HomeStack.Navigator>
// // //   );
// // // }

// // // // ✅ bootstrap: content only
// // // async function bootstrapApp() {
// // //   try {
// // //     await syncContent();
// // //     await seedBibleIfNeeded();
// // //     await syncUserData();
// // //   } catch (e) {
// // //     console.warn('Initial content sync failed:', e);
// // //   }
// // // }

// // // export default function App() {
// // //   const [ready, setReady] = useState(false);

// // //   const appState = React.useRef(AppState.currentState);

// // //   React.useEffect(() => {
// // //     const sub = AppState.addEventListener('change', async (nextState) => {
// // //       const prev = appState.current;
// // //       appState.current = nextState;

// // //       // When coming back from background/inactive → active, try a quiet sync
// // //       if (prev.match(/background|inactive/) && nextState === 'active') {
// // //         try {
// // //           await syncUserData(); // your throttling will prevent spam
// // //         } catch (e) {
// // //           console.warn('[App] background syncUserData failed:', e);
// // //         }
// // //       }
// // //     });

// // //     return () => {
// // //       sub.remove();
// // //     };
// // //   }, []);

// // //   if (!ready) {
// // //     return (
// // //       <GestureHandlerRootView style={{ flex: 1 }}>
// // //         <SafeAreaProvider>
// // //           <View style={{ flex: 1 }}>
// // //             <SplashScreenView
// // //               load={bootstrapApp}
// // //               onFinish={() => setReady(true)}
// // //               animationMs={1800}
// // //               minVisibleMs={900}
// // //               maxWaitMs={8000}
// // //             />
// // //           </View>
// // //         </SafeAreaProvider>
// // //       </GestureHandlerRootView>
// // //     );
// // //   }

// // //   return (
// // //     <GestureHandlerRootView style={{ flex: 1 }}>
// // //       <SafeAreaProvider>
// // //         <View style={{ flex: 1 }}>
// // //           <NavigationContainer theme={AppTheme}>
// // //             <Stack.Navigator
// // //               initialRouteName="Auth"
// // //               screenOptions={{
// // //                 headerShown: true,
// // //                 header: () => <AppHeader />,
// // //                 headerTransparent: true,
// // //                 contentStyle: { backgroundColor: Colors.background },
// // //                 animation: 'fade',
// // //               }}
// // //             >
// // //               {/* Auth entry */}
// // //               <Stack.Screen
// // //                 name="Auth"
// // //                 component={AuthScreen}
// // //                 options={{ headerShown: false }}
// // //               />

// // //               {/* Main app */}
// // //               <Stack.Screen name="MainTabs" component={MainTabs} />
// // //             </Stack.Navigator>
// // //           </NavigationContainer>
// // //         </View>
// // //       </SafeAreaProvider>
// // //     </GestureHandlerRootView>
// // //   );
// // // }

// // // root/App.js
// // import 'react-native-gesture-handler';
// // import './src/bootstrap'; // <-- IMPORTANT: init logging level & any boot toggles ASAP

// // import React, { useState } from 'react';
// // import { View, AppState } from 'react-native';
// // import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // import { SafeAreaProvider } from 'react-native-safe-area-context';

// // import { seedBibleIfNeeded } from './src/logic/seedBible';
// // import AppHeader from './src/components/AppHeader';
// // import { Colors } from './src/constants/colors';
// // import MainTabs from './src/navigation/MainTabs';

// // import HomeScreen from './src/screens/HomeScreen';
// // import PrayerListScreen from './src/screens/PrayerListScreen';
// // import AnsweredPrayersScreen from './src/screens/AnsweredPrayersScreen';
// // import QuestScreen from './src/screens/QuestScreen';
// // import EncouragementScreen from './src/screens/EncouragementScreen';
// // import ReceivedEncouragementsScreen from './src/screens/ReceivedEncouragementsScreen';
// // import MakeFriendsScreen from './src/screens/MakeFriendsScreen';
// // import FriendsListScreen from './src/screens/FriendsListScreen';
// // import ProfileScreen from './src/screens/ProfileScreen';
// // import DonationsScreen from './src/screens/DonationsScreen';
// // import ResourcesScreen from './src/screens/ResourcesScreen';
// // import BibleScreen from './src/screens/BibleScreen';
// // import SplashScreenView from './src/screens/SplashScreen';
// // import AuthScreen from './src/screens/AuthScreen';

// // import DebugScreen from './src/screens/DebugScreen'; // <-- NEW (Option 3)

// // import { Colors as AppColors } from './src/constants/colors';
// // import { syncUserData } from './src/logic/syncUserData';
// // import { syncContent } from './src/logic/syncContent';

// // const Stack = createNativeStackNavigator();
// // const HomeStack = createNativeStackNavigator();

// // const AppTheme = {
// //   ...DefaultTheme,
// //   colors: { ...DefaultTheme.colors, background: Colors.background },
// // };

// // const defaultStackAnimation = 'slide_from_right';

// // // ---- Home tab nested stack (unchanged) ----
// // function HomeStackScreen() {
// //   return (
// //     <HomeStack.Navigator
// //       initialRouteName="HomeMain"
// //       screenOptions={{
// //         headerShown: false,
// //         contentStyle: { backgroundColor: Colors.background },
// //         animation: defaultStackAnimation,
// //         fullScreenSwipeEnabled: true,
// //         gestureEnabled: true,
// //       }}
// //     >
// //       <HomeStack.Screen name="HomeMain" component={HomeScreen} />
// //       <HomeStack.Screen
// //         name="ReceivedEncouragements"
// //         component={ReceivedEncouragementsScreen}
// //       />
// //       <HomeStack.Screen name="Profile" component={ProfileScreen} />
// //       <HomeStack.Screen name="Resources" component={ResourcesScreen} />
// //       <HomeStack.Screen name="Donations" component={DonationsScreen} />
// //       <HomeStack.Screen
// //         name="AnsweredPrayers"
// //         component={AnsweredPrayersScreen}
// //       />
// //       <HomeStack.Screen
// //         name="Encouragement"
// //         component={EncouragementScreen}
// //         options={{ presentation: 'modal', animation: 'fade_from_bottom' }}
// //       />
// //       <HomeStack.Screen name="Bible" component={BibleScreen} />
// //     </HomeStack.Navigator>
// //   );
// // }

// // // bootstrap content/data
// // async function bootstrapApp() {
// //   try {
// //     await syncContent();
// //     await seedBibleIfNeeded();
// //     await syncUserData();
// //   } catch (e) {
// //     console.warn('Initial content sync failed:', e);
// //   }
// // }

// // export default function App() {
// //   const [ready, setReady] = useState(false);
// //   const appState = React.useRef(AppState.currentState);

// //   React.useEffect(() => {
// //     const sub = AppState.addEventListener('change', async (nextState) => {
// //       const prev = appState.current;
// //       appState.current = nextState;

// //       if (prev.match(/background|inactive/) && nextState === 'active') {
// //         try {
// //           await syncUserData(); // throttled inside your sync logic
// //         } catch (e) {
// //           console.warn('[App] background syncUserData failed:', e);
// //         }
// //       }
// //     });
// //     return () => sub.remove();
// //   }, []);

// //   if (!ready) {
// //     return (
// //       <GestureHandlerRootView style={{ flex: 1 }}>
// //         <SafeAreaProvider>
// //           <View style={{ flex: 1 }}>
// //             <SplashScreenView
// //               load={bootstrapApp}
// //               onFinish={() => setReady(true)}
// //               animationMs={1800}
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
// //           <NavigationContainer theme={AppTheme}>
// //             <Stack.Navigator
// //               initialRouteName="Auth"
// //               screenOptions={{
// //                 headerShown: true,
// //                 header: () => <AppHeader />,
// //                 headerTransparent: true,
// //                 contentStyle: { backgroundColor: Colors.background },
// //                 animation: 'fade',
// //               }}
// //             >
// //               {/* Auth entry */}
// //               <Stack.Screen
// //                 name="Auth"
// //                 component={AuthScreen}
// //                 options={{ headerShown: false }}
// //               />

// //               {/* Main app */}
// //               <Stack.Screen name="MainTabs" component={MainTabs} />

// //               {/* 🔧 Debug (Option 3): a simple screen to tweak log level at runtime */}
// //               <Stack.Screen
// //                 name="Debug"
// //                 component={DebugScreen}
// //                 options={{
// //                   presentation: 'modal',
// //                   animation: 'slide_from_bottom',
// //                   headerShown: true,
// //                   title: 'Debug',
// //                 }}
// //               />
// //             </Stack.Navigator>
// //           </NavigationContainer>
// //         </View>
// //       </SafeAreaProvider>
// //     </GestureHandlerRootView>
// //   );
// // }

// import React, { useRef } from 'react';
// import { StatusBar, Platform, Pressable, View } from 'react-native';
// import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import FriendsListScreen from './src/screens/FriendsListScreen';
// import MakeFriendsScreen from './src/screens/MakeFriendsScreen';
// import DebugScreen from './src/screens/DebugScreen'; // you already added this
// import bootstrap from './src/auth/bootstrap';

// import { isAdminCached } from './src/utils/adminGate';
// import { log } from './src/utils/logger';

// const Stack = createNativeStackNavigator();

// function SecretDebugHotspot({ navigation }) {
//   const stateRef = useRef({ count: 0, timer: null });
//   const admin = isAdminCached() || __DEV__;

//   if (!admin) return null;

//   const onTap = () => {
//     clearTimeout(stateRef.current.timer);
//     stateRef.current.count += 1;
//     stateRef.current.timer = setTimeout(() => {
//       stateRef.current.count = 0;
//     }, 3000);

//     if (stateRef.current.count >= 7) {
//       stateRef.current.count = 0;
//       log('debug').info('Secret gesture → Debug');
//       navigation.navigate('Debug');
//     }
//   };

//   return (
//     <Pressable
//       onPress={onTap}
//       hitSlop={20}
//       style={{
//         position: 'absolute',
//         right: 0,
//         top: Platform.select({ ios: 8, android: 8 }),
//         width: 44,
//         height: 44,
//         // Note: fully invisible; set backgroundColor rgba(255,0,0,0.08) to see it while testing
//       }}
//     >
//       <View />
//     </Pressable>
//   );
// }

// export default function App() {
//   const admin = isAdminCached() || __DEV__;

//   const theme = {
//     ...DefaultTheme,
//     colors: { ...DefaultTheme.colors, background: '#0e3a53' },
//   };

//   return (
//     <NavigationContainer theme={theme}>
//       <StatusBar
//         barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
//       />
//       <Stack.Navigator
//         screenOptions={{
//           headerShown: false,
//         }}
//       >
//         {/* Your normal screens */}
//         <Stack.Screen name="FriendsList" component={FriendsListScreen} />
//         <Stack.Screen name="MakeFriends" component={MakeFriendsScreen} />

//         {/* Debug screen is HARD-HIDDEN unless admin/dev */}
//         {admin && (
//           <Stack.Screen
//             name="Debug"
//             component={DebugScreen}
//             options={{ presentation: 'modal' }}
//           />
//         )}
//       </Stack.Navigator>

//       {/* Global hidden hotspot (admin-only) */}
//       {/* Needs access to navigation: easiest is via a ref or a small wrapper; this inline trick uses a child nav to get navigation object */}
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen
//           name="__hotspot"
//           component={({ navigation }) => (
//             <SecretDebugHotspot navigation={navigation} />
//           )}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// root/App.js
import 'react-native-gesture-handler';
import React, { useState, useRef, useEffect } from 'react';
import { View, AppState, Pressable, Platform } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppHeader from './src/components/AppHeader';
import { Colors } from './src/constants/colors';

import MainTabs from './src/navigation/MainTabs';
import AuthScreen from './src/screens/AuthScreen';
import DebugScreen from './src/screens/DebugScreen'; // optional, dev/admin only

import SplashScreenView from './src/screens/SplashScreen';
import { syncUserData } from './src/logic/syncUserData';
import { syncContent } from './src/logic/syncContent';
import { seedBibleIfNeeded } from './src/logic/seedBible';

// Optional admin helper (don’t crash if it’s missing)
let isAdminCached = () => false;
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  isAdminCached =
    require('./src/utils/adminGate').isAdminCached ?? (() => false);
} catch {
  /* keep default */
}

// If your auth/bootstrap has side-effects, import it as a side-effect:
try {
  // eslint-disable-next-line global-require
  require('./src/auth/bootstrap');
} catch {
  /* optional */
}

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

const AppTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Colors.background },
};

// ---- Secret hotspot overlay (no inline screen component; uses navigationRef) ----
function SecretDebugHotspot() {
  const stateRef = useRef({ count: 0, timer: null });
  const allow = __DEV__ || isAdminCached();

  if (!allow) return null;

  const onTap = () => {
    clearTimeout(stateRef.current.timer);
    stateRef.current.count += 1;
    stateRef.current.timer = setTimeout(() => {
      stateRef.current.count = 0;
    }, 2000); // 5 taps within 2 seconds

    if (stateRef.current.count >= 5) {
      stateRef.current.count = 0;
      if (navigationRef.isReady()) {
        navigationRef.navigate('Debug');
      }
    }
  };

  return (
    <Pressable
      onPress={onTap}
      hitSlop={20}
      style={{
        position: 'absolute',
        right: 0,
        top: Platform.select({ ios: 8, android: 8 }),
        width: 44,
        height: 44,
        // while testing you can visualize it:
        // backgroundColor: 'rgba(255,0,0,0.08)',
      }}
    >
      {/* invisible tap target */}
      <View />
    </Pressable>
  );
}

// ✅ bootstrap: content only (your original behavior)
async function bootstrapApp() {
  try {
    await syncContent();
    await seedBibleIfNeeded();
    await syncUserData();
  } catch (e) {
    console.warn('Initial content sync failed:', e);
  }
}

export default function App() {
  const [ready, setReady] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', async (nextState) => {
      const prev = appState.current;
      appState.current = nextState;
      if (prev?.match(/background|inactive/) && nextState === 'active') {
        try {
          await syncUserData(); // throttled inside your sync logic
        } catch (e) {
          console.warn('[App] background syncUserData failed:', e);
        }
      }
    });
    return () => sub.remove();
  }, []);

  if (!ready) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <View style={{ flex: 1 }}>
            <SplashScreenView
              load={bootstrapApp}
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
          <NavigationContainer theme={AppTheme} ref={navigationRef}>
            <Stack.Navigator
              initialRouteName="Auth"
              screenOptions={{
                headerShown: true,
                header: () => <AppHeader />,
                headerTransparent: true,
                contentStyle: { backgroundColor: Colors.background },
                animation: 'fade',
              }}
            >
              {/* Auth entry */}
              <Stack.Screen
                name="Auth"
                component={AuthScreen}
                options={{ headerShown: false }}
              />
              {/* Main app */}
              <Stack.Screen name="MainTabs" component={MainTabs} />

              {/* Debug screen: only mount for dev/admin so regular users can’t reach it */}
              {(__DEV__ || isAdminCached()) && (
                <Stack.Screen
                  name="Debug"
                  component={DebugScreen}
                  options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                    headerShown: true,
                    title: 'Debug',
                  }}
                />
              )}
            </Stack.Navigator>

            {/* Invisible, global, single overlay (NO extra navigator) */}
            <SecretDebugHotspot />
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
