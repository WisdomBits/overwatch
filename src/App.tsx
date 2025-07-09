import React from 'react';
import FeedbackWall from './FeedbackWall';
import './FeedbackWall.css'; // Ensure the main CSS file is imported here

import { createSharedState } from './core-utils/sharedState';

// ---
// Overwatch TS: Set up global, persistent state for user and feedback messages
// This makes state available everywhere, and persists it in localStorage
createSharedState('user', { id: '', name: '', isAnonymous: false, avatar: '' }, { persist: 'localStorage' });
createSharedState('feedbackMessages', [], { persist: 'localStorage' });
// equivalent in batchCreateSharedStates
// ---
// batchCreateSharedStates({'user' : { id: '', name: '', isAnonymous: false, avatar: '' },'feedbackMessages': []}, 
//   { persist: 'localStorage' })
// ---

const App: React.FC = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Watchly Thoughts</h1>
        <p className="app-subtitle">Leave your mark! Share a short message with everyone.</p>
      </header>
      <main className="app-main">
        <FeedbackWall />
      </main>
    </div>
  );
};

export default App;