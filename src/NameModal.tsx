import React, { useState } from 'react';
// import './FeedbackWall.css'; // Assuming this is imported in the main App or FeedbackWall component

type NameModalProps = {
  onSubmit: (user: { name: string; isAnonymous: boolean }) => void;
  // nameError is currently handled in FeedbackWall, but we can pass it down if needed for direct display here.
  // For now, let's assume validation feedback is external or we re-integrate it.
};

const NameModal: React.FC<NameModalProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleContinue = () => {
    onSubmit({ name: name.trim(), isAnonymous: false });
  };

  const handleAnonymous = () => {
    onSubmit({ name: 'Anonymous', isAnonymous: true });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome to the Feedback Portal</h2>
        <p>Please enter your name to contribute, or proceed anonymously.</p>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="modal-input"
        />
        <div className="modal-buttons">
          <button
            className="modern-button button-primary"
            disabled={!name.trim()}
            onClick={handleContinue}
          >
            Continue
          </button>
          <button
            className="modern-button button-secondary"
            onClick={handleAnonymous}
          >
            Go Anonymous
          </button>
        </div>
      </div>
    </div>
  );
};

export default NameModal;