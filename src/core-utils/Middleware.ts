type Middleware<T> = (value: T, next: (v: T) => void) => void;

const middlewares: Record<string, Middleware<any>[]> = {};

function applyMiddleware<T>(key: string, middleware: Middleware<T>) {
  if (!middlewares[key]) {
    middlewares[key] = [];
  }
  middlewares[key].push(middleware);
}

function runMiddlewares<T>(key: string, value: T, onComplete: (v: T) => void) {
  const chain = middlewares[key] || [];
  let index = 0;

  const next = (val: T) => {
    const mw = chain[index++];
    if (mw) {
      mw(val, next);
    } else {
      onComplete(val); // done, return state
    }
  };

  next(value);
}

function runMiddlewareChain<T>(
  middleware: Middleware<T>[],
  value: T,
  onComplete: (val: T) => void
) {
  let index = 0;
  const next = (v: T) => {
    const mw = middleware[index++];
    if (mw) {
      mw(v, next);
    } else {
      onComplete(v);
    }
  };
  next(value);
}

export {applyMiddleware,runMiddlewares ,runMiddlewareChain}