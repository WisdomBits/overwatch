"use client"
import { useEffect, useRef } from 'react';
import pubsub from '../core/pubsub';

type EventCallback<T = any> = (data: T) => void;

export function useEvent<T>(
  eventName: string,
  callback: EventCallback<T>,
  componentId: string = 'AnonymousComponent'
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const handler = (data: T) => {
      try {
        callbackRef.current(data);
      } catch (err) {
        console.error(`[${componentId}] Failed to handle "${eventName}"`, err);
      }
    };

    pubsub.subscribe(eventName, handler, componentId);

    return () => {
      pubsub.unsubscribe(eventName, handler);
      if (import.meta.env.MODE === 'development') {
        console.log(`[${componentId}] Unsubscribed from "${eventName}"`);
      }
    };
  }, [eventName, componentId]);
}
