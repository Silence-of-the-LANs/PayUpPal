import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  AddFriend,
  EditReceipt,
  Home,
  Login,
  ManageFriends,
  ScanReceipt,
  Signup,
  ViewDebts,
  ViewFriends,
  DrawerMenu,
} from './components';

const Routes = () => {
  return (
    <Switch>
      <Route path='/home' component={Home} />
      <Route path='/addfriend' component={AddFriend} />
      <Route path='/viewfriends' component={ViewFriends} />
      <Route exact path='/scanreceipt' component={ScanReceipt} />
      <Route exact path='/editreceipt' component={EditReceipt} />
      <Route path='/signup' component={Signup} />
      <Route path='/login' component={Login} />
      <Route exact path='/managefriends' component={ManageFriends} />
      <Route exact path='/viewdebts' component={ViewDebts} />
      <Route path='/' component={Home} />
    </Switch>
  );
};

export default Routes;
