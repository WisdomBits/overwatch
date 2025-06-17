import { produce } from 'immer';
import pubsub from '../core/pubsub';
import { runMiddlewares } from './Middleware';
import { globalStore, ServerStore } from './createServerStore';

export function createSharedState<T>(key: string, initialValue: T, store: ServerStore = globalStore) {
  if (!store.getSnapshot().hasOwnProperty(key)) {
    store.set(key, initialValue);
  }
}

export function batchCreateSharedStates(
  stateObj: Record<string, any>,
  store?: ServerStore
) {
  Object.entries(stateObj).forEach(([key, value]) => {
    createSharedState(key, value, store);
  });
}

export function setSharedState<T>(key: string, newValue: T, store: ServerStore = globalStore) {
  const prevValue = store.get<T>(key);

  runMiddlewares<T>(key, newValue, (val) => {
    const immutableValue =
      isPlainObject(prevValue) && isPlainObject(val)
        ? produce(prevValue, (draft: any) => {
            Object.assign(draft, val);
          })
        : val;
    store.set(key, immutableValue);
    pubsub.publish<T>(key, immutableValue);
  });
}

export function getSharedState<T>(key: string, store: ServerStore = globalStore): T {
  return store.get<T>(key);
}


function isPlainObject(obj: any): obj is Record<string, unknown> {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}
