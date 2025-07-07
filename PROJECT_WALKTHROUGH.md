# Project Walkthrough: Overwatch TS Comic Guestbook / Feedback Wall

## Overview

This project is a playful, comic-style public feedback wall built with React and **Overwatch TS** for state management. It demonstrates how to use Overwatch TS for global, persistent, and reactive state in a real-world, user-friendly app.

---

## Goals

- Let users leave a single public message (like a digital guestbook)
- Each user can edit or delete their own message
- All messages are public and update in real time
- Comic-style, engaging UI
- Serve as a learning resource for Overwatch TS

---

## How Overwatch TS is Used

### 1. **Global State Setup**

At the top of `FeedbackWall.tsx`, we create two global, persistent state keys:

```ts
createSharedState(
  'user',
  { id: '', name: '', isAnonymous: false, avatar: '' },
  { persist: 'localStorage' }
);
createSharedState('feedbackMessages', [], { persist: 'localStorage' });
```

- `user`: Stores the current user's info (id, name, anonymous flag, avatar)
- `feedbackMessages`: Stores all feedback messages

### 2. **Using State in Components**

```ts
import { useSharedState } from 'overwatch-ts';

const [user, setUser] = useSharedState<{
  id: string;
  name: string;
  isAnonymous: boolean;
  avatar: string;
}>('user');
const [feedbackMessages, setFeedbackMessages] =
  useSharedState<FeedbackMessage[]>('feedbackMessages');
```

- Any component can read/write this state
- State is reactive and persistent (localStorage)

### 3. **Adding, Editing, Deleting Messages**

- Users can submit one message, which is linked to their user id
- Only the author can edit or delete their message
- All changes are instantly reflected for everyone

---

## UI/UX Walkthrough

- **Comic Banner**: Bold, playful header with emoji
- **Name Modal**: On first visit, users enter a name or continue as Anonymous
- **Feedback Input**: Users submit a message (max 280 chars)
- **Message Bubbles**: Each message is a comic-style bubble with avatar, name, timestamp, and text
- **Edit/Delete**: Only visible for your own message
- **Persistence**: State survives reloads (localStorage)

---

## State Management Details

- **Global, singleton state**: No context providers or prop drilling
- **Persistence**: `persist: 'localStorage'` keeps state across reloads
- **Reactivity**: All components using the state update instantly
- **Type safety**: All state is strongly typed with TypeScript

---

## How to Run and Explore

1. Clone the repo
2. `npm install`
3. `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173)
5. Try leaving a message, editing, deleting, and reloading the page

---

## Tips for Contributors

- Read the comments in `FeedbackWall.tsx` for a guided code tour
- See [Overwatch TS Docs](https://docs.overwatchts.in/docs) for advanced usage (events, middleware, SSR)
- Try adding new features (badges, events, more comic effects!)
- Keep code and comments friendly for beginners

---

## Resources

- [Overwatch TS Docs](https://docs.overwatchts.in/docs)
- [Overwatch Avatar PNG](https://github.com/WisdomBits/overwatch-Introduction/blob/main/src/assets/overwatchAvatar.png)

---

## Screenshots / Demo

> _Add screenshots or a GIF here to show the comic UI and Overwatch TS in action!_
