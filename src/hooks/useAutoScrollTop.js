// src/hooks/useAutoScrollTop.js
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export function useAutoScrollTop(ref) {
  useFocusEffect(
    useCallback(() => {
      ref.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );
}
