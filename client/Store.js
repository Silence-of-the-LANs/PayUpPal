import React, { useState } from 'react';

export const ReceiptDataContext = React.createContext('hello');
// export const FinalizedReceiptDataContext = React.createContext([]);

const Store = ({ children }) => {
  const [receiptData, setReceiptData] = useState('hello');
  return (
    <ReceiptDataContext.Provider value={[receiptData, setReceiptData]}>
      {children}
    </ReceiptDataContext.Provider>
  );
};

export default Store;
