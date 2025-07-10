'use client';

import { useEffect, useRef } from 'react';
import { createSharedState } from '../core-utils/sharedState';
import { useSharedState } from '../Hooks/useSharedState';

// Create named shared state
createSharedState('countState', 0);

export default function OverwatchBenchmark() {
    const intervalRef = useRef<NodeJ.Timeout | null>(null);
  const [count ,setCountState] = useSharedState<number>('countState');

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCountState((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Overwatch TS Benchmark Playground</h1>
      <p className="mb-2">Open your console to view performance logs and use React DevTools to observe re-renders.</p>
        <div className="grid grid-cols-4 gap-1 overflow-auto max-h-[80vh] border p-2">
            {count}
        </div>
    </div>
  );
}
