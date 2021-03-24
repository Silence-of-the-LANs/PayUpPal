import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AddFriend from './components/AddFriend';
import ViewFriends from './components/ViewFriends';

const Routes = () => {
  return (
    <Switch>
      {/* <Route path='/home' component={Home} /> */}
      <Route path='/friends' component={AddFriend} />
      <Route path='/viewfriends' component={ViewFriends} />
    </Switch>
  );
};

export default Routes;
