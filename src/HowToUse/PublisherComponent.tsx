import * as React from 'react';
import { useBroadcast } from '../Hooks/useBroadcast';


// cmd + shift + P -> restart TS server
const PublisherComponent: React.FC = () => {
  const publish = useBroadcast<string>('greet');

  return (<>
    <button
      onClick={() => publish('You rock!')}
      style={{ width: "200px", padding: '0.5rem 1rem', margin: '1rem 0', cursor: "pointer" }}
    >
      Send Greeting
    </button>
    </>);
};

export default PublisherComponent;
