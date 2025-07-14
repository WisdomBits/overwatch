"use client";

import { ReactNode } from "react";
import { useHydratedStore } from "../Hooks/useHydratedStore";

interface HydratedProps {
  snapshot: Record<string, any>;
  children: ReactNode;
}

/**
 * Hydrated
 * Prevents rendering until the store is fully hydrated on the client.
 *
 * @param snapshot - The state snapshot from the server
 * @param children - Components to render after hydration
 */
export function Hydrated({ snapshot, children }: HydratedProps) {
  const hydrated = useHydratedStore(snapshot);

  if (!hydrated) return null;

  return <>{children}</>;
}