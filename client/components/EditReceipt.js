import React, { useEffect, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as ReactModal from 'react-modal';
import { ReceiptDataContext } from '../Store';
import IndividualItem from './IndividualItem';
import AddFriend from './AddFriend';
import FriendList from './SelectFriends';
import axios from 'axios';
import { useHistory } from 'react-router';
import Modal from '@material-ui/core/Modal';
import { Switch, Button } from '@material-ui/core';

ReactModal.setAppElement('#app');

const EditReceipt = () => {
  const history = useHistory();
  // grab receiptData from store
  const [pool, setPool] = useState([]);
  const [receiptDataState, dispatch] = useContext(ReceiptDataContext);
  // console.log('pool is: ', pool);
  // console.log('receipt data is: ', receiptDataState);

  useEffect(() => {
    if (
      receiptDataState.items &&
      receiptDataState.items[0] &&
      receiptDataState.items[0].debts
    ) {
      const { items } = receiptDataState;
      let friendPool = {};
      items.forEach((item) =>
        item.debts.forEach((debt) => (friendPool[debt.friend.id] = debt.friend))
      );

      friendPool = Object.values(friendPool);

      setPool(friendPool);
    }
  }, []);

  // if tax is read on our receipt, set as state, otherwise 0
  const [tax, setTax] = useState(
    receiptDataState.miscItems ? receiptDataState.miscItems.tax : 0
  );
  // if tip is read on our receipt, set as state, otherwise 0
  const [tip, setTip] = useState(
    receiptDataState.miscItems ? receiptDataState.miscItems.tip : 0
  );
  const [eventInput, setEventInput] = useState(
    receiptDataState.eventName || ''
  );

  const [dateInput, setDateInput] = useState(receiptDataState.date || '');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [successfulSubmit, setSuccessfulSubmit] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [modalIsOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (successfulSubmit && countdown > 0) {
      let timer = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  });
  const [splitEvenly, setSplitEvenly] = useState(true);
  const [openSelect, setOpenSelect] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const closeAddModal = () => {
    setOpenAdd(false);
  };

  const toggleSwitch = () => {
    setSplitEvenly(!splitEvenly);
  };

  // adds an empty item to our item list
  const addItem = () => {
    let newItem = {
      id: uuidv4(),
      quantity: 1,
      description: '',
      pricePerItem: 0,
      totalPrice: 0,
    };
    dispatch({ type: 'ADD_ITEM', newItem });
  };
  if (countdown === 0) {
    history.push('/receipthistory');
  }
  const submitReceipt = (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (eventInput && dateInput) {
      let newTip;
      let newTax;
      newTax = isNaN(tax) ? 0 : tax;
      newTip = isNaN(tip) ? 0 : tip;
      // receiptData has items, misc items, imageUrl, and imageName
      let editReceiptUserData = {
        ...receiptDataState,
        eventName: eventInput,
        date: dateInput,
        tax: newTax,
        tip: newTip,
        total,
        pool,
        splitEvenly,
      };
      if (receiptDataState.isEditReceipt) {
        axios.put('/api/receipts/submit', editReceiptUserData);
      } else {
        let { data } = axios.post('/api/receipts/submit', editReceiptUserData);
      }

      setSuccessfulSubmit(true);
      // add data to view history component
    }
  };
  // finds subtotal based off sum of totalPrice
  const subTotal = receiptDataState.items
    ? parseFloat(
        receiptDataState.items
          .reduce((a, b) => {
            return a + b.totalPrice;
          }, 0)
          .toFixed(2)
      )
    : 0;
  // finds sum of subtotal, tip, tax˜
  let total = parseFloat(
    [subTotal, tax, tip]
      .reduce((a, b) => {
        // if tax or tip inpt is empty, it will return total will return Nan
        // assign tax or tip to 0 if NaN
        if (isNaN(b)) {
          b = 0;
          return a + b;
        }
        return a + b;
      }, 0)
      .toFixed(2)
  );

  let everyItemAssigned = receiptDataState.items
    ? (everyItemAssigned = receiptDataState.items.every(
        (item) => item.friends && item.friends.length > 0
      ))
    : 'false';
  return !successfulSubmit ? (
    <div id='edit-receipt-parent'>
      <div id='edit-receipt-top-panel'>
        <div id='editReceipt-header'>
          <p>Edit Receipt</p>
          <ReactModal
            isOpen={modalIsOpen}
            onRequestClose={() => setIsOpen(false)}
          >
            <div className='preview-image-div'>
              <img className='preview-image' src={receiptDataState.imageUrl} />
              <Button
                variant='contained'
                onClick={() => setIsOpen(false)}
                color='secondary'
                size='small'
                name={'preview'}
              >
                CLOSE
              </Button>
            </div>
          </ReactModal>
        </div>
        <div id='input-div'>
          <div className='input-event-date-add'>
            <div id='input-wrapper'>
              <div className='input-eventAndDate'>
                {hasSubmitted && !eventInput && (
                  <p style={{ color: 'red' }}>Event name cannot be empty</p>
                )}
                <label>Event Name:</label>
                <input
                  id='event-name'
                  type='text'
                  placeholder='Label this event here...'
                  value={eventInput}
                  onChange={(e) => setEventInput(e.target.value)}
                />
              </div>
              <div className='input-eventAndDate'>
                {hasSubmitted && !dateInput && (
                  <p style={{ color: 'red' }}>Date name cannot be empty</p>
                )}
                <label>Event Date:</label>
                <input
                  id='event-input'
                  type='date'
                  placeholder=''
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                />
              </div>
            </div>
            <div id='add-item-div'>
              <Button
                className='edit-receipt-friend-buttons'
                variant='contained'
                color='primary'
                onClick={addItem}
                size='medium'
                name={'add-item'}
              >
                Add Item
              </Button>
              <Button
                variant='outlined'
                color='primary'
                onClick={() => setIsOpen(true)}
                size='medium'
                name={'preview-image'}
              >
                Preview image
              </Button>
            </div>
          </div>
        </div>
        <div id='edit-receipt-middle-panel'>
          {receiptDataState.items && (
            <div id='item-div'>
              {receiptDataState.items.length && window.innerWidth > 550 && (
                <div
                  className={
                    splitEvenly ? 'grid-header' : 'grid-header-allocate'
                  }
                >
                  <div className='grid-labels'>Remove</div>
                  <div className='grid-labels'>Qty</div>
                  <div className='grid-labels'>Description</div>
                  <div className='grid-labels'>Price Per Item</div>
                  <div className='grid-labels'>Item total</div>
                  {!splitEvenly && (
                    <div className='grid-labels'>Assign friends to an item</div>
                  )}
                </div>
              )}
              {/* maps thru each indivial item */}
              {receiptDataState.items.length &&
                receiptDataState.items.map((item, index) => {
                  return (
                    <IndividualItem
                      key={item.id}
                      item={item}
                      itemIndex={index}
                      splitEvenly={splitEvenly}
                      pool={pool}
                    />
                  );
                })}
            </div>
          )}
        </div>
      </div>
      <div id='edit-receipt-bottom-panel'>
        <div id='friend-div'>
          <div id='friend-management-div'>
            <div id='add-friend-button'>
              <Button
                className='edit-receipt-friend-buttons'
                variant='outlined'
                color='primary'
                onClick={() => {
                  setOpenAdd(true);
                }}
                size='medium'
                name={'add-friend'}
              >
                Add To Friend List
              </Button>
            </div>
            <Modal
              open={openAdd}
              onClose={closeAddModal}
              aria-labelledby='Add a friend'
              aria-describedby='Add a new friend to your friend list'
            >
              <AddFriend closeAddModal={closeAddModal} />
            </Modal>
            <Button
              variant='contained'
              className='edit-receipt-friend-buttons'
              color='primary'
              onClick={() => {
                setOpenSelect(true);
              }}
              size='medium'
              name={'select-friend'}
            >
              Select From Friends
            </Button>
          </div>
          <div id='friends-selected-box'>
            <b>Friends selected:</b> {<br />}{' '}
            {!pool.length && (
              <p style={{ color: 'red' }}>Select friends to get started!</p>
            )}
            {pool.map((friend, index) => (
              <span>
                {index === pool.length - 1 ? friend.name : friend.name + ', '}
              </span>
            ))}
          </div>

          <Modal
            id='editreceipt-select-friends'
            open={openSelect}
            onClose={() => {
              setOpenSelect(false);
            }}
            aria-labelledby='Select Friend(s)'
            aria-describedby='Select your friends to add to this receipt'
            label='Click to select friends...'
          >
            <FriendList updatePool={setPool} selected={pool} />
          </Modal>
        </div>
        <div id='misc-form'>
          <div id='split-toggle'>
            <p
              className={
                !splitEvenly ? 'toggle-selected' : 'toggle-not-selected'
              }
            >
              Split By Item
            </p>
            <Switch checked={splitEvenly} onChange={toggleSwitch} />{' '}
            <p
              className={
                splitEvenly ? 'toggle-selected' : 'toggle-not-selected'
              }
            >
              Split Evenly
            </p>
          </div>
          {/* if receiptData exists show subTotal */}
          <div className='receipt-summary'>
            <label>
              Subtotal: $
              {(receiptDataState.items && subTotal.toFixed(2)) || '0.00'}
            </label>
            <div>
              <label>Tax: </label>
              <input
                className='tax-tip'
                type='number'
                min='0'
                value={tax}
                step='0.01'
                onChange={(e) => setTax(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <div>
                <label>Tip: </label>
                <input
                  className='tax-tip'
                  type='number'
                  min='0'
                  value={tip}
                  step='0.01'
                  onChange={(e) => setTip(parseFloat(e.target.value))}
                />
              </div>
              <div id='total'>
                <label>TOTAL: ${total.toFixed(2)}</label>
              </div>
            </div>
          </div>
          <Button
            id='submit-receipt-button'
            variant='contained'
            color='primary'
            onClick={submitReceipt}
            disabled={
              splitEvenly
                ? pool.length < 1 || !receiptDataState.items
                : receiptDataState.items
                ? !everyItemAssigned
                : true
            }
          >
            SUBMIT
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div id='successful-submit'>
      <p>
        Receipt Submitted!{' '}
        <img src='check-gif.gif' width='50vw' height='50vh' />
      </p>
      <a href='/receipthistory'>
        View Receipt History... redirecting in {countdown}
      </a>
    </div>
  );
};

export default EditReceipt;
