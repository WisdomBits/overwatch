# Overwatch TS Template Project Walkthrough - Watchly Thoughts 🚀

Welcome to the Overwatch TS template project! This is a comprehensive example that demonstrates how to build a real-time feedback wall application using Overwatch TS - a lightweight, TypeScript-first state management library for React.

## Table of Contents

- [What is this project?](#what-is-this-project)
- [Why Overwatch TS?](#why-overwatch-ts)
- [How does it work?](#how-does-it-work)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Concepts & Code Walkthrough](#key-concepts--code-walkthrough)
- [How to Contribute](#how-to-contribute)
- [FAQ](#faq)
- [Resources](#resources)

---

## Learning Path

1. **Start with `FeedbackWall.tsx`** - See how state is used in a real component
2. **Explore `useSharedState.tsx`** - Understand the React hook implementation
3. **Check `sharedState.ts`** - Learn the core state management logic
4. **Review `pubsub.ts`** - Understand the communication system
5. **Experiment with the UI** - Try adding messages, editing, switching modes

---

## Why Overwatch TS?

**Overwatch TS** is a TypeScript-first, minimal, and flexible state management solution for React and Next.js. It is:

- **Lightweight**: No providers, reducers, or boilerplate.
- **Singleton-based**: Global state is easy and fast.
- **Immutability & batching**: Safe and performant.
- **Event-driven**: Custom events and pub/sub built in.
- **Persistence**: Easily persist state to localStorage/sessionStorage.
- **Inspired by Zustand, but with more power and less fuss!**

---

## How does it work?

### 1. **State is created and persisted globally**

```ts
// src/FeedbackWall.tsx
createSharedState(
  'user',
  { id: '', name: '', isAnonymous: false, avatar: '' },
  { persist: 'localStorage' }
);
createSharedState('feedbackMessages', [], { persist: 'localStorage' });
```

### 2. **Components use the state with hooks**

```ts
const [user, setUser] = useSharedState<{
  id: string;
  name: string;
  isAnonymous: boolean;
  avatar: string;
}>('user');
const [feedbackMessages, setFeedbackMessages] =
  useSharedState<FeedbackMessage[]>('feedbackMessages');
```

### 3. **State is shared, reactive, and persistent**

- Any component can read/write the state.
- Changes are instantly reflected everywhere.
- State is saved in localStorage, so it persists on reloads.

---

## Getting Started

1. **Clone the repo:**
   ```sh
   git clone https://github.com/WisdomBits/overwatch.git
   cd overwatch
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Run the app:**
   ```sh
   npm run dev
   ```
4. **Open in your browser:**
   [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
overwatch Ts/
├── src/
│   ├── core/                    # Core Overwatch TS implementation
│   │   ├── pubsub.ts           # Event publishing/subscribing system
│   │   └── stateUpdateBatching.ts # Batched state updates
│   ├── core-utils/             # Utility functions for state management
│   │   ├── sharedState.ts      # Main state creation and management
│   │   ├── createServerStore.ts # Server-side store implementation
│   │   ├── persistance.ts      # localStorage/sessionStorage handling
│   │   ├── Middleware.ts       # Middleware system for state validation
│   │   └── Hydrated.tsx        # SSR hydration component
│   ├── Hooks/                  # React hooks for Overwatch TS
│   │   ├── useSharedState.tsx  # Main hook for state access
│   │   ├── usePicker.tsx       # Selective state subscription
│   │   ├── useBroadcast.ts     # Event broadcasting
│   │   ├── useEvent.ts         # Event listening
│   │   └── useHydratedStore.ts # SSR store hydration
│   ├── App.tsx                 # Main application component
│   ├── FeedbackWall.tsx        # Main feedback wall interface
│   ├── FeedbackInput.tsx       # Message input component
│   ├── NameModal.tsx           # User authentication modal
│   └── utils.ts                # Utility functions
├── Plugins/                    # Rollup plugins
│   └── addDirectives.ts        # Adds "use client" directives
└── package.json               # Project dependencies
```
---

## Key Concepts & Code Walkthrough

### 1. **Global State Setup**

```ts
// FeedbackWall.tsx (top)
createSharedState(
  'user',
  { id: '', name: '', isAnonymous: false, avatar: '' },
  { persist: 'localStorage' }
);
createSharedState('feedbackMessages', [], { persist: 'localStorage' });
```

### 2. **Using State in Components**

```ts
const [user, setUser] = useSharedState<{
  id: string;
  name: string;
  isAnonymous: boolean;
  avatar: string;
}>('user');
const [feedbackMessages, setFeedbackMessages] =
  useSharedState<FeedbackMessage[]>('feedbackMessages');
```

*NOTE:* It is recommended by overwatch to use **usePicker**, if utilising to fetch states values only.

### 3. **Adding a Message**

```ts
const handleSubmit = (message: string) => {
  if (!userMessage) {
    setFeedbackMessages([
      ...feedbackMessages,
      {
        userId: user.id,
        userName: user.isAnonymous ? 'Anonymous' : user.name,
        message,
        timestamp: Date.now(),
        avatar: user.avatar,
      },
    ]);
  }
};
```

### 4. **Editing/Deleting a Message**

```ts
const handleEditSave = (msg: FeedbackMessage) => {
  setFeedbackMessages(
    feedbackMessages.map((m) =>
      m.userId === msg.userId
        ? { ...m, message: editValue, timestamp: Date.now() }
        : m
    )
  );
};
const handleDelete = (msg: FeedbackMessage) => {
  setFeedbackMessages(feedbackMessages.filter((m) => m.userId !== msg.userId));
};
```
---

## How to Contribute

We welcome all contributors! 🚀

- **Fork this repo** and make your changes.
- **Add comments** and keep the code friendly for beginners.
- **Open a pull request** with a clear description.
- **Ask questions** or suggest improvements in Issues.

### Contribution Ideas

- update UI.
- Add Overwatch TS event/middleware examples.
- Add tests or more docs.
- Improve accessibility or mobile UI.
---

## Resources

- [Overwatch TS Docs](https://docs.overwatchts.in/docs)

---
