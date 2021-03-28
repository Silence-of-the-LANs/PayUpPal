import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../Store';

const ReceiptHistory = () => {
  const [user, setUser] = useContext(UserContext);
  const [receipts, setReceipts] = useState([]);
  // useEffect, similar to component did mount if the second argument is empty
  // if user is logged in fetch receiptdata
  useEffect(() => {
    async function fetchReceipt() {
      if (user.id) {
        const receiptHistory = await axios.get(`/api/receipts/user${user.id}`);
        const sortByRecentReceipt = receiptHistory.data.sort((a, b) => {
          return a.id < b.id ? 1 : -1;
        });
        const sortItems = sortByRecentReceipt.map((receipt) => {
          receipt.items = receipt.items.sort((a, b) => {
            return a.id > b.id ? 1 : -1;
          });
          return receipt;
        });
        setReceipts(sortItems);
      }
    }
    fetchReceipt();
  }, []);
  return (
    <div>
      {receipts &&
        receipts.map((receipt) => {
          return (
            <div>
              <h3>{receipt.eventName}</h3>
              <p>
                Tip: ${receipt.tip / 100} Tax: ${receipt.tax / 100} Total: $
                {receipt.total / 100}
              </p>
              <ol>
                Items:
                {receipt.items.map((item) => {
                  return (
                    <li>
                      ID: {item.id} Quantity: {item.quantity} Description:{' '}
                      {item.description} Price Per Item: $
                      {item.pricePerItem / 100}
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
    </div>
  );
};

export default ReceiptHistory;
