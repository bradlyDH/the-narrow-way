// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Image,
//   Linking,
//   TouchableOpacity,
// } from 'react-native';
// import Screen from '../components/Screen';
// import SunRays from '../components/SunRays';
// import { Colors } from '../constants/colors';
// import { Ionicons } from '@expo/vector-icons';

// const resources = [
//   {
//     section: 'Biblical Resources',
//     items: [
//       {
//         title: 'Grace to You',
//         sub: "John MacArthur's teaching ministry",
//         url: 'https://www.gty.org/',
//         thumb: 'https://www.google.com/s2/favicons?domain=gty.org&sz=64',
//       },
//       {
//         title: 'Ligonier Ministries',
//         sub: "R.C. Sproul's teaching ministry",
//         url: 'https://www.ligonier.org/',
//         thumb: 'https://www.google.com/s2/favicons?domain=ligonier.org&sz=64',
//       },
//       {
//         title: 'Parkside Church',
//         sub: "Alistair Begg's ministry",
//         url: 'https://parksidegreen.org/',
//         thumb:
//           'https://www.google.com/s2/favicons?domain=parksidegreen.org&sz=64',
//       },
//     ],
//   },
//   {
//     section: 'Trustworthy Business',
//     items: [
//       {
//         title: 'Griffco Supply',
//         sub: 'Construction materials and supplies',
//         url: 'https://www.griffcosupply.com/',
//         thumb:
//           'https://www.google.com/s2/favicons?domain=griffcosupply.com&sz=64',
//       },
//     ],
//   },
// ];

// export default function ResourcesScreen({ navigation }) {
//   const open = (url) => Linking.openURL(url).catch(() => {});

//   return (
//     <Screen showBack onBack={() => navigation.goBack()}>
//       <View style={styles.container}>
//         <SunRays />

//         <ScrollView contentContainerStyle={styles.content}>
//           <Text style={styles.title}>Resources 🧰</Text>

//           {resources.map((group) => (
//             <View key={group.section} style={{ marginTop: 18 }}>
//               <Text style={styles.section}>{group.section}</Text>

//               {group.items.map((item) => (
//                 <TouchableOpacity
//                   key={item.title}
//                   style={styles.card}
//                   activeOpacity={0.9}
//                   onPress={() => open(item.url)}
//                 >
//                   <View style={styles.row}>
//                     <Image source={{ uri: item.thumb }} style={styles.thumb} />
//                     <View style={{ flex: 1 }}>
//                       <Text style={styles.cardTitle}>{item.title}</Text>
//                       <Text style={styles.cardSub}>{item.sub}</Text>
//                     </View>
//                     <Ionicons
//                       name="open-outline"
//                       size={22}
//                       color={Colors.sun}
//                     />
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           ))}
//         </ScrollView>
//       </View>
//     </Screen>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.background },
//   content: { paddingHorizontal: 16, paddingBottom: 24 },
//   title: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: Colors.button,
//     marginTop: 8,
//   },
//   section: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: '#1b2140',
//     marginBottom: 10,
//   },
//   card: {
//     backgroundColor: '#1c7293', // deep teal per your tiles
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 2,
//   },
//   row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   thumb: {
//     width: 28,
//     height: 28,
//     borderRadius: 6,
//     marginRight: 6,
//     backgroundColor: '#e9eef3',
//   },
//   cardTitle: {
//     color: '#fff',
//     fontWeight: '800',
//     fontSize: 18,
//     marginBottom: 2,
//   },
//   cardSub: { color: Colors.text, fontSize: 14 },
// });

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';
import Screen from '../components/Screen';
import { Colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const resources = [
  {
    section: 'Biblical Resources',
    items: [
      {
        title: 'Grace to You',
        sub: "John MacArthur's teaching ministry",
        url: 'https://www.gty.org/',
        thumb: 'https://www.google.com/s2/favicons?domain=gty.org&sz=64',
      },
      {
        title: 'Ligonier Ministries',
        sub: "R.C. Sproul's teaching ministry",
        url: 'https://www.ligonier.org/',
        thumb: 'https://www.google.com/s2/favicons?domain=ligonier.org&sz=64',
      },
      {
        title: 'Parkside Church',
        sub: "Alistair Begg's ministry",
        url: 'https://parksidegreen.org/',
        thumb:
          'https://www.google.com/s2/favicons?domain=parksidegreen.org&sz=64',
      },
    ],
  },
  {
    section: 'Trustworthy Business',
    items: [
      {
        title: 'Griffco Supply',
        sub: 'Business offering custom-engraved products, from trophies to plaques, along with laser cutting.',
        url: 'https://www.griffcosupply.com/',
        thumb:
          'https://www.google.com/s2/favicons?domain=griffcosupply.com&sz=64',
      },
    ],
  },
];

export default function ResourcesScreen({ navigation }) {
  const open = (url) => Linking.openURL(url).catch(() => {});

  return (
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Resources 🧰</Text>

        {resources.map((group) => (
          <View key={group.section} style={{ marginTop: 18 }}>
            <Text style={styles.section}>{group.section}</Text>

            {group.items.map((item) => (
              <TouchableOpacity
                key={item.title}
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => open(item.url)}
              >
                <View style={styles.row}>
                  <Image source={{ uri: item.thumb }} style={styles.thumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSub}>{item.sub}</Text>
                  </View>
                  <Ionicons name="open-outline" size={22} color={Colors.sun} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.button,
    marginTop: 8,
  },
  section: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1b2140',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#1c7293',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    opacity: 0.85,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: {
    width: 28,
    height: 28,
    borderRadius: 6,
    marginRight: 6,
    backgroundColor: '#e9eef3',
  },
  cardTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 2,
  },
  cardSub: { color: Colors.text, fontSize: 14 },
});
