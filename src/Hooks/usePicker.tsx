"use client";

import { useEffect, useState, useRef } from 'react';
import { globalStore, ServerStore } from '../core-utils/createServerStore';
import { getSharedState } from '../core-utils/sharedState';
import pubsub from '../core/pubsub';
import { KeyRegistry } from '../core-utils/keyRegistery';

interface PickerOptions<T> {
  store?: ServerStore;
}

export function usePicker<K extends keyof KeyRegistry, S>(
  key: K,
  selector: (state: KeyRegistry[K]) => S,
  equalityFn: (a: S, b: S) => boolean = (a, b) => a === b,
  options?: PickerOptions<KeyRegistry[K]>
): S {
  const store = options?.store || globalStore;

  const [selected, setSelected] = useState(() =>
    selector(getSharedState<KeyRegistry[K]>(key as string, store))
  );
  const latestSelected = useRef(selected);

  useEffect(() => {
    const update = (newValue: KeyRegistry[K]) => {
      const nextSelected = selector(newValue);
      if (!equalityFn(latestSelected.current, nextSelected)) {
        latestSelected.current = nextSelected;
        setSelected(nextSelected);
      }
    };

    pubsub.subscribe<KeyRegistry[K]>(key as string, update);
    return () => pubsub.unsubscribe<KeyRegistry[K]>(key as string, update);
  }, [key, selector, equalityFn, store]);

  return selected;
}
