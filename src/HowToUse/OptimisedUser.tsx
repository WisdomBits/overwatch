import { useEffect } from 'react';
import { usePicker } from '../Hooks/usePicker';

type User = {
    name: string
};

const OptimisedUser = () => {
    // This Component will not get re-render only when users name property get's updated
    const userName = usePicker<User, string>('user', user => user.name);

    useEffect(() => {
        console.log("will it get re-render")
    },[userName])

  return (<>
  <h3>usePicker : Optimized hook (Recomended for state consumption) </h3>
  <h5>that lets you extract and subscribe to specific pieces of state from the Redux store. It re-renders your component only when the selected state changes, improving performance by avoiding unnecessary renders.</h5>
  <p>User's name is {userName}</p></>)
}

export default OptimisedUser