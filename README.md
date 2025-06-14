# OverWatch - A Lightweight yet Powerful State Manager

A modern, TypeScript-first implementation of the **Publisher-Subscriber pattern** . a lightweight yet expressive **state management library for React Js & Next Js**,powered with singleton design pattern with support for **global and instance-specific middlewares**, **immutability**, **batched updates**, and **custom event communication** — all without the boilerplate. 
Built with reusability, dev experience, and component-level state/event tracking in mind.

## 🚀 What Is OverWatch?

> An evolution of an internal utility that leverages the singleton + pubsub pattern, now tailored for React with hooks, types, and auto-cleanup.

OverWatch is:

- Built with **React hooks + TypeScript** (100% type safe)
- Lightweight — no context, no reducers, no dispatches
- Perfect for both **component-level and app-level shared state**

## Architecture

At its core, OverWatch uses a **pub-sub pattern**:

- Every **state key** acts like a **channel**
- Components can **subscribe** to updates (like listeners)
- You can **publish changes** globally or locally
- Middleware pipelines are run before publishing
- Batching ensures multiple updates are grouped efficiently
- Immutability ensures your state stays predictable

---

## Why This Exists 
If you’ve ever thought Redux was too much, or Zustand didn’t give you enough control — OverWatch gives you the best of both worlds: **minimal API**, **flexibility**, and **developer delight**.

## How to use

---

### Step 1: `createSharedState(key, initialValue)`

This initializes a shared state value globally. It’s **optional**, but useful for setting a default before any component mounts.

> If not used, `useSharedState` will create the key the first time it’s accessed.

```ts
createSharedState('theme', { mode: 'dark' });
```

### Step 2: `useSharedState(key)`

> Use this in any component to **read** and **update** the shared state.

```ts
const [theme, setTheme] = useSharedState<{ mode: string }>('theme');

const toggleTheme = () => {
  setTheme({ mode: theme.mode === 'dark' ? 'light' : 'dark' });
};
```
### Step 3: `usePicker(key, selectorFn)`

> Extract only a specific part of a shared state object to optimize rendering.

```ts
const mode = useSelector('theme', t => t.mode);

return <div>{mode === 'dark' ? '🌑' : '☀️'}</div>;
};
```
**Why and when to use?**

- Prevents unnecessary re-renders.
- Perfect for larger state objects where you only care about one field.

### Step 4: `applyMiddleware(key, middlewareFn)`

> Attach one or more **global middlewares** to a shared state key. (*NOTE* : Instance specific will run first and then Global if used both for same state)

```ts
const mode = useSelector('theme', t => t.mode);

return <div>{mode === 'dark' ? '🌑' : '☀️'}</div>;
};
```
### Step 5: `Instance-specific Middleware (Component Level)`

> Want middleware to only apply in a single place? Pass it when using useSharedState.

```ts
const localLogger = (val, next) => {
  console.log('This runs only in this component:', val);
  next(val);
};

const [theme, setTheme] = useSharedState('theme', {
  middleware: [localLogger],
});
```
## Component Communication

### Step 5: `useBroadcast and useEvent`

> Use this when you need one-time communication, like triggering logout, showing modals, etc. (*NOTE* : It's an additional powerful features combined with state management)

Broadcast an event:
```ts
const broadcast = useBroadcast();
broadcast('LOGOUT');
};
```
Listen for an event:
```ts
useEvent('LOGOUT', () => {
  navigate('/login');
});
```

### What is Component Communication

In many apps, especially where component trees are deep or context feels too rigid, there's a need for **cross-component communication** that’s decoupled and clean.
- Offers a **central event bus** using the pubsub model.
- Leverages **custom React hooks** to subscribe and publish events.
- **Automatically unsubscribes** on component unmount.
- Tracks **which component** subscribed to which event.
- Is fully written in **TypeScript** and is easily tree-shakable.

---
## Ideal Use Cases

- Decoupled communication between unrelated components
- Temporary global states (e.g., flash messages, user actions)
- Avoiding prop drilling or overusing React Context

## 📜 License

MIT — feel free to fork and adapt.

---

**Made with purpose, and reusability.**
