// import React from 'react';
// import { View, StyleSheet } from 'react-native';

// export default function SunRays() {
//   return (
//     <View pointerEvents="none" style={styles.wrap}>
//       <View style={styles.sunBlob} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   wrap: { position: 'absolute', top: 0, left: 0, right: 0, height: 220 },
//   sunBlob: {
//     position: 'absolute',
//     right: -90,
//     top: -90,
//     width: 260,
//     height: 260,
//     backgroundColor: 'rgba(245,238,158,0.08)',
//     borderRadius: 999,
//   },
// });

import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function SunRays() {
  return (
    <View pointerEvents="none" style={styles.wrap}>
      <View style={styles.sunBlob} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, height: 220 },
  sunBlob: {
    position: 'absolute',
    right: -90,
    top: -90,
    width: 260,
    height: 260,
    backgroundColor: 'rgba(245,238,158,0.08)', // <10% opacity
    borderRadius: 999,
  },
});
