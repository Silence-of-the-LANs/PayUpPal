import React, { useReducer, useState, useContext } from 'react';
import { ReceiptDataContext } from '../Store';
import IndividualItem from './IndividualItem';

const EditReceipt = () => {
  // grab receiptData from store
  const [receiptDataState, dispatch] = useContext(ReceiptDataContext);
  // if tax is read on our receipt, set as state, otherwise 0
  const [tax, setTax] = useState(
    receiptDataState.miscItems ? receiptDataState.miscItems.tax : 0
  );
  // if tip is read on our receipt, set as state, otherwise 0
  const [tip, setTip] = useState(
    receiptDataState.miscItems ? receiptDataState.miscItems.tip : 0
  );
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
  const submitReceipt = () => {};
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
  return (
    <div style={{ border: 'solid black' }}>
      <div>
        <h2>Edit Receipt</h2>
        <input type='text' placeholder='Label this event here...'></input>
        <button type='button' onClick={addItem}>
          Add Item
        </button>
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
        <button type='submit' onSubmit={submitReceipt}>
          Submit Receipt
        </button>
      </div>
    </div>
  );
};

export default EditReceipt;
