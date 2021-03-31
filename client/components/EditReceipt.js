import React, { useEffect, useState, useContext } from 'react';
import * as ReactModal from 'react-modal';
import { ReceiptDataContext } from '../Store';
import IndividualItem from './IndividualItem';
import AddFriend from './AddFriend';
import FriendList from './SelectFriends';
import axios from 'axios';
import { useHistory } from 'react-router';
import Modal from '@material-ui/core/Modal';
import { Switch } from '@material-ui/core';

ReactModal.setAppElement('#app');
const EditReceipt = () => {
  const history = useHistory();
  // grab receiptData from store
  const [pool, setPool] = useState([]);
  const [receiptDataState, dispatch] = useContext(ReceiptDataContext);
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
  const [countdown, setCountdown] = useState(5);
  const [modalIsOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (successfulSubmit && countdown > 0) {
      setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
  });
  const [splitEvenly, setSplitEvenly] = useState(true);
  const [openSelect, setOpenSelect] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);

  const closeAddModal = () => {
    setOpenAdd(false);
  };

  const toggleSwitch = () => {
    setSplitEvenly(!splitEvenly);
  };

  // adds an empty item to our item list
  const addItem = () => {
    let newItem = {
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
    <div style={{ border: 'solid black' }}>
      <div>
        <h2>Edit Receipt</h2>
        <div>
          {hasSubmitted && !eventInput && (
            <p style={{ color: 'red' }}>Event name cannot be empty</p>
          )}
          <label>Event Name:</label>
          <input
            type='text'
            placeholder='Label this event here...'
            value={eventInput}
            onChange={(e) => setEventInput(e.target.value)}
          />
        </div>
        <div>
          {hasSubmitted && !dateInput && (
            <p style={{ color: 'red' }}>Date name cannot be empty</p>
          )}
          <label>Event Date:</label>
          <input
            type='date'
            placeholder=''
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
        </div>
        <br />
        <button onClick={() => setIsOpen(true)}>Preview Image</button>
        <ReactModal
          isOpen={modalIsOpen}
          onRequestClose={() => setIsOpen(false)}
        >
          <div>
            <button onClick={() => setIsOpen(false)}>Close</button>
            <img className='preview-image' src={receiptDataState.imageUrl} />
          </div>
        </ReactModal>
        <button
          type='button'
          onClick={() => {
            setOpenAdd(true);
          }}
        >
          Add Friend
        </button>
        <Modal
          open={openAdd}
          onClose={closeAddModal}
          aria-labelledby='Add a friend'
          aria-describedby='Add a new friend to your friend list'
        >
          <AddFriend closeAddModal={closeAddModal} />
        </Modal>
        <button
          type='button'
          onClick={() => {
            setOpenSelect(true);
          }}
        >
          Select Friends
        </button>
        <Switch checked={splitEvenly} onChange={toggleSwitch} /> Split Evenly
        <Modal
          open={openSelect}
          onClose={() => {
            setOpenSelect(false);
          }}
          aria-labelledby='Select Friend(s)'
          aria-describedby='Select your friends to add'
        >
          <FriendList updatePool={setPool} />
        </Modal>
        <div>
          Friends selected:{' '}
          {pool.map((friend, index) => (
            <span>
              {index === pool.length - 1 ? friend.name : friend.name + ', '}
            </span>
          ))}
        </div>
        {receiptDataState.items && (
          <table>
            <tr className='item-header'>
              <th></th>
              <th>Quantity</th>
              <th>Description</th>
              <th>Price Per Item</th>
              <th>Item total</th>
              {!splitEvenly && <th>Allocated</th>}
            </tr>
            {/* maps thru each indivial item */}
            {receiptDataState.items.map((item, index) => {
              return (
                <IndividualItem
                  item={item}
                  itemIndex={index}
                  splitEvenly={splitEvenly}
                  pool={pool}
                />
              );
            })}
          </table>
        )}
      </div>
      <div id='misc-form'>
        <button type='button' onClick={addItem}>
          Add Item
        </button>
        {/* if receiptData exists show subTotal */}
        <label>Subtotal: {receiptDataState.items && subTotal}</label>
        <label>
          Tax:{' '}
          <input
            type='number'
            min='0'
            value={tax}
            step='0.01'
            onChange={(e) => setTax(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Tip:{' '}
          <input
            type='number'
            min='0'
            value={tip}
            step='0.01'
            onChange={(e) => setTip(parseFloat(e.target.value))}
          />
        </label>
        <label>Total: ${total.toFixed(2)}</label>
        <button
          type='submit'
          disabled={
            splitEvenly
              ? pool.length < 1 || !receiptDataState.items
              : receiptDataState.items
              ? !everyItemAssigned
              : true
          }
          onClick={submitReceipt}
        >
          Submit Receipt
        </button>
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
