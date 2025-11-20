// // src/hooks/useAutoScrollTop.js
// import { useFocusEffect } from '@react-navigation/native';
// import { useCallback } from 'react';

// export function useAutoScrollTop(ref) {
//   useFocusEffect(
//     useCallback(() => {
//       ref.current?.scrollTo({ y: 0, animated: false });
//     }, [])
//   );
// }

// src/hooks/useAutoScrollTop.js
import { useEffect, useRef, useCallback } from 'react';
import { InteractionManager } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

/**
 * Auto-scroll a scrollable ref to the top when the screen gains focus,
 * and (optionally) when the tab is pressed again.
 *
 * @param {React.RefObject<any>} ref - ref to ScrollView / FlatList / SectionList
 * @param {object} options
 * @param {boolean} [options.animated=false] - animate the scroll
 * @param {number} [options.offset=0] - y/offset to scroll to
 * @param {boolean} [options.onTabPress=true] - also scroll on tab re-press
 * @param {boolean} [options.afterInteractions=true] - wait for interactions/layout
 * @param {number}  [options.delayMs=0] - extra delay before scrolling
 */
export function useAutoScrollTop(
  ref,
  {
    animated = false,
    offset = 0,
    onTabPress = true,
    afterInteractions = true,
    delayMs = 0,
  } = {}
) {
  const timeoutRef = useRef();

  const doScroll = useCallback(() => {
    const node = ref?.current;
    if (!node) return;
    // ScrollView API
    if (typeof node.scrollTo === 'function') {
      node.scrollTo({ y: offset, animated });
      return;
    }
    // FlatList/SectionList API
    if (typeof node.scrollToOffset === 'function') {
      node.scrollToOffset({ offset, animated });
      return;
    }
    // RN Web / DOM node fallback (rare)
    if (typeof node.scrollTo === 'function') {
      node.scrollTo(0, offset);
    }
  }, [ref, offset, animated]);

  const schedule = useCallback(() => {
    const run = () => {
      if (delayMs > 0) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(doScroll, delayMs);
      } else {
        doScroll();
      }
    };
    if (afterInteractions) {
      InteractionManager.runAfterInteractions(run);
    } else {
      run();
    }
  }, [afterInteractions, delayMs, doScroll]);

  // Scroll to top when this screen gains focus
  useFocusEffect(
    useCallback(() => {
      schedule();
      return () => {
        clearTimeout(timeoutRef.current);
      };
    }, [schedule])
  );

  // Optionally scroll to top when the tab is pressed again
  const navigation = useNavigation();
  useEffect(() => {
    if (!onTabPress || !navigation || !navigation.addListener) return;
    const unsub = navigation.addListener('tabPress', () => {
      schedule();
    });
    return unsub;
  }, [navigation, onTabPress, schedule]);
}
