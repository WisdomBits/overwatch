import React, { useState } from 'react';

type NameModalProps = {
  onSubmit: (user: { name: string; isAnonymous: boolean }) => void;
};

const NameModal: React.FC<NameModalProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', minWidth: 320, textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
        <h2>Welcome!</h2>
        <p>Enter your name to leave feedback, or continue as Anonymous.</p>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ padding: '0.5rem', width: '80%', marginBottom: '1rem', borderRadius: 6, border: '1px solid #ccc' }}
        />
        <div style={{ marginTop: 16 }}>
          <button
            style={{ marginRight: 8, padding: '0.5rem 1.5rem', borderRadius: 6, border: 'none', background: '#222', color: '#fff', fontWeight: 600 }}
            disabled={!name.trim()}
            onClick={() => onSubmit({ name: name.trim(), isAnonymous: false })}
          >Continue</button>
          <button
            style={{ padding: '0.5rem 1.5rem', borderRadius: 6, border: 'none', background: '#bbb', color: '#222', fontWeight: 600 }}
            onClick={() => onSubmit({ name: 'Anonymous', isAnonymous: true })}
          >Anonymous</button>
        </div>
      </div>
    </div>
  );
};

export default NameModal; 