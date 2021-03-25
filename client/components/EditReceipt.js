import React, { useReducer, useEffect, useContext } from 'react';
import { ReceiptDataContext } from '../Store';
import IndividualItem from './IndividualItem';

const EditReceipt = () => {
  const [receiptDataState, dispatch] = useContext(ReceiptDataContext);
  const addItem = () => {
    let newItem = {
      quantity: 1,
      description: '',
      pricePerItem: 0,
      totalPrice: 0,
    };
    dispatch({ type: 'ADD_ITEM', newItem });
  };
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
            {receiptDataState.items.map((item, index) => {
              return <IndividualItem item={item} itemIndex={index} />;
            })}
          </table>
        )}
      </div>
      {receiptDataState.miscItems &&
        Object.keys(receiptDataState.miscItems).map((item, index) => {
          return (
            <p>
              {item}: {receiptDataState.miscItems[item]}
            </p>
          );
        })}
      <button>click to log state</button>
    </div>
  );
};

export default EditReceipt;
