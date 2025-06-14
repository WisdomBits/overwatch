import * as React from 'react';

import {useEvent} from "overwatch-ts"

const SubscriberComponent: React.FC = () => {
  useEvent('greet', (data) => {
    console.log('Received greeting:', data);
    alert(`Hello from pubsub: ${data}`);
  }, 'SubscriberComponent');

  return <div>Subscriber is listening for "greet" event</div>
};

export default SubscriberComponent;
