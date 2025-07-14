import React, { useState } from 'react';
// import './FeedbackWall.css'; // Assuming this is imported in the main App or FeedbackWall component

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
      setTouched(false); // Reset touched state after successful submission
    } else {
      setTouched(true);
    }
  };

  const charsLeft = MAX_LENGTH - message.length;
  const isInvalid = touched && (!message.trim() || message.length > MAX_LENGTH);

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={MAX_LENGTH} // Removed +1 as it's not strictly necessary for client-side length check if max is 280
        rows={4}
        placeholder="Share your insights or feedback (max 280 characters)"
        disabled={disabled}
        onBlur={() => setTouched(true)}
        className="modern-input-field"
      />
      <div className="form-controls">
        <span className={`char-counter ${charsLeft < 0 || (touched && !message.trim()) ? 'invalid' : ''}`}>
          {charsLeft} characters left
        </span>
        <button
          type="submit"
          className="modern-button button-primary"
          disabled={disabled || !message.trim() || message.length > MAX_LENGTH}
        >
          Submit Feedback
        </button>
      </div>
      {isInvalid && (
        <div className="error-message">
          Please ensure your message is not empty and within 280 characters.
        </div>
      )}
    </form>
  );
};

export default FeedbackInput;