import React, { useState, useReducer } from 'react';
import receiptDataReducer from './reducers/receiptDataReducer';

// create a context (similar to when components call connect on redux))
export const ReceiptDataContext = React.createContext({});
export const UserContext = React.createContext({});
// export const FinalizedReceiptDataContext = React.createContext([]);

const Store = ({ children }) => {
  // similar to mapState & mapProps
  const [receiptDataState, dispatch] = useReducer(receiptDataReducer, {});
  const [user, setUser] = useState({});
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
