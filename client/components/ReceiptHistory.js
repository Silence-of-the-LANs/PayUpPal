import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { UserContext, ReceiptDataContext } from '../Store';
import * as ReactModal from 'react-modal';
import { useHistory } from 'react-router';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
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
  const [isPreviewClicked, setPreviewClicked] = useState(false);
  const [buttonId, setButtonId] = useState(0);
  const [deleteReceipt, setDeleteReceipt] = useState({});
  // useEffect, similar to component did mount if the second argument is empty
  // if user is logged in fetch receiptdata
  const sortReceipts = (receiptsHistory) => {
    const sortByRecentReceipt = receiptsHistory;
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
        const { data } = await axios.get('/api/receipts/user');
        !data.length ? setNoReceipts(true) : setNoReceipts(false);
        if (data.length) {
          setReceipts(sortReceipts(data));
        }
      }
    }
    fetchReceipt();
  });
  const confirmDeleteReceipt = async (id) => {
    const { data } = await axios.delete(`/api/receipts/${id}`);
    !data.length ? setNoReceipts(true) : setNoReceipts(false);
    if (data.length) {
      setReceipts(sortReceipts(data));
    }

    setIsOpen(false);
  };
  const deleteClicked = (receipt) => {
    setDeleteClicked(true);
    setIsOpen(true);
    setDeleteReceipt(receipt);
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

    let friendPool;

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
      if (item.debts) {
        item.debts.forEach((debt) => {
          if (!friendList.includes(debt.friend.name)) {
            friendList.push(debt.friend.name);
          }
        });
      }
    });
    return friendList;
  };
  const handleSelectReceipt = (receipt, i) => {
    setSelectedReceipt(receipt);
    setButtonId(i);
  };

  return (
    <div id='receipthistory-div'>
      <h1>Receipt History</h1>
      <div id='receiptList-details-div'>
        {isDeleteClicked && (
          <ReactModal
            isOpen={modalIsOpen}
            id='delete-history-modal'
            onRequestClose={() => {
              setIsOpen(false);
              setDeleteClicked(false);
            }}
          >
            <div className='delete-history-div'>
              <h4>
                Are you sure you want to delete {deleteReceipt.eventName}{' '}
                {deleteReceipt.date}
              </h4>
              <div>
                <button onClick={() => confirmDeleteReceipt(deleteReceipt.id)}>
                  Delete
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false), setDeleteClicked(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </ReactModal>
        )}
        <div id='receipt-list'>
          {receipts.length && !hasNoReceipts ? (
            receipts.map((receipt, i) => {
              return (
                <div className='single-history-button-div'>
                  <button
                    className={
                      buttonId === i ? 'selected-receipt' : 'not-selected'
                    }
                    onClick={() => {
                      deleteClicked(receipt);
                    }}
                  >
                    X
                  </button>
                  <button
                    className={
                      buttonId === i
                        ? 'single-history-button selected-receipt'
                        : 'single-history-button not-selected'
                    }
                    onClick={() => {
                      handleSelectReceipt(receipt, i);
                    }}
                    // onClick={() => setSelectedReceipt(receipt)}
                  >
                    {receipt.eventName} {receipt.date}
                  </button>
                </div>
              );
            })
          ) : (
            <>
              <h2>No receipt history</h2>
            </>
          )}
        </div>
        <div id='past-receipt'>
          {!hasNoReceipts && selectedReceipt.items ? (
            <>
              <div id='history-heading'>
                <h3>Event: {selectedReceipt.eventName}</h3>
                <h3>Date: {selectedReceipt.date}</h3>
              </div>
              <div id='friends-and-buttons'>
                <p>
                  Friend(s) on receipt:{' '}
                  {getFriends(selectedReceipt).map((friend, i, arr) => {
                    return i === arr.length - 1 ? friend : friend + ', ';
                  })}
                </p>
                <div id='receipt-history-button-div'>
<<<<<<< HEAD
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => setIsOpen(true)}
                    size='small'
                    name={'preview-image'}
                  >
                    Preview Image
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={editReceipt}
                    size='small'
                    name={'edit-receipt'}
                  >
                    Edit Receipt
                  </Button>
=======
                  <button
                    onClick={() => {
                      setIsOpen(true);
                      setPreviewClicked(true);
                    }}
                  >
                    View Receipt
                  </button>
                  <button onClick={editReceipt}>Edit Receipt</button>
>>>>>>> main
                </div>
              </div>
              {isPreviewClicked && (
                <ReactModal
                  isOpen={modalIsOpen}
                  // onAfterOpen={afterOpenModal}
                  onRequestClose={() => {
                    setIsOpen(false);
                    setPreviewClicked(false);
                  }}
                >
                  <div className='preview-image-div'>
                    <img
                      className='preview-image'
                      src={selectedReceipt.imageUrl}
                    />
                    <button
                      onClick={() => {
                        setIsOpen(false), setPreviewClicked(false);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </ReactModal>
              )}
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
                            {item.quantity} {item.description} - $
                            {(item.pricePerItem / 100).toFixed(2)} each (SEE
                            FRIENDS)
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {item.debts &&
                            item.debts.map((debt) => {
                              console.log(
                                item,
                                debt.balance,
                                debt.proratedTip,
                                debt.proratedTax
                              );
                              return (
                                <Typography>
                                  {debt.friend.name} owes $
                                  {(
                                    (debt.balance +
                                      debt.proratedTip +
                                      debt.proratedTax) /
                                    100
                                  ).toFixed(2)}
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
                {(
                  selectedReceipt.items.reduce(
                    (a, b) => a + b.pricePerItem * b.quantity,
                    0
                  ) / 100
                ).toFixed(2)}
              </p>
              <p>Tip: ${(selectedReceipt.tip / 100).toFixed(2)}</p>
              <p>Tax: ${(selectedReceipt.tax / 100).toFixed(2)}</p>
              <p>Total: ${(selectedReceipt.total / 100).toFixed(2)}</p>
            </>
          ) : (
            <a href='scanreceipt'>Scan a receipt now!</a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptHistory;
