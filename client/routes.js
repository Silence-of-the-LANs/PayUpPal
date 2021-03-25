import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AddFriend from './components/AddFriend';
import ManageFriends from './components/ManageFriends';
import ViewFriends from './components/ViewFriends';
import ScanReceipt from './components/ScanReceipt';
import TommyPractice from './components/TommyPractice';
import EditReceipt from './components/EditReceipt';
import ViewDebts from './components/ViewDebts';

const Routes = () => {
  return (
    <Switch>
      {/* <Route path='/home' component={Home} /> */}
      <Route path='/addfriend' component={AddFriend} />
      <Route path='/viewfriends' component={ViewFriends} />
      <Route exact path='/scanreceipt' component={ScanReceipt} />
      <Route exact path='/editreceipt' component={EditReceipt} />
      <Route path='/' component={TommyPractice} />
      <Route path='/managefriends' component={ManageFriends} />
      <Route path='/viewdebts' component={ViewDebts} />
    </Switch>
  );
};

export default Routes;
