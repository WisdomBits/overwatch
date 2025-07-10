"use client"
import { useEffect, useState } from 'react';
import pubsub from '../core/pubsub';
import { runMiddlewareChain } from '../core-utils/Middleware';
import { getSharedState, setSharedState } from '../core-utils/sharedState';
import { globalStore, ServerStore } from '../core-utils/createServerStore';

type Middleware<T> = (value: T, next: (v: T) => void) => void;
interface Options<T> {
  middleware?: Middleware<T>[];
  store?: ServerStore;
}

export function useSharedState<T>(key: string, options?: Options<T>): [T, (v: T | ((prev: T) => T)) => void] {
  const store = options?.store || globalStore;
  const [value, setValue] = useState<T>(() => getSharedState<T>(key, store));

  useEffect(() => {
    if (store !== globalStore) return;
    const update = (newValue: T) => {
      setValue(newValue);
    };

    pubsub.subscribe<T>(key, update);

    return () => {
      pubsub.unsubscribe<T>(key, update);
    };
  }, [key]);

  const setter = (value: T | ((prev: T) => T)) => {
    const middleware = options?.middleware;
    const prevValue = getSharedState<T>(key, store);

    const newValue =
      typeof value === 'function'
        ? (value as (prev: T) => T)(prevValue)
        : value;

    if (middleware?.length) {
      runMiddlewareChain(middleware, newValue, (processedValue) => {
        setSharedState<T>(key, processedValue, store);
      });
    } else {
      setSharedState<T>(key, newValue, store);
    }
  };

  return [value, setter];
}
