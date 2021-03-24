import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AddFriend from './components/AddFriend';
import ViewFriends from './components/ViewFriends';
import ViewDebts from './components/ViewDebts';

const Routes = () => {
  return (
    <Switch>
      {/* <Route path='/home' component={Home} /> */}
      <Route path='/addfriend' component={AddFriend} />
      <Route path='/viewfriends' component={ViewFriends} />
      <Route path='/viewdebts' component={ViewDebts} />
    </Switch>
  );
};

export default Routes;
