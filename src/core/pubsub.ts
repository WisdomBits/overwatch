/* eslint-disable @typescript-eslint/no-explicit-any */
import { enqueueUpdate } from "./stateUpdateBatching";

type EventCallback<T = any> = (data: T) => void;

type Selector<T, S> = (state: T) => S;
type EqualityFn<S> = (a: S, b: S) => boolean;


interface Subscriber<T, S = any> {
  selector: Selector<T, S>;
  equalityFn: EqualityFn<S>;
  fn: EventCallback<S>;
  lastSelected: S;
  componentName?: string;
  timestamp?: number;
}


const pubsub = {
  events: {} as Record<string, Subscriber<any, any>[]>,
  
  subscribe<T, S>(
    event: string,
    fn: EventCallback<S>,
    equalityFn?: EqualityFn<S>,
    initialState?: T,
    selector?: Selector<T, S>,
    componentName: string = 'Anonymous',
  ) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    if(!selector) {
       // Render mode for useSharedState
      this.events[event].push({
      fn,
      componentName,
      selector: (state: any) => state,
      equalityFn: () => false, // Forcing Publish by default 
      lastSelected: undefined,
    })
    return
    }
    // Selector mode for usePicker
    if(!equalityFn) {
      equalityFn = (a, b) => a === b
    }
    if(!initialState) return // to manage typescript optional check
    const selected = selector(initialState);
    this.events[event].push({
      selector,
      equalityFn,
      fn,
      lastSelected: selected,
      componentName,
      timestamp: Date.now(),
    });
  },

  unsubscribe<T>(event: string, fn: EventCallback<T>) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(sub => sub.fn !== fn);
    }
  },

  publish<T>(event: string, data: T) {
    if (this.events[event]) {
      this.events[event].forEach(({ selector, equalityFn, fn, componentName, lastSelected }, index, array) => {
        try {
          const nextSelected = selector(data);
          if (!equalityFn(lastSelected, nextSelected)) { // *Optimization - early bailout : Subscribers should only be notified when their selected slice changes.
            // Better suited for large-scale apps and frequent state changes while keeping renders minimal.
            // if state slice never changes, even if pubsub triggers, do not re-render.
            array[index].lastSelected = nextSelected; 
            enqueueUpdate(() => fn(data))
          }
        } catch (err) {
          console.error(`[${componentName}] Error in "${event}" subscriber:`, err);
        }
      });
    }
  }
};


export default pubsub;