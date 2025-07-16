import { useState } from 'react';

// A type alias for the initial value, which can be a value of type T
// or a function that returns a value of type T (a "lazy initializer").
type Initializer<T> = T | (() => T);

/**
 * An enhanced custom hook that syncs state with localStorage. It mirrors React's
 * useState API by allowing a lazy initializer for the default value.
 *
 * @param key The key for storing the value in localStorage.
 * @param defaultValue The default value to use if nothing is in localStorage.
 *                     It can be a value (T) or a function (() => T) that returns the value.
 * @returns A stateful value and a function to update it, following the useState convention.
 */
export default function useLocalStorageState<T>(
  key: string,
  defaultValue: Initializer<T>
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      // If a value is already stored, parse and return it.
      if (storedValue !== null) {
        return JSON.parse(storedValue);
      }
    } catch (error) {
      // If localStorage is unavailable or data is corrupt, log an error.
      console.error(`Error reading localStorage key “${key}”:`, error);
    }

    // --- ENHANCEMENT ---
    // If no stored value exists, check if the defaultValue is a function.
    // If it is, call it to get the initial value (lazy initialization).
    if (typeof defaultValue === 'function') {
      // We cast the defaultValue to a function type and execute it.
      return (defaultValue as () => T)();
    }

    // Otherwise, return the defaultValue directly.
    return defaultValue;
  });

  // This wrapper function updates the state and persists it to localStorage.
  const setAndStoreState: React.Dispatch<React.SetStateAction<T>> = (value) => {
    setState((prevState) => {
      // Determine the new value. It can be a direct value or a function
      // that receives the previous state.
      const newValue =
        typeof value === 'function'
          ? (value as (prev: T) => T)(prevState)
          : value;

      try {
        // Persist the new value to localStorage.
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error(`Error writing to localStorage for key “${key}”:`, error);
      }

      // Return the new value to update the component's state.
      return newValue;
    });
  };

  return [state, setAndStoreState];
}