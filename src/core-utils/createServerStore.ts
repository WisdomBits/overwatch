
export interface ServerStore {
    get: <T>(key: string) => T;
    set: <T>(key: string, value: T) => void;
    getSnapshot: () => Record<string, any>;
    hydrate: (snapshot: Record<string, any>) => void;
  }
  
  export function createServerStore(): ServerStore {
    const stateStore = new Map<string, any>();
  
    return {
      get: <T>(key: string): T => {
        if (!stateStore.has(key)) throw new Error(`Missing key: ${key}`);
        return stateStore.get(key);
      },
      set: <T>(key: string, value: T): void => {
        stateStore.set(key, value);
      },
      getSnapshot: (): Record<string, any> => {
        return Object.fromEntries(stateStore.entries()); // easy serialization (for SSR hydration)
        // * WHY (to recall)? - React expects state passed to client as plain objects, especially during hydration.
      },
      hydrate: (snapshot: Record<string, any>): void => {
        Object.entries(snapshot).forEach(([key, value]) => {
          stateStore.set(key, value);
        });
      },
    };
  }
  
  // Default global store for client usage
  export const globalStore = createServerStore();