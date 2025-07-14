"use client"
import { useEffect, useState, useRef } from 'react';
import { globalStore, ServerStore } from '../core-utils/createServerStore';
import { getSharedState } from '../core-utils/sharedState';
import pubsub from '../core/pubsub';

interface PickerOptions<T> {
  store?: ServerStore;
}
export function usePicker<T, S>(
  key: string,
  selector: (state: T) => S,
  equalityFn: (a: S, b: S) => boolean = (a, b) => a === b,
  options?: PickerOptions<T>
): S {
  const store = options?.store || globalStore;
  const [selected, setSelected] = useState(() => selector(getSharedState<T>(key, store)));
  const latestSelected = useRef(selected);

  useEffect(() => {
    const update = (newValue: T) => {
      const nextSelected = selector(newValue);
      if (!equalityFn(latestSelected.current, nextSelected)) {
        latestSelected.current = nextSelected;
        setSelected(nextSelected);
      }
    };

    pubsub.subscribe<T>(key, update);
    return () => pubsub.unsubscribe<T>(key, update);
  }, [key, selector, equalityFn]);

  return selected;
}