import React, { useState, useReducer } from 'react';
import axios from 'axios';
import receiptDataReducer from './reducers/receiptDataReducer';

// create a context (similar to when components call connect on redux))
export const ReceiptDataContext = React.createContext({});
export const UserContext = React.createContext(null);
// export const FinalizedReceiptDataContext = React.createContext([]);

const Store = ({ children }) => {
  // similar to mapState & mapProps
  const [receiptDataState, dispatch] = useReducer(receiptDataReducer, {});

  const getUser = async () => {
    const { data } = await axios.get('auth/me');
  };
  const initialUser = getUser();
  const [user, setUser] = useState(initialUser);

  return (
    // ReceiptDataContext gives all components access to receiptDataState
    <ReceiptDataContext.Provider value={[receiptDataState, dispatch]}>
      <UserContext.Provider value={[user, setUser]}>
        {children}
      </UserContext.Provider>
    </ReceiptDataContext.Provider>
  );
};

export default Store;
