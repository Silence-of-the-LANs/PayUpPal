import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Routes from './routes';
import { Navbar } from './components';

// export const UserContext = React.createContext(null);
import ReactNotification, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

const App = () => {
  // const getUser = async () => {
  //   const { data } = await axios.get('auth/me');
  // };
  // const initialUser = getUser();
  // const [user, setUser] = useState(initialUser);
  return (
    // <UserContext.Provider value={{ user, setUser }}>
    <div>
      <ReactNotification />

      <Navbar />
      <Routes />
      {/* </UserContext.Provider> */}
    </div>
  );
};

export default App;
