import PublisherComponent from "./HowToUse/PublisherComponent"
import SubscriberComponent from "./HowToUse/SubscriberComponent"
import BatchingExample from "./HowToUse/BatchingExample";
import ShowTheme from "./HowToUse/ShowTheme";
import UpdateTheme from "./HowToUse/UpdateTheme";

import {applyMiddleware} from "overwatch-ts"
import {createSharedState} from "overwatch-ts"
import OptimisedUser from "./HowToUse/OptimisedUser";
// Initialising a single shared state
createSharedState('theme', {type : 'light'});
createSharedState('user', { type: "dev", name: 'Karan', email: 'Karan@codescop.com' });
createSharedState('author', {name : 'unknown'});
// also write a function to initialise multiple state using a single function

applyMiddleware('theme', (value, next) => {
    console.log('From Global Middleware : Theme changed to:', value);
    next(value);
  });
function App() {

  return (<>
  <div style={{display: "flex", gap : "1rem",flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", marginBottom: "5rem"}}>
    Pubsub Implementation
    <PublisherComponent />
    <SubscriberComponent />
    State Management
    <ShowTheme />
    <UpdateTheme />
    <BatchingExample />
    <OptimisedUser />
    </div>
    </>)
  
}

export default App
