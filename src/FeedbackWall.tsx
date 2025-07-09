import React, { useEffect, useState } from 'react';
import NameModal from './NameModal';
import { useSharedState } from './Hooks/useSharedState';
import { generateUUID } from './utils';
import FeedbackInput from './FeedbackInput';
import './FeedbackWall.css';

type UserState = {
  id: string;
  name: string;
  isAnonymous: boolean;
  avatar: string;
};

type FeedbackMessage = {
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  avatar?: string;
};

const FeedbackWall: React.FC = () => {
  // ---
  // Use Overwatch TS to access and update the current user
  // This hook gives you [state, setState] for the global 'user' key
  const [user, setUser] = useSharedState<UserState>('user');

  // Use Overwatch TS to access and update the global feedback messages array
  const [feedbackMessages, setFeedbackMessages] = useSharedState<FeedbackMessage[]>('feedbackMessages');
  // ---

  // Local UI state for editing messages
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null); // To store userId + timestamp for unique message ID
  const [editValue, setEditValue] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  // On first mount, ensure the user has a unique ID (persisted)
  useEffect(() => {
    if (!user.id) {
      setUser({ ...user, id: generateUUID() });
    }
    // eslint-disable-next-line
  }, []);

  // Handle new message submission
  const handleSubmit = (message: string) => {
    // Generate a simple avatar initial if not anonymous, otherwise 'A'
    const avatarInitial = user.isAnonymous ? 'A' : user.name.charAt(0).toUpperCase();

    setFeedbackMessages([
      ...feedbackMessages,
      {
        userId: user.id,
        userName: user.isAnonymous ? 'Anonymous' : user.name,
        message,
        timestamp: Date.now(),
        avatar: avatarInitial, // Use the generated initial
      },
    ]);
  };

  // Handle editing a message (show textarea)
  const handleEdit = (msg: FeedbackMessage) => {
    setEditingMessageId(msg.userId + '-' + msg.timestamp);
    setEditValue(msg.message);
  };

  // Save the edited message
  const handleEditSave = (originalMsg: FeedbackMessage) => { 
    setFeedbackMessages(feedbackMessages.map((m: FeedbackMessage) => 
      // Match by userId and original timestamp to ensure correct message is updated
      (m.userId === originalMsg.userId && m.timestamp === originalMsg.timestamp)
        ? { ...m, message: editValue.trim(), timestamp: Date.now() }
        : m
    ));
    setEditingMessageId(null);
    setEditValue('');
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditingMessageId(null);
    setEditValue('');
  };

  // Delete a message (only your own)
  const handleDelete = (originalMsg: FeedbackMessage) => { 
    setFeedbackMessages(feedbackMessages.filter((m: FeedbackMessage) => 
      !(m.userId === originalMsg.userId && m.timestamp === originalMsg.timestamp)
    ));
  };

  // Show the name/anonymous modal if user hasn't set a name yet
  if (!user.name) {
    return (
      <NameModal
        onSubmit={({ name, isAnonymous }) => {
          // Check if name is already taken (case-insensitive, except for Anonymous)
          const nameTaken = feedbackMessages.some(
            (msg: FeedbackMessage) => 
              !isAnonymous && msg.userName.toLowerCase() === name.trim().toLowerCase() &&
              name.trim().toLowerCase() !== 'anonymous'
          );
          if (nameTaken) {
            setNameError('This name is already taken. Please choose a different one.');
            return;
          }
          // If name is 'Anonymous' but isAnonymous is false, handle as a normal user named Anonymous
          // This ensures that 'Anonymous' isn't treated specially if someone *chooses* that name
          const finalIsAnonymous = name.trim().toLowerCase() === 'anonymous' ? true : isAnonymous;

          setUser({
            ...user,
            name: name.trim(), // Use the trimmed name
            isAnonymous: finalIsAnonymous,
            id: user.id || generateUUID(),
            avatar: name.trim().charAt(0).toUpperCase() // Set initial avatar immediately
          });
          setNameError(null); // Clear error on successful submission
        }}
      />
    );
  }

  // Main UI: Input, and feedback wall
  return (
    <div className="feedback-container">
      <h2>Let's Contribute</h2>
      <p className="welcome-message">
        Welcome, <b>{user.isAnonymous ? 'Anonymous Contributor' : user.name}</b>! Share your thoughts and insights below.
      </p>

      {/* Display name error if any */}
      {nameError && (
        <div className="error-message" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          {nameError}
        </div>
      )}

      <FeedbackInput onSubmit={handleSubmit} />

      <div className="feedback-wall-section">
        <h3>Recent Contributions</h3>
        {feedbackMessages.length === 0 ? (
          <div style={{ color: 'var(--color-text-light)', textAlign: 'center', marginTop: '2rem' }}>
            No messages yet. Be the first to share your feedback!
          </div>
        ) : (
          <ul className="message-list">
            {feedbackMessages.slice().reverse().map((msg: FeedbackMessage) => { 
              const isOwner = msg.userId === user.id;
              const uniqueMessageId = msg.userId + '-' + msg.timestamp;

              return (
                <li key={uniqueMessageId} className="message-card">
                  <div className="message-header">
                    <div className="message-avatar">
                      {msg.avatar || (msg.userName ? msg.userName.charAt(0).toUpperCase() : 'A')}
                    </div>
                    <div className="message-info">
                      <span className="message-author">
                        {msg.userName || 'Anonymous'}
                      </span>
                      <span className="message-time">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}
                      </span>
                    </div>
                  </div>

                  {/* Message content: edit mode or display mode */}
                  {editingMessageId === uniqueMessageId ? (
                    <div>
                      <textarea
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        maxLength={280}
                        rows={3}
                        className="edit-textarea"
                      />
                      <div className="edit-actions">
                        <button
                          className="modern-button button-secondary"
                          onClick={handleEditCancel}
                        >
                          Cancel
                        </button>
                        <button
                          className="modern-button button-primary"
                          onClick={() => handleEditSave(msg)}
                          disabled={!editValue.trim() || editValue.length > 280}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="message-content">
                      {msg.message}
                    </div>
                  )}

                  {/* Edit/Delete only for your own message, and not in edit mode */}
                  {isOwner && editingMessageId !== uniqueMessageId && (
                    <div className="message-actions">
                      <button
                        className="action-button"
                        onClick={() => handleEdit(msg)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => handleDelete(msg)}
                      >
                        Delete
                      </button>
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
// See Starter-README.md for a full walkthrough of this example.
// ---

export default FeedbackWall;