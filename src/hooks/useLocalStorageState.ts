import { useState } from 'react';

export default function useLocalStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  });

  // Save to localStorage whenever the state changes
  const setAndStoreState: React.Dispatch<React.SetStateAction<T>> = (value) => {
    setState((prevState) => {
      const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prevState) : value;
      localStorage.setItem(key, JSON.stringify(newValue));
      return newValue;
    });
  };

  return [state, setAndStoreState];
}