🌿 The Narrow Way

A Reformed Christian mobile app built with React Native (Expo) and Supabase, designed to encourage daily spiritual growth without screen addiction. The app provides daily Bible-based quests, prayer tracking, and a community of encouragement centered on Christ-like virtues.

Features

✝️ Daily quests to practice Biblical virtues (Faith, Love, Patience, Kindness, etc.)

🙏 Prayer list with progress tracking and archival

💬 Encouragement system — send and receive uplifting messages from friends

🧭 Profiles with levels and verses that reflect personal growth

📖 “Your Verse” card for daily Scripture reminders

🌅 Whimsical yet peaceful UI with subtle animations and light rays symbolizing grace

🔒 Built with Supabase authentication, real-time sync, and secure user data policies

Tech Stack

Front-end: React Native + Expo SDK 54

Backend: Supabase (PostgreSQL, Auth, Functions, RLS)

------------------------------------------------------------------------------------------------------------------------------------------------------------

11/5/25

Made updates to the tiles to make them more square to increase application asthetics.

Auth: Email, Google, and Apple Sign-in

UI: Custom minimalist design inspired by Matthew 7:13–14 — “The narrow way that leads to life.”


Ran into an issue with Android screens that are a little smaller like Z Fold front screens was pushing an emoji off a tile description.

Separated the emoji from the text and removed custom font on android with:

          <Text
            //  separate Text for emoji; no custom font on Android
            style={[
              styles.emoji,
              Platform.select({ android: { fontFamily: undefined } }), // critical
            ]}
            allowFontScaling={false}
          >
Which I then updated the Home screen with:

 const tiles = [
  { label: "Today's Quest", emoji: '🎯', screen: 'Quest' },
  { label: 'Prayer Requests', emoji: '🙏', screen: 'PrayerList' },
  { label: 'Friends List', emoji: '📋', screen: 'FriendsList' },
  { label: 'Answered Prayers', emoji: '✨', screen: 'AnsweredPrayers' },
  { label: 'Encouragements', emoji: '💬', screen: 'Encouragement' },
  { label: 'Make Friends', emoji: '🤝', screen: 'MakeFriends' },
  { label: 'Profile', emoji: '👤', screen: 'Profile' },
  { label: 'Progress', emoji: '🌱', screen: 'Progress' },
];

I then had to tweak the grid style for better spacing by changing justifyContent to 'space-between'.

> > > > > > > origin/main
