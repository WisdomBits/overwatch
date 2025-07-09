# Overwatch TS Template Project Walkthrough 🚀

Welcome to the Overwatch TS template project! This is a comprehensive example that demonstrates how to build a real-time feedback wall application using Overwatch TS - a lightweight, TypeScript-first state management library for React.

## 🖼️ Example Output Screenshots

### Modern Neon UI (Gaming Theme)

![Modern Neon UI - Anonymous Mode Video](Demo-show/demo-video.mov)

![Modern Neon UI - Anonymous Mode](Demo-show/game-page1.png)
_Anonymous mode with avatar, message input, and community feed._

![Modern Neon UI - Community Feed](Demo-show/game-page2.png)
_Community feed showing multiple messages, avatars, and real-time updates._

### Classic Comic UI (Yellow Theme)

![Classic Comic UI](Demo-show/classic-page.png)
_Classic comic-style guestbook with feedback wall and public wall._

---

## 🎯 What You'll Learn

This template shows you how to:

- Set up global shared state with persistence
- Create real-time updates across components
- Implement middleware for state validation
- Handle user authentication and anonymous mode
- Build a complete CRUD interface for messages
- Use Overwatch TS with React hooks effectively

## 📁 Project Structure

```
overwatch2/
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
├── Plugins/                    # Build plugins
│   └── addDirectives.ts        # Adds "use client" directives
└── package.json               # Project dependencies
```

## 🔧 Core Overwatch TS Implementation

### 1. Shared State Management (`src/core-utils/sharedState.ts`)

This is the heart of Overwatch TS. It provides the core functions for creating and managing shared state:

```typescript
// Create a shared state with optional persistence
createSharedState(
  'user',
  { id: '', name: '', isAnonymous: false, avatar: '' },
  { persist: 'localStorage' }
);

// Update shared state with immutability
setSharedState('user', newUserData);

// Get current state value
getSharedState('user');
```

**Key Features:**

- **Immutability**: Uses Immer for immutable updates
- **Persistence**: Automatic localStorage/sessionStorage support
- **Middleware Support**: Runs validation before state updates
- **Pub/Sub**: Automatically notifies all subscribers

### 2. Pub/Sub System (`src/core/pubsub.ts`)

The communication backbone that enables real-time updates:

```typescript
// Subscribe to state changes
pubsub.subscribe('user', (newUser) => {
  console.log('User updated:', newUser);
});

// Publish state changes (automatically called by setSharedState)
pubsub.publish('user', newUserData);
```

**How it works:**

- Each state key acts as an event channel
- Components subscribe to specific keys
- Updates are batched for performance
- Automatic cleanup on component unmount

### 3. React Hook (`src/Hooks/useSharedState.tsx`)

The React integration that makes Overwatch TS easy to use:

```typescript
const [user, setUser] = useSharedState<{ id: string; name: string }>('user');

// Update state
setUser({ ...user, name: 'New Name' });

// State automatically updates in all components using this key
```

**Features:**

- **TypeScript Support**: Full type safety
- **Automatic Subscription**: Components automatically subscribe/unsubscribe
- **Middleware Support**: Component-level middleware
- **Performance Optimized**: Only re-renders when subscribed state changes

## 🎮 Application Walkthrough

### 1. State Initialization (`src/FeedbackWall.tsx`)

```typescript
// Initialize global state with persistence
createSharedState(
  'user',
  { id: '', name: '', isAnonymous: false, avatar: '' },
  { persist: 'localStorage' }
);
createSharedState('feedbackMessages', [], { persist: 'localStorage' });
```

**What this does:**

- Creates two global state stores
- `user`: Stores current user information
- `feedbackMessages`: Stores all feedback messages
- Both persist to localStorage automatically

### 2. Component State Access

```typescript
const FeedbackWall: React.FC = () => {
  // Access user state
  const [user, setUser] = useSharedState<{ id: string; name: string; isAnonymous: boolean; avatar: string }>("user")

  // Access messages state
  const [feedbackMessages, setFeedbackMessages] = useSharedState<Array<{...}>>("feedbackMessages")

  // Local UI state (not shared)
  const [editingId, setEditingId] = useState<string | null>(null)
}
```

**Key Points:**

- `useSharedState` returns `[state, setState]` like React's `useState`
- Changes to shared state automatically update all components
- Local state remains component-specific

### 3. Real-time Message Updates

```typescript
const handleSubmit = (message: string) => {
  setFeedbackMessages([
    ...feedbackMessages,
    {
      userId: user.id,
      userName: user.isAnonymous ? 'Anonymous' : user.name,
      message,
      timestamp: Date.now(),
      avatar: user.avatar || getRandomAvatar(),
    },
  ]);
};
```

**What happens:**

1. New message is added to the array
2. `setFeedbackMessages` updates the shared state
3. All components subscribed to "feedbackMessages" automatically re-render
4. Message appears in real-time across all open browser tabs/windows

### 4. User Authentication Flow

```typescript
if (!user.name) {
  return (
    <NameModal
      onSubmit={({ name, isAnonymous }) => {
        // Check for duplicate names
        const nameTaken = feedbackMessages.some(
          (msg: any) => msg.userName.toLowerCase() === name.trim().toLowerCase()
        );

        if (nameTaken) {
          setNameError('Username already taken!');
          return;
        }

        // Update user state
        setUser({
          ...user,
          name,
          isAnonymous,
          id: user.id || generateUUID(),
          avatar: getRandomAvatar(),
        });
      }}
      error={nameError}
    />
  );
}
```

