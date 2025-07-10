// import PublisherComponent from "./HowToUse/PublisherComponent"
// import SubscriberComponent from "./HowToUse/SubscriberComponent"
// import BatchingExample from "./HowToUse/BatchingExample";
// import ShowTheme from "./HowToUse/ShowTheme";
// import UpdateTheme from "./HowToUse/UpdateTheme";

// import OptimisedUser from "./HowToUse/OptimisedUser";
import { createSharedState } from "./core-utils/sharedState";
import { applyMiddleware } from "./core-utils/Middleware";
// import OverwatchBenchmark from "./HowToUse/Test";
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
   {/* <OverwatchBenchmark /> */}
    {/* Pubsub Implementation */}
    {/* <PublisherComponent />
    <SubscriberComponent />
    State Management
    <ShowTheme />
    <UpdateTheme />
    <BatchingExample />
    <OptimisedUser /> */}
    </div>
    </>)
  
}

export default App
