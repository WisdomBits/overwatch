"use client";

import { useEffect, useState } from 'react';
import pubsub from '../core/pubsub';
import { runMiddlewareChain } from '../core-utils/Middleware';
import { getSharedState, setSharedState } from '../core-utils/sharedState';
import { globalStore, ServerStore } from '../core-utils/createServerStore';
import { KeyRegistry } from '../core-utils/keyRegistery';

type Middleware<T> = (value: T, next: (v: T) => void) => void;

interface Options<T> {
  middleware?: Middleware<T>[];
  store?: ServerStore;
}

export function useSharedState<K extends keyof KeyRegistry>(
  key: K,
  options?: Options<KeyRegistry[K]>
): [KeyRegistry[K], (v: KeyRegistry[K] | ((prev: KeyRegistry[K]) => KeyRegistry[K])) => void] {
  const store = options?.store || globalStore;

  const [value, setValue] = useState<KeyRegistry[K]>(
    () => getSharedState<KeyRegistry[K]>(key as string, store)
  );

  useEffect(() => {
    if (store !== globalStore) return;

    const update = (newValue: KeyRegistry[K]) => {
      setValue(newValue);
    };

    pubsub.subscribe<KeyRegistry[K]>(key as string, update);

    return () => {
      pubsub.unsubscribe<KeyRegistry[K]>(key as string, update);
    };
  }, [key, store]);

  const setter = (
    value: KeyRegistry[K] | ((prev: KeyRegistry[K]) => KeyRegistry[K])
  ) => {
    const middleware = options?.middleware;
    const prevValue = getSharedState<KeyRegistry[K]>(key as string, store);

    const newValue =
      typeof value === 'function'
        ? (value as (prev: KeyRegistry[K]) => KeyRegistry[K])(prevValue)
        : value;

    if (middleware?.length) {
      runMiddlewareChain(middleware, newValue, (processedValue) => {
        setSharedState<KeyRegistry[K]>(key as string, processedValue, store);
      });
    } else {
      setSharedState<KeyRegistry[K]>(key as string, newValue, store);
    }
  };

  return [value, setter];
}
