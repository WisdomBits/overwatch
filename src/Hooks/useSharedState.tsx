import { useEffect, useState } from 'react';
import pubsub from '../core/pubsub';
import { runMiddlewareChain } from '../core-utils/Middleware';
import { getSharedState, setSharedState } from '../core-utils/sharedState';

type Middleware<T> = (value: T, next: (v: T) => void) => void;
interface Options<T> {
  middleware?: Middleware<T>[];
}
export function useSharedState<T>(key: string, options?: Options<T>): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => getSharedState<T>(key));

  useEffect(() => {
    const update = (newValue: T) => {
      setValue(newValue);
    };

    pubsub.subscribe<T>(key, update);

    return () => {
      pubsub.unsubscribe<T>(key, update);
    };
  }, [key]);

 const setter = (newValue: T) => {
    const middleware = options?.middleware;
    if (middleware?.length) {
      runMiddlewareChain(middleware, newValue, (processedValue) => { // first will run encapsulated middlewares then global
        setSharedState<T>(key, processedValue);
      });
    } else {
      setSharedState<T>(key, newValue);
    }
  };

  return [value, setter];
}
