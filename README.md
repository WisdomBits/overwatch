# Overwatch TS Comic Guestbook / Feedback Wall

![Overwatch TS Comic Banner](https://github.com/WisdomBits/overwatch-Introduction/blob/main/src/assets/overwatchAvatar.png?raw=true)

---

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

## What is this project?

A **comic-style, public feedback wall** where users can leave a short message (like a digital guestbook). Each user can submit, edit, or delete one message. All messages are public and visible to everyone.

- 🦸‍♂️ **Comic UI**: Playful, bold, and fun!
- 📝 **One message per user**: Edit or delete your own.
- 🌍 **Public wall**: See everyone's feedback in real time.
- ⚡️ **Powered by [Overwatch TS](https://docs.overwatchts.in/docs)**: A modern, minimal, and powerful state management library for React/Next.js.

---

## Why Overwatch TS?

**Overwatch TS** is a TypeScript-first, minimal, and flexible state management solution for React and Next.js. It is:

- **Lightweight**: No providers, reducers, or boilerplate.
- **Singleton-based**: Global state is easy and fast.
- **Immutability & batching**: Safe and performant.
- **Event-driven**: Custom events and pub/sub built in.
- **Persistence**: Easily persist state to localStorage/sessionStorage.
- **Inspired by Zustand, but with more power and less fuss!**

**Why not Redux, Context, or Zustand?**

- No verbose setup or context trees.
- No need for reducers or actions.
- No prop drilling or context re-renders.
- Just simple, direct, and type-safe state.

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
- State is saved in localStorage, so it survives reloads.

### 4. **Pub/Sub and Events**

- Overwatch TS supports custom events and middleware (not shown in this demo, but easy to add!).

---

## Getting Started

1. **Clone the repo:**
   ```sh
   git clone <your-fork-url>
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
overwatch/
├── src/
│   ├── FeedbackWall.tsx      # Main wall UI & logic (annotated)
│   ├── FeedbackInput.tsx     # Input for new messages
│   ├── NameModal.tsx         # Modal for user name/anonymous
│   ├── core-utils/           # Overwatch TS core logic
│   ├── Hooks/                # Custom hooks for Overwatch TS
│   └── ...
├── public/
│   └── ...
├── package.json
└── README.md
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

### 5. **Comic UI & User Experience**

- Comic font, colors, and playful avatars.
- Each message is a speech bubble.
- Edit/Delete only for your own message.
- Modal for name/anonymous selection.

---

## How to Contribute

We welcome all contributors! 🚀

- **Fork this repo** and make your changes.
- **Add comments** and keep the code friendly for beginners.
- **Open a pull request** with a clear description.
- **Ask questions** or suggest improvements in Issues.

### Contribution Ideas

- Add more comic/gamified effects.
- Add Overwatch TS event/middleware examples.
- Add tests or more docs.
- Improve accessibility or mobile UI.

---

## FAQ

**Q: What is Overwatch TS?**
A: A minimal, TypeScript-first state management library for React/Next.js. See [docs](https://docs.overwatchts.in/docs).

**Q: How is state shared?**
A: State is global, singleton, and reactive. Any component can use it.

**Q: How is state persisted?**
A: Use the `persist` option in `createSharedState` to save to localStorage/sessionStorage.

**Q: Can I use events/middleware?**
A: Yes! See the [Overwatch TS docs](https://docs.overwatchts.in/docs) for advanced usage.

**Q: Where is the avatar from?**
A: [Overwatch Avatar PNG](https://github.com/WisdomBits/overwatch-Introduction/blob/main/src/assets/overwatchAvatar.png)

---

## Resources

- [Overwatch TS Docs](https://docs.overwatchts.in/docs)
- [Overwatch Avatar PNG](https://github.com/WisdomBits/overwatch-Introduction/blob/main/src/assets/overwatchAvatar.png)
- [Zustand (inspiration)](https://zustand-demo.pmnd.rs/)

---

## Screenshots / Demo

> _Add screenshots or a GIF here to show the comic UI and Overwatch TS in action!_

---

## License

MIT
