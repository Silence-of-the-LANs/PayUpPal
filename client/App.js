import React, { useState } from 'react';
import Routes from './routes';
import { Navbar } from './components';
import TommyPractice from '../client/components/TommyPractice';

export const UserContext = React.createContext({});

const App = () => {
  const [user, setUser] = useState({ userId: null });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Navbar />
      <Routes />
      {/* <TommyPractice /> */}
    </UserContext.Provider>
  );
};

export default App;
