import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AddFriend from './components/AddFriend';
import Upload from './components/Upload';

const Routes = () => {
  return (
    <Switch>
      {/* <Route path='/home' component={Home} /> */}
      <Route path='/friends' component={AddFriend} />
    </Switch>
  );
};

export default Routes;
