import { produce } from 'immer';
import pubsub from '../core/pubsub';

const stateStore = new Map<string, any>();

export function createSharedState<T>(key: string, initialValue: T) {
  if (!stateStore.has(key)) {
    stateStore.set(key, initialValue);
  }
}

export function setSharedState<T>(key: string, newValue: T) {
  const prevValue = stateStore.get(key);

    // If both previous and new value are objects, using Immer to deeply update
    const immutableValue =
      isPlainObject(prevValue) && isPlainObject(newValue)
        ? produce(prevValue, (draft: any) => {
          Object.assign(draft, newValue);
        })
        : newValue;
    stateStore.set(key, immutableValue);
    pubsub.publish<T>(key, immutableValue as T);
}

export function getSharedState<T>(key: string): T {
  if (!stateStore.has(key)) {
    throw new Error(`No state found for key: ${key}`);
  }
  return stateStore.get(key);
}

function isPlainObject(obj: any): obj is Record<string, unknown> { // TypeScript type predicate
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}