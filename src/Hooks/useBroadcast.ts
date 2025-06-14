import pubsub from '../core/pubsub';

export function useBroadcast<T>(eventName: string) {
  return (data: T) => {
    pubsub.publish<T>(eventName, data);
  };
}