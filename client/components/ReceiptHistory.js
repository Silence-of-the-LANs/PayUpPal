import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { UserContext, ReceiptDataContext } from '../Store';
import * as ReactModal from 'react-modal';
import { useHistory } from 'react-router';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

ReactModal.setAppElement('#app');
const ReceiptHistory = () => {
  const history = useHistory();
  const [user, setUser] = useContext(UserContext);
  const [receiptDataState, dispatch] = useContext(ReceiptDataContext);
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const [hasNoReceipts, setNoReceipts] = useState(false);
  const [isDeleteClicked, setDeleteClicked] = useState(false);
  // useEffect, similar to component did mount if the second argument is empty
  // if user is logged in fetch receiptdata
  const sortReceipts = (receiptsHistory) => {
    const sortByRecentReceipt = receiptsHistory.sort((a, b) => {
      return a.id < b.id ? 1 : -1;
    });
    const sortItems = sortByRecentReceipt.map((receipt) => {
      receipt.items = receipt.items.sort((a, b) => {
        return a.id > b.id ? 1 : -1;
      });
      return receipt;
    });
    setSelectedReceipt(sortItems[0]);
    return sortItems;
  };
  useEffect(() => {
    async function fetchReceipt() {
      if (user.id && !receipts.length && !hasNoReceipts) {
        const { data } = await axios.get(`/api/receipts/user${user.id}`);
        !data.length ? setNoReceipts(true) : setNoReceipts(false);
        if (data.length) {
          setReceipts(sortReceipts(data));
        }
      }
    }
    fetchReceipt();
    console.log('selectedReceipt', selectedReceipt);
  });
  const confirmDeleteReceipt = async (id) => {
    const { data } = await axios.delete(`/api/receipts/${id}`);
    console.log('data', data);
    !data.length ? setNoReceipts(true) : setNoReceipts(false);
    if (data.length) {
      setReceipts(sortReceipts(data));
    }

    setIsOpen(false);
  };
  const deleteClicked = () => {
    setDeleteClicked(true);
    setIsOpen(true);
  };
  const editReceipt = () => {
    let {
      id,
      date,
      eventName,
      imageUrl,
      items,
      tax,
      tip,
      total,
    } = selectedReceipt;
    items = items.map((item) => {
      item.totalPrice = (item.quantity * item.pricePerItem) / 100;
      item.pricePerItem /= 100;
      return item;
    });
    let miscItems = { tax: tax / 100, tip: tip / 100 };
    // sending off items to be updated
    let itemsInfo = {
      id,
      eventName,
      imageUrl,
      items,
      miscItems,
      date,
      isEditReceipt: true,
    };
    dispatch({ type: 'GET_ITEMS', itemsInfo });
    history.push('/editreceipt');
  };
  const getFriends = (receipt) => {
    let friendList = [];
    receipt.items.forEach((item) => {
      item.debts.forEach((debt) => {
        if (!friendList.includes(debt.friend.name)) {
          friendList.push(debt.friend.name);
        }
      });
    });
    return friendList;
  };
  return (
    <div id='receipthistory-div'>
      <div id='past-receipt'>
        {!hasNoReceipts && selectedReceipt.items ? (
          <>
            <h3>
              {selectedReceipt.eventName} {selectedReceipt.date}
            </h3>
            <button onClick={() => setIsOpen(true)}>Preview Image</button>
            <button onClick={editReceipt}>Edit Receipt</button>
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
            <p>
              Friend(s) on receipt:{' '}
              {getFriends(selectedReceipt).map((friend, i, arr) => {
                return i === arr.length - 1 ? friend : friend + ', ';
              })}
            </p>
            <ol>
              Items
              {selectedReceipt.items.map((item) => {
                return (
                  <li>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel1a-content'
                        id='panel1a-header'
                      >
                        <Typography>
                          {item.quantity} {item.description} $
                          {(item.pricePerItem * item.quantity) / 100} (Click to
                          see friends/debts)
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {item.debts.map((debt) => {
                          return (
                            <Typography>
                              {debt.friend.name} owes $
                              {(debt.balance +
                                debt.proratedTip +
                                debt.proratedTax) /
                                100}
                            </Typography>
                          );
                        })}
                      </AccordionDetails>
                    </Accordion>
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
        {receipts.length && !hasNoReceipts ? (
          receipts.map((receipt) => {
            return (
              <div>
                <button onClick={deleteClicked}>X</button>
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
                      <button onClick={() => confirmDeleteReceipt(receipt.id)}>
                        Delete
                      </button>
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
            <a href='scanreceipt'>Scan a receipt now!</a>
          </>
        )}
      </div>
    </div>
  );
};

export default ReceiptHistory;
