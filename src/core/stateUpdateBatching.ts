
// Batching using Microtask Queue
// batch once per microtask cycle.
// accumulates updates that arrive synchronously in a single JS Excecution.

let updateQueue: (() => void)[] = [];
let scheduled = false;

export function enqueueUpdate(fn: () => void) {
  updateQueue.push(fn);

  if (!scheduled) {
    scheduled = true;

    Promise.resolve().then(() => {
      // console.log("functions excecuted form Batching",updateQueue)
      updateQueue.forEach(f => f());  // Run all queued updates
      updateQueue = [];               // Clear queue
      scheduled = false;              // Ready for next batch
    });
  }
}