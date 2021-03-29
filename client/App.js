import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Routes from './routes';
import { Navbar } from './components';

export const UserContext = React.createContext(null);

const App = () => {
  const getUser = async () => {
    const { data } = await axios.get('auth/me');
  };
  const initialUser = getUser();
  const [user, setUser] = useState(initialUser);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Navbar />
      <Routes />
    </UserContext.Provider>
  );
};

export default App;
