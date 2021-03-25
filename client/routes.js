import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AddFriend from './components/AddFriend';
import ViewFriends from './components/ViewFriends';
import ScanReceipt from './components/ScanReceipt';
import TommyPractice from './components/TommyPractice';
import EditReceipt from './components/EditReceipt';

const Routes = () => {
  return (
    <Switch>
      {/* <Route path='/home' component={Home} /> */}
      <Route path='/friends' component={AddFriend} />
      <Route path='/viewfriends' component={ViewFriends} />
      <Route exact path='/scanreceipt' component={ScanReceipt} />
      <Route exact path='/editreceipt' component={EditReceipt} />
      <Route path='/' component={TommyPractice} />
    </Switch>
  );
};

export default Routes;
