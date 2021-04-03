import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Routes from './routes';
import { Navbar } from './components';
import ReactNotification, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

const App = () => {
  return (
    <div>
      <ReactNotification />
      <Navbar />
      <Routes />
    </div>
  );
};

export default App;
