/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useCallback } from 'react';

export default function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: Parameters<T>) => {
      const handler = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
      return () => clearTimeout(handler);
    },
    [delay]
  );
}