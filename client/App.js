import React, { useEffect, useState } from 'react';
import Routes from './routes';
import { Navbar } from './components';
import ReactNotification, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

const App = () => {
  return (
    <div className='bgImage'>
      <ReactNotification />
      <Navbar />
      <Routes />
    </div>
  );
};

export default App;
