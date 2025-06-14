const stateStore = new Map<string, any>();

export function createSharedState<T>(key: string, initialValue: T) {
  if (!stateStore.has(key)) {
    stateStore.set(key, initialValue);
  }
}

export function getSharedState<T>(key: string): T {
  if (!stateStore.has(key)) {
    throw new Error(`No state found for key: ${key}`);
  }
  return stateStore.get(key);
}