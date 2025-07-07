import React, { useEffect, useState } from 'react';
import NameModal from './NameModal';
import { useSharedState } from './Hooks/useSharedState';
import { generateUUID } from './utils';
import FeedbackInput from './FeedbackInput';
import './FeedbackWall.css';
import { createSharedState } from './core-utils/sharedState';

// ---
// Overwatch TS: Set up global, persistent state for user and feedback messages
// This makes state available everywhere, and persists it in localStorage
createSharedState('user', { id: '', name: '', isAnonymous: false, avatar: '' }, { persist: 'localStorage' });
createSharedState('feedbackMessages', [], { persist: 'localStorage' });
// ---

const FeedbackWall: React.FC = () => {
  // ---
  // Use Overwatch TS to access and update the current user
  // This hook gives you [state, setState] for the global 'user' key
  const [user, setUser] = useSharedState<{ id: string; name: string; isAnonymous: boolean; avatar: string }>('user');

  // Use Overwatch TS to access and update the global feedback messages array
  const [feedbackMessages, setFeedbackMessages] = useSharedState<Array<{
    userId: string;
    userName: string;
    message: string;
    timestamp: number;
    avatar?: string;
  }>>('feedbackMessages');
  // ---

  // Local UI state for editing messages
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  // On first mount, ensure the user has a unique ID (persisted)
  useEffect(() => {
    if (!user.id) {
      setUser({ ...user, id: generateUUID() });
    }
    // eslint-disable-next-line
  }, []);

  // Find the current user's message (if any)
  const userMessage = feedbackMessages.find((msg: any) => msg.userId === user.id);

  // ---
  // Handle new message submission
  // Remove the restriction: allow multiple messages per user
  const handleSubmit = (message: string) => {
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
  };

  // ---
  // Handle editing a message (show textarea)
  const handleEdit = (msg: any) => {
    setEditingId(msg.userId);
    setEditValue(msg.message);
  };

  // Save the edited message
  const handleEditSave = (msg: any) => {
    setFeedbackMessages(feedbackMessages.map((m: any) =>
      m.userId === msg.userId ? { ...m, message: editValue, timestamp: Date.now() } : m
    ));
    setEditingId(null);
    setEditValue('');
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  // Delete a message (only your own)
  const handleDelete = (msg: any) => {
    setFeedbackMessages(feedbackMessages.filter((m: any) => m.userId !== msg.userId));
  };

  // ---
  // Show the name/anonymous modal if user hasn't set a name yet
  if (!user.name) {
    return (
      <NameModal
        onSubmit={({ name, isAnonymous }) => {
          // Check if name is already taken (case-insensitive, except for Anonymous)
          const nameTaken = feedbackMessages.some(
            (msg: any) =>
              msg.userName.toLowerCase() === name.trim().toLowerCase() &&
              name.trim().toLowerCase() !== 'anonymous'
          );
          if (nameTaken) {
            setNameError('This name is already taken. Please choose a different one.');
            return;
          }
          setUser({
            ...user,
            name,
            isAnonymous,
            id: user.id || generateUUID(),
          });
          setNameError(null);
        }}
      />
    );
  }

  // ---
  // Main UI: Comic banner, input, and feedback wall
  return (
    <div className="comic-wall">
      {/* Comic-style banner */}
      <div className="comic-banner">
        <span role="img" aria-label="hero" className="comic-hero">🦸‍♂️</span>
        <span className="comic-banner-text">Welcome to the Overwatch TS Guestbook!</span>
        <span className="comic-bubble-pointer"></span>
      </div>
      <h2>🦸‍♂️ Feedback Wall</h2>
      <p className="comic-welcome">
        Welcome, <b>{user.isAnonymous ? 'Anonymous' : user.name}</b>! Leave your mark below 💬
      </p>
      <FeedbackInput onSubmit={handleSubmit} />
      {/* Public wall: all messages, comic bubbles */}
      <div style={{ marginTop: 40, textAlign: 'left', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 8, marginBottom: 16 }}>Public Wall</h3>
        {feedbackMessages.length === 0 ? (
          <div style={{ color: '#aaa', textAlign: 'center' }}>No messages yet. Be the first to leave feedback!</div>
        ) : (
          <ul className="comic-bubble-list">
            {feedbackMessages.slice().reverse().map((msg: any, idx: number) => {
              const isOwner = msg.userId === user.id;
              return (
                <li key={msg.userId + '-' + msg.timestamp + '-' + idx} className="comic-bubble">
                  {/* Author and time */}
                  <div className="comic-author">
                    {msg.userName || 'Anonymous'}
                    <span className="comic-time">
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}
                    </span>
                  </div>
                  {/* Avatar (emoji or custom) */}
                  <div className="comic-avatar">{msg.avatar || '🦸‍♂️'}</div>
                  {/* Message bubble: edit mode or display mode */}
                  {editingId === msg.userId && editingId + msg.timestamp === msg.userId + msg.timestamp ? (
                    <div>
                      <textarea
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        maxLength={280}
                        rows={3}
                      />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="comic-edit-save"
                          onClick={() => handleEditSave(msg)}
                          disabled={!editValue.trim() || editValue.length > 280}
                        >Save</button>
                        <button
                          className="comic-edit-cancel"
                          onClick={handleEditCancel}
                        >Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="comic-message">
                      {/* Emoji-friendly rendering */}
                      {msg.message.split(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu).map((part: string, i: number) =>
                        /\p{Emoji_Presentation}|\p{Extended_Pictographic}/u.test(part)
                          ? <span key={i} className="comic-emoji">{part}</span>
                          : part
                      )}
                    </div>
                  )}
                  {/* Edit/Delete only for your own message */}
                  {isOwner && editingId !== msg.userId && (
                    <div className="comic-actions">
                      <button
                        className="comic-edit"
                        onClick={() => handleEdit(msg)}
                      >Edit</button>
                      <button
                        className="comic-delete"
                        onClick={() => handleDelete(msg)}
                      >Delete</button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

// ---
// This file is heavily commented for new contributors!
// See README.md for a full walkthrough and more examples.
// ---

export default FeedbackWall; 