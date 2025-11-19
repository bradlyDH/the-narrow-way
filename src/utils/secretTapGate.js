// src/utils/SecretTapGate.js
import React, { useRef, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';

/**
 * SecretTapGate
 * Wrap any child and detect N taps within a given window (default 5 taps / 2000ms).
 *
 * Props:
 * - onUnlock: () => void             // called when threshold met
 * - threshold?: number               // default 5
 * - windowMs?: number                // default 2000
 * - disabled?: boolean               // if true, pass taps through without counting
 * - children: ReactNode              // typically a title area or icon
 * - ...rest                          // passed to TouchableOpacity (style, activeOpacity, etc.)
 */
export default function SecretTapGate({
  onUnlock,
  threshold = 5,
  windowMs = 2000,
  disabled = false,
  children,
  ...rest
}) {
  const ref = useRef({ count: 0, lastTs: 0, timer: null });

  useEffect(() => {
    return () => {
      if (ref.current.timer) clearTimeout(ref.current.timer);
      ref.current.timer = null;
    };
  }, []);

  const onPress = () => {
    if (disabled) {
      // Pass through with no counting
      rest?.onPress?.();
      return;
    }

    const now = Date.now();
    const S = ref.current;

    if (now - S.lastTs > windowMs) {
      S.count = 0;
    }
    S.count += 1;
    S.lastTs = now;

    if (S.timer) clearTimeout(S.timer);
    S.timer = setTimeout(() => {
      S.count = 0;
      S.timer = null;
    }, windowMs);

    if (S.count >= threshold) {
      S.count = 0;
      if (typeof onUnlock === 'function') onUnlock();
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.9} {...rest} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
}
