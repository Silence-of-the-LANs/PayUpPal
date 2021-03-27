import React from 'react';
import Routes from './routes';
import { Navbar } from './components';
import TommyPractice from '../client/components/TommyPractice';
import ReactNotification, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

const App = () => {
  return (
    <div>
      <ReactNotification />
      <Navbar />
      <Routes />
      {/* <TommyPractice /> */}
    </div>
  );
};

export default App;
