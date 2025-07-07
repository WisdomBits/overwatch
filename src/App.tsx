import React from 'react';
import FeedbackWall from './FeedbackWall';

const App: React.FC = () => {
  console.log("App");
  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f9f9f9' }}>
      <header style={{ background: '#222', color: '#fff', padding: '1.5rem 0', textAlign: 'center', letterSpacing: '2px' }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>Guestbook / Feedback Wall</h1>
        <p style={{ margin: 0, fontSize: '1.1rem', color: '#bbb' }}>Leave your mark! Share a short message with everyone.</p>
      </header>
      <main style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
        <FeedbackWall />
      </main>
    </div>
  );
};

export default App; 