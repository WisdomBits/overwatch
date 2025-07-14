
const persistenceConfig = new Map<string, "localStorage" | "sessionStorage">();

function getStorage(type: "localStorage" | "sessionStorage") {
  if (typeof window === "undefined") return null;
  return type === "localStorage" ? window.localStorage : window.sessionStorage;
}

export function setPersistence(key: string, type: "localStorage" | "sessionStorage") {
  persistenceConfig.set(key, type);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function persistValue(key: string, value: any) {
  const type = persistenceConfig.get(key);
  if (!type) return;

  const storage = getStorage(type);
  if (!storage) return;

  try {
    storage.setItem(`${key}`, JSON.stringify(value));
  } catch (err) {
    console.error(`[Overwatch] Failed to persist key "${key}":`, err);
  }
}

export function getPersistedValue<T>(key: string): T | undefined {
  const type = persistenceConfig.get(key);
  if (!type) return undefined;

  const storage = getStorage(type);
  if (!storage) return undefined;

  try {
    const item = storage.getItem(`${key}`);
    if (!item) return undefined;
    return JSON.parse(item);
  } catch (err) {
    console.error(`[Overwatch] Failed to retrieve persisted key "${key}":`, err);
    return undefined;
  }
}
