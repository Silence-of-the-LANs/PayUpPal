import React from 'react';
import Routes from './routes';
import { Navbar } from './components';
import TommyPractice from '../client/components/TommyPractice';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
      {/* <TommyPractice /> */}
    </div>
  );
};

export default App;