**Authentication Features:**

- Modal appears until user provides a name
- Duplicate name validation
- Anonymous mode support
- Automatic avatar assignment
- Persistent user session

### 5. Message Editing and Deletion

```typescript
// Edit message
const handleEdit = (msg: any) => {
  setEditingId(msg.userId + '-' + msg.timestamp);
  setEditValue(msg.message);
};

// Save edited message
const handleEditSave = (msg: any) => {
  setFeedbackMessages(
    feedbackMessages.map((m: any) =>
      m.userId === msg.userId && m.timestamp === msg.timestamp
        ? { ...m, message: editValue, timestamp: Date.now() }
        : m
    )
  );
};

// Delete message
const handleDelete = (msg: any) => {
  setFeedbackMessages(
    feedbackMessages.filter(
      (m: any) => !(m.userId === msg.userId && m.timestamp === msg.timestamp)
    )
  );
};
```

**CRUD Operations:**

- **Create**: Add new messages to the array
- **Read**: Display messages from shared state
- **Update**: Map over array to update specific message
- **Delete**: Filter out specific message
- All operations are real-time across components

## 🔄 Real-time Features

### 1. Cross-Tab Synchronization

Since state is stored in localStorage, changes are automatically synchronized across browser tabs:

```typescript
// This happens automatically when you use persistence
createSharedState('feedbackMessages', [], { persist: 'localStorage' });
```

### 2. Anonymous Mode Toggle

```typescript
const handleAnonymousToggle = () => {
  setUser({
    ...user,
    isAnonymous: !user.isAnonymous,
  });
};
```

**What happens:**

- User can switch between named and anonymous mode
- All future messages use the new mode
- Existing messages remain unchanged
- State persists across sessions

### 3. Live Message Effects

```typescript
<div className="message-effects">
  {msg.message.length > 200 && <span className="effect-badge epic">EPIC</span>}
  {msg.message.includes('!') && (
    <span className="effect-badge excited">HYPED</span>
  )}
  {/[😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪]/gu.test(
    msg.message
  ) && <span className="effect-badge fun">FUN</span>}
</div>
```

**Dynamic Features:**

- Messages over 200 characters get "EPIC" badge
- Messages with exclamation marks get "HYPED" badge
- Messages with emojis get "FUN" badge
- All effects update in real-time

## 🎨 UI Components

### 1. Gaming-Themed Design

The app uses a gaming-inspired UI with:

- **Comic-style bubbles** for messages
- **Gaming controller icons** and emojis
- **Progress bars** for character limits
- **Animated effects** for user interactions

### 2. Responsive Layout

```typescript
// Player info panel shows current user
<div className="player-panel">
  <div className="player-avatar">
    <span className="avatar-emoji">{user.avatar || '🎮'}</span>
  </div>
  <div className="player-info">
    <div className="player-name">
      {user.isAnonymous ? 'Anonymous Player' : user.name}
    </div>
  </div>
</div>
```

### 3. Interactive Elements

- **Character counter** with visual progress bar
- **Edit/Delete buttons** for message owners
- **Anonymous toggle** in header stats
- **Real-time message effects**

## 🚀 Key Overwatch TS Concepts Demonstrated

### 1. **Global State Management**

```typescript
// Single source of truth for all data
createSharedState('user', initialUser);
createSharedState('feedbackMessages', []);
```

### 2. **Component Communication**

```typescript
// Any component can access and modify state
const [user, setUser] = useSharedState('user');
const [messages, setMessages] = useSharedState('feedbackMessages');
```

### 3. **Persistence**

```typescript
// Automatic localStorage persistence
createSharedState('user', userData, { persist: 'localStorage' });
```

### 4. **Real-time Updates**

```typescript
// Changes automatically propagate to all components
setMessages([...messages, newMessage]);
```

### 5. **Type Safety**

```typescript
// Full TypeScript support
const [user, setUser] = useSharedState<{ id: string; name: string }>('user');
```

## 🛠️ Development Features

### 1. **Hot Reloading**

- Changes to state management code hot reload
- UI updates immediately without page refresh

### 2. **TypeScript Integration**

- Full type safety for all state operations
- IntelliSense support in your IDE

### 3. **Debugging**

- Console logs show state changes
- React DevTools integration
- localStorage inspection for persisted data

## 🎯 Learning Path

1. **Start with `FeedbackWall.tsx`** - See how state is used in a real component
2. **Explore `useSharedState.tsx`** - Understand the React hook implementation
3. **Check `sharedState.ts`** - Learn the core state management logic
4. **Review `pubsub.ts`** - Understand the communication system
5. **Experiment with the UI** - Try adding messages, editing, switching modes

## 🔧 Customization Ideas

Try these modifications to learn more:

1. **Add new state keys** for features like themes or settings
2. **Implement middleware** for message validation
3. **Add more persistence options** like sessionStorage
4. **Create new UI components** that use shared state
5. **Add real-time collaboration features** like typing indicators

## 📚 Next Steps

After understanding this template:

1. **Read the official docs**: [overwatchts.in/docs](https://overwatchts.in/docs)
2. **Try the examples**: Explore the GitHub repository
3. **Build your own app**: Use this template as a starting point
4. **Join the community**: Check out discussions and issues

---

**Happy coding with Overwatch TS! 🚀**

This template demonstrates the power and simplicity of Overwatch TS for building real-time, stateful React applications. The combination of global state management, persistence, and real-time updates makes it perfect for modern web applications.
