import React, { useState } from 'react';

type FeedbackInputProps = {
  onSubmit: (message: string) => void;
  disabled?: boolean;
};

const MAX_LENGTH = 280;

const FeedbackInput: React.FC<FeedbackInputProps> = ({ onSubmit, disabled }) => {
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && message.length <= MAX_LENGTH) {
      onSubmit(message.trim());
      setMessage('');
    } else {
      setTouched(true);
    }
  };

  const charsLeft = MAX_LENGTH - message.length;
  const isInvalid = touched && (!message.trim() || message.length > MAX_LENGTH);

  return (
    <form onSubmit={handleSubmit} style={{ margin: '1.5rem 0' }}>
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        maxLength={MAX_LENGTH + 1}
        rows={4}
        placeholder="Leave your feedback (max 280 characters)"
        style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: isInvalid ? '2px solid #e74c3c' : '1px solid #ccc', resize: 'vertical', fontSize: 16 }}
        disabled={disabled}
        onBlur={() => setTouched(true)}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <span style={{ color: charsLeft < 0 ? '#e74c3c' : '#888', fontSize: 13 }}>{charsLeft} characters left</span>
        <button
          type="submit"
          disabled={disabled || !message.trim() || message.length > MAX_LENGTH}
          style={{ padding: '0.5rem 1.5rem', borderRadius: 6, border: 'none', background: '#222', color: '#fff', fontWeight: 600, opacity: disabled ? 0.5 : 1 }}
        >Submit</button>
      </div>
      {isInvalid && (
        <div style={{ color: '#e74c3c', marginTop: 4, fontSize: 13 }}>
          Please enter a message (max 280 characters).
        </div>
      )}
    </form>
  );
};

export default FeedbackInput; 