import React, { useReducer, useState, useContext } from 'react';
import { ReceiptDataContext } from '../Store';
import IndividualItem from './IndividualItem';
import AddFriend from './AddFriend';
import FriendList from './SelectFriends';
import axios from 'axios';
import { useHistory } from 'react-router';
import Modal from '@material-ui/core/Modal';

const EditReceipt = () => {
  const history = useHistory();
  // grab receiptData from store
  const [pool, setPool] = useState();
  const [receiptDataState, dispatch] = useContext(ReceiptDataContext);
  // if tax is read on our receipt, set as state, otherwise 0
  const [tax, setTax] = useState(
    receiptDataState.miscItems ? receiptDataState.miscItems.tax : 0
  );
  // if tip is read on our receipt, set as state, otherwise 0
  const [tip, setTip] = useState(
    receiptDataState.miscItems ? receiptDataState.miscItems.tip : 0
  );
  const [eventInput, setEventInput] = useState('');

  const [openSelect, setOpenSelect] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);

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
  const submitReceipt = (e) => {
    e.preventDefault();
    let newTip;
    let newTax;
    if (isNaN(tax)) {
      newTax = 0;
    } else {
      newTax = tax;
    }
    if (isNaN(tip)) {
      newTip = 0;
    } else {
      newTip = tip;
    }
    // receiptData has items, misc items, imageUrl, and imageName
    let editReceiptUserData = {
      ...receiptDataState,
      eventName: eventInput,
      tax: newTax,
      tip: newTip,
      total,
    };
    let { data } = axios.post('/api/receipts/submit', editReceiptUserData);
    // add data to view history component
    // history.push('/receiptsubmit')
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
  // finds sum of subtotal, tip, tax
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

  const closeAddModal = () => {
    setOpenAdd(false);
  };
  const closeSelectModal = () => {
    setOpenSelect(false);
  };

  return (
    <div style={{ border: 'solid black' }}>
      <div>
        <h2>Edit Receipt</h2>
        <input
          type='text'
          placeholder='Label this event here...'
          onChange={(e) => setEventInput(e.target.value)}
        ></input>
        <button type='button' onClick={addItem}>
          Add Item
        </button>
        <button type='button'>Image</button>
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
        <Modal
          open={openSelect}
          onClose={() => {
            setOpenSelect(false);
          }}
          aria-labelledby='Select Friend(s)'
          aria-describedby='Select your friends to add'
        >
          <FriendList closeSelectModal={closeSelectModal} addToPool={setPool} />
        </Modal>
        {receiptDataState.items && (
          <table>
            <tr className='item-header'>
              <th></th>
              <th>Quantity</th>
              <th>Description</th>
              <th>Price Per Item</th>
              <th>Item total</th>
            </tr>
            {/* maps thru each indivial item */}
            {receiptDataState.items.map((item, index) => {
              return <IndividualItem item={item} itemIndex={index} />;
            })}
          </table>
        )}
      </div>
      <div id='misc-form'>
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
        <button type='submit' onClick={submitReceipt}>
          Submit Receipt
        </button>
      </div>
    </div>
  );
};

export default EditReceipt;
