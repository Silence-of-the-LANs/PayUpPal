import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../Store';
import * as ReactModal from 'react-modal';

ReactModal.setAppElement('#app');
const ReceiptHistory = () => {
  const [user, setUser] = useContext(UserContext);
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isDeleteClicked, setDeleteClicked] = useState(false);
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
  const deleteReceipt = () => {
    setDeleteClicked(true);
    setIsOpen(true);
  };
  return (
    <div id='receipthistory-div'>
      <div id='past-receipt'>
        {selectedReceipt.items ? (
          <>
            <h3>
              {selectedReceipt.eventName} {selectedReceipt.date}
            </h3>
            <button onClick={() => setIsOpen(true)}>Preview Image</button>
            <ReactModal
              isOpen={modalIsOpen}
              // onAfterOpen={afterOpenModal}
              onRequestClose={() => setIsOpen(false)}
            >
              <div className='preview-image-div'>
                <button onClick={() => setIsOpen(false)}>Close</button>
                <img className='preview-image' src={selectedReceipt.imageUrl} />
              </div>
            </ReactModal>
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
              <div>
                <button onClick={deleteReceipt}>X</button>
                {isDeleteClicked && (
                  <ReactModal
                    isOpen={modalIsOpen}
                    // onAfterOpen={afterOpenModal}
                    onRequestClose={() => setIsOpen(false)}
                  >
                    <div className='preview-image-div'>
                      <h4>
                        Are you sure you want to delete {receipt.eventName}{' '}
                        {receipt.date}
                      </h4>
                      <button>Delete</button>
                      <button onClick={() => setIsOpen(false)}>Cancel</button>
                    </div>
                  </ReactModal>
                )}
                <button onClick={() => setSelectedReceipt(receipt)}>
                  {receipt.eventName} {receipt.date}
                </button>
              </div>
            );
          })
        ) : (
          <>
            <h2>No receipt history</h2>
            <a href='scanrecreipt'>Scan a receipt now!</a>
          </>
        )}
      </div>
    </div>
  );
};

export default ReceiptHistory;
