import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../Store';
import Modal from 'react-modal';

Modal.setAppElement('#app');
const ReceiptHistory = () => {
  const [user, setUser] = useContext(UserContext);
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);
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
        setSelectedReceipt(sortItems[0]);
      }
    }
    fetchReceipt();
  }, []);
  return (
    <div id='receipthistory-div'>
      <div id='past-receipt'>
        {selectedReceipt.items ? (
          <>
            <h3>
              {selectedReceipt.eventName} {selectedReceipt.date}
            </h3>
            <button onClick={() => setIsOpen(true)}>Open Modal</button>
            <Modal
              isOpen={modalIsOpen}
              // onAfterOpen={afterOpenModal}
              onRequestClose={() => setIsOpen(false)}
            >
              <div>
                <button onClick={() => setIsOpen(false)}>Close</button>
                <img src={selectedReceipt.imageUrl} />
              </div>
            </Modal>
            <ol>
              Items
              {selectedReceipt.items.map((item) => {
                return (
                  <li>
                    {item.quantity} {item.description} $
                    {(item.pricePerItem * item.quantity) / 100}
                  </li>
                );
              })}
            </ol>
            <p>
              Subtotal: $
              {selectedReceipt.items.reduce(
                (a, b) => a + b.pricePerItem * b.quantity,
                0
              ) / 100}
            </p>
            <p>Tip: ${selectedReceipt.tip / 100}</p>
            <p>Tax: ${selectedReceipt.tax / 100}</p>
            <p>Total: ${selectedReceipt.total / 100}</p>
          </>
        ) : (
          <h4>No receipt history</h4>
        )}
      </div>
      <div id='receipt-list'>
        {receipts.length ? (
          receipts.map((receipt) => {
            return (
              <button onClick={() => setSelectedReceipt(receipt)}>
                {receipt.eventName} {receipt.date}
              </button>
            );
          })
        ) : (
          <>
            <h2>No receipt history</h2>
            <a href='scanrecreipt'>Scan a receipt now!</a>
          </>
        )}
      </div>
      {/* {receipts &&
        receipts.map((receipt) => {
          return (
            <div>
              <h3>
                {receipt.eventName} {receipt.date}
              </h3>
              <p>URL: {receipt.imageUrl}</p>
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
        })} */}
    </div>
  );
};

export default ReceiptHistory;
