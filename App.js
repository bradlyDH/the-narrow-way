import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

const Stack = createNativeStackNavigator();

const AppTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Colors.background }
};

export default function App() {
  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'left',
          headerBackVisible: false,
          headerRight: () => null,
          contentStyle: { backgroundColor: Colors.background }
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'The Narrow Way' }} />
        <Stack.Screen name="PrayerList" component={PrayerListScreen} options={{ title: 'Prayer Requests' }} />
        <Stack.Screen name="AnsweredPrayers" component={AnsweredPrayersScreen} options={{ title: 'Answered Prayers' }} />
        <Stack.Screen name="Quest" component={QuestScreen} options={{ title: "Today's Quest" }} />
        <Stack.Screen name="Progress" component={ProgressScreen} options={{ title: 'Your Growth' }} />
        <Stack.Screen name="Encouragement" component={EncouragementScreen} options={{ title: 'Encouragement' }} />
        <Stack.Screen name="ReceivedEncouragements" component={ReceivedEncouragementsScreen} options={{ title: 'Received Encouragements' }} />
        <Stack.Screen name="MakeFriends" component={MakeFriendsScreen} options={{ title: 'Find Your Friends' }} />
        <Stack.Screen name="FriendsList" component={FriendsListScreen} options={{ title: 'Friends List' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
