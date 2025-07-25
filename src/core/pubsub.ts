import { enqueueUpdate } from "./stateUpdateBatching";

type EventCallback<T = any> = (data: T) => void;

interface Subscriber<T = any> {
  fn: EventCallback<T>;
  componentName?: string;
  timestamp?: number;
}


const pubsub = {
  events: {} as Record<string, Subscriber[]>,
  
  subscribe<T>(event: string, fn: EventCallback<T>, componentName: string = 'Anonymous') {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push({
      fn,
      componentName,
      timestamp: Date.now(),
    });
  },

  unsubscribe<T>(event: string, fn: EventCallback<T>) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((sub) => sub.fn !== fn);
    }
  },
  // Optimized: deduplicate by storing only latest value for each event.
  queuedPublishes: new Map<string, any>(),

  publish<T>(event: string, data: T) {
    this.queuedPublishes.set(event, data);

    enqueueUpdate(() => {
      const latestData = this.queuedPublishes.get(event);
      const isAvailable = this.queuedPublishes.delete(event);
      

      if (this.events[event] && isAvailable) {
        this.events[event].forEach(({ fn, componentName }) => {
          try {
            fn(latestData);
          } catch (err) {
            console.error(`[${componentName}] Error in "${event}" subscriber:`, err);
          }
        });
      }
    });
  },
};

export default pubsub;