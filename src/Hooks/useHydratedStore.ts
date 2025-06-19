import { useEffect, useState } from 'react';
import { globalStore, ServerStore } from '../core-utils/createServerStore';
export function useHydratedStore(snapshot: Record<string, any>, store: ServerStore = globalStore) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      store.hydrate(snapshot);
      setHydrated(true);
    }
  }, [snapshot, hydrated, store]);

  return hydrated;
}