# Overwatch — A Lightweight Yet Powerful State Manager

OverWatch is a modern, TypeScript-first implementation of the **Publisher-Subscriber pattern**. It's a super lightweight (unpacked : 30KB) yet expressive **state management library for React Js & Next Js**, built on the **singleton design pattern**. It offers support for **global and instance-specific middlewares**, **immutability**, **batched updates**, and **custom event communication** — all designed to be used without extensive boilerplate.

Goal with OverWatch was to prioritize reusability, a positive developer experience, and clear component-level state and event tracking.

---

## 🚀 What Is OverWatch?

> OverWatch evolved from an internal utility that leveraged the singleton and pub-sub patterns. We've now refined it for React, incorporating hooks, strong typing, and automatic cleanup to make it accessible to everyone.

OverWatch is:

* Built with **React hooks and TypeScript** (offering 100% type safety for predictable development).
* **Lightweight** — you won't find context providers, reducers, or dispatches here.
* Ideal for managing both **component-level and application-level shared state**, providing flexibility for various needs.

---
## Why This Exists: State management should be straightforward

If you've ever felt that Redux was too comprehensive for your needs, or that libraries like Zustand didn't offer enough specific control, OverWatch aims to provide a balanced approach. It combines a **minimal API** with **flexibility** to enhance your developer experience.

---

## Architecture: How It Works

At its core, OverWatch uses a **pub-sub pattern** to manage state effectively:

* Every **state key** functions as a communication **channel**.
* Components can **subscribe** to updates on these channels, acting as listeners.
* You can **publish changes** to state, either globally or specifically.
* **Middleware pipelines** run before changes are published, allowing for custom logic.
* **Batching** ensures that multiple updates are grouped efficiently, optimizing performance.
* **Immutability** is maintained, helping your state remain consistent and easy to reason about.

---

## How to Use: Getting Started

### Installation
To get started with OverWatch-TS, simply install it using npm or yarn:

```ts
# Using npm
npm install overwatch-ts

# Using yarn
yarn add overwatch-ts
```

### Step 1: `createSharedState(key, initialValue)`

This function initializes a shared state value globally. While **optional**, it's helpful for establishing a default state before any component mounts.

> If `createSharedState` isn't used, `useSharedState` will automatically create the key the first time it's accessed, providing a flexible starting point.

```ts
// Setting an initial theme
createSharedState('theme', { mode: 'dark' });
```

### Step 2: `useSharedState(key)`

> Use this hook in any component to **read** and **update** your shared state. It's your primary interface for interacting with OverWatch.

```ts
import { useSharedState } from '@your-library-name'; // Replace with your actual package name

const ThemeSwitcher = () => {
  const [theme, setTheme] = useSharedState<{ mode: string }>('theme');

  const toggleTheme = () => {
    setTheme({ mode: theme.mode === 'dark' ? 'light' : 'dark' });
  };

  return (
    <button onClick={toggleTheme}>
      Switch to {theme.mode === 'dark' ? 'Light' : 'Dark'} Mode
    </button>
  );
};
```

### Step 3: `usePicker(key, selectorFn)`

> This hook allows you to extract only a specific part of a shared state object, which can help optimize component rendering by preventing unnecessary re-renders.

```ts
import { usePicker } from 'overwatch-ts'; // Replace with your actual package name

const ThemeIndicator = () => {
  const mode = usePicker('theme', t => t.mode);

  return <div>{mode === 'dark' ? '🌑' : '☀️'}</div>;
};
```
**Why and when to use?**

* It helps prevent unnecessary re-renders, improving application performance.
* It's particularly useful for larger state objects where you only need to react to changes in one specific field.

### Step 4: `applyMiddleware(key, middlewareFn)`

> Use this to attach one or more **global middlewares** to a shared state key. These middlewares will apply to all updates for that specific state key.

```ts
import { applyMiddleware, createSharedState } from 'overwatch-ts'; // Replace with your actual package name

// A simple logger for all 'theme' state changes
const globalThemeLogger = (newValue, next) => {
  console.log('Global Theme Change:', newValue);
  next(newValue); // Remember to call 'next' to continue the update
};

createSharedState('theme', { mode: 'dark' });
applyMiddleware('theme', globalThemeLogger);
```
(*NOTE*: If both instance-specific and global middlewares are applied to the same state, instance-specific middlewares will run first.)

### Step 5: Instance-specific Middleware (Component Level)

> If you need middleware to apply only within a specific component, you can pass it directly when using `useSharedState`.

```ts
import { useSharedState } from 'overwatch-ts'; // Replace with your actual package name

const MyComponentWithLocalLogging = () => {
  const localLogger = (val, next) => {
    console.log('This runs only in this specific component:', val);
    next(val);
  };

  const [theme, setTheme] = useSharedState('theme', {
    middleware: [localLogger],
  });

  // ...rest of your component
};
```

---

## Component Communication: Beyond State Management

### Step 6: `useBroadcast` and `useEvent`

> These hooks are designed for one-time communications, such as triggering a logout action, showing a modal, or sending a specific notification across your application. While distinct from state management, they integrate seamlessly for a comprehensive communication solution.

**Broadcast an event:**

```ts
import { useBroadcast } from 'overwatch-ts'; // Replace with your actual package name

const LogoutButton = () => {
  const broadcast = useBroadcast();

  const handleLogout = () => {
    // Perform logout logic...
    broadcast('LOGOUT'); // Emit the 'LOGOUT' event
  };

  return <button onClick={handleLogout}>Logout</button>;
};
```

**Listen for an event:**

```ts
import { useEvent } from 'overwatch-ts'; // Replace with your actual package name
import { useNavigate } from 'react-router-dom'; // Example for React Router

const AuthListener = () => {
  const navigate = useNavigate();

  useEvent('LOGOUT', () => {
    console.log('Logout event received. Redirecting...');
    navigate('/login');
  });

  return null; // This component primarily serves as a listener
};
```

### What is Component Communication?

In many applications, especially those with deep component trees or when React Context feels too rigid, there's a need for **cross-component communication** that's both decoupled and clear. OverWatch's event system addresses this by:

* Offering a **central event bus** built on the pub-sub model.
* Leveraging **custom React hooks** for subscribing to and publishing events.
* **Automatically unsubscribing** events when components unmount, preventing memory leaks.
* Tracking **which component** subscribed to which event for better debugging.
* Being fully written in **TypeScript** and easily tree-shakable for efficient bundling.

---

## Ideal Use Cases: Where OverWatch Excels

* Decoupled communication between unrelated components.
* Managing temporary global states (e.g., flash messages, user actions).
* Providing an alternative to prop drilling or over-reliance on React Context.

---

## 📜 License

MIT — feel free to fork and adapt OverWatch for your projects.

---

**Built with purpose, and reusability in mind.**
