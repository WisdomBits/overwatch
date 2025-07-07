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
  const update = (selectedSlice: S) => {
    latestSelected.current = selectedSlice;
    setSelected(selectedSlice);
  };

  pubsub.subscribe<T, S>(
    key,
    update,
    equalityFn,
    getSharedState<T>(key, store),
    selector
    //component name
  );

  return () => pubsub.unsubscribe<T, S>(key, update);
}, [key, selector, equalityFn]);

  return selected;
}