import { useEffect, useState } from 'react';

/**
 * searchに１文字入れられるごとに検索を行うのは非効率なので、
 * 入力が終わってから検索を行うためのカスタムフック
 * @param value
 * @param delay
 * @returns
 */
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
