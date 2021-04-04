import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { UserContext, ReceiptDataContext } from '../Store';
import * as ReactModal from 'react-modal';
import { useHistory } from 'react-router';
import Accordion from '@material-ui/core/Accordion';
import Button from '@material-ui/core/Button';
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
      console.log(sortItems);
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
      <div id='receipt-header-div'>
        <p>Receipt History</p>
      </div>
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
                <p>Event: {selectedReceipt.eventName}</p>
                <p>Date: {selectedReceipt.date}</p>
              </div>
              <div id='friends-div'>
                <p>
                  Friend(s) on receipt:{' '}
                  {getFriends(selectedReceipt).map((friend, i, arr) => {
                    return i === arr.length - 1 ? friend : friend + ', ';
                  })}
                </p>
              </div>
              {isPreviewClicked && (
                <ReactModal
                  id='receipt-history-preview-img'
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
                      src={selectedReceipt.imageUrl || 'no-image.png'}
                      alt='Receipt not uploaded'
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
                <span>Items</span>
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
              <div id='right-bottom-panel'>
                <div id='total-div'>
                  <p>
                    <span>Subtotal:</span> $
                    {(
                      selectedReceipt.items.reduce(
                        (a, b) => a + b.pricePerItem * b.quantity,
                        0
                      ) / 100
                    ).toFixed(2)}
                  </p>
                  <p>
                    <span>Tip: </span> ${(selectedReceipt.tip / 100).toFixed(2)}
                  </p>
                  <p>
                    <span>Tax: </span>${(selectedReceipt.tax / 100).toFixed(2)}
                  </p>
                  <p>
                    <span>Total:</span> $
                    {(selectedReceipt.total / 100).toFixed(2)}
                  </p>
                </div>
                <div id='receipt-button-div'>
                  <Button
                    variant='outlined'
                    color='primary'
                    size='small'
                    onClick={() => {
                      setIsOpen(true);
                      setPreviewClicked(true);
                    }}
                  >
                    View Receipt
                  </Button>
                  {/* <button
                    onClick={() => {
                      setIsOpen(true);
                      setPreviewClicked(true);
                    }}
                  >
                    View Receipt
                  </button> */}
                  <Button
                    variant='outlined'
                    color='primary'
                    size='small'
                    onClick={editReceipt}
                  >
                    Edit Receipt
                  </Button>
                </div>
              </div>
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
