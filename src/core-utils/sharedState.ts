import { produce } from 'immer';
import pubsub from '../core/pubsub';
import { runMiddlewares } from './Middleware';
import { globalStore, ServerStore } from './createServerStore';
import { persistValue, getPersistedValue, setPersistence } from './persistance';


export function createSharedState<T>(key: string, initialValue: T, store: ServerStore = globalStore, persist?: "localStorage" | "sessionStorage") {
  if(persist) setPersistence(key, persist);
  const persisted = getPersistedValue<T>(key);
  if (!store.getSnapshot().hasOwnProperty(key)) {
    store.set(key,  persisted !== undefined ? persisted : initialValue);
  }
}

export function batchCreateSharedStates(
  stateObj: Record<string, any>,
  store?: ServerStore,
  persist?: "localStorage" | "sessionStorage"
) {
  Object.entries(stateObj).forEach(([key, value]) => {
    createSharedState(key, value, store,persist);
  });
}

export function setSharedState<T>(key: string, newValue: T, store: ServerStore = globalStore) {
  const prevValue = store.get<T>(key);

  runMiddlewares<T>(key, newValue, (val) => {
    const immutableValue =
      isPlainObject(prevValue) && isPlainObject(val)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? produce(prevValue, (draft: any) => {
            Object.assign(draft, val);
          })
        : val;
    store.set(key, immutableValue);
    persistValue(key, immutableValue);
    pubsub.publish<T>(key, immutableValue);
  });
}

export function getSharedState<T>(key: string, store: ServerStore = globalStore): T {
  return store.get<T>(key);
}


function isPlainObject(obj: any): obj is Record<string, unknown> {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}
