import React, { useState, useEffect, useContext } from 'react';
import { ReceiptDataContext } from '../Store';
import IndividualItem from './IndividualItem';

const EditReceipt = () => {
  const [receiptData, setReceiptData] = useContext(ReceiptDataContext);
  return (
    <div style={{ border: 'solid black' }}>
      <div>
        <h2>Edit Receipt</h2>
        {receiptData.items && (
          <table>
            <tr className='item-header'>
              <th>Quantity</th>
              <th>Description</th>
              <th>Price Per Item</th>
              <th>Item total</th>
            </tr>
            {receiptData.items.map((item) => {
              return <IndividualItem item={item} />;
            })}
          </table>
        )}
      </div>
      {receiptData.miscItems &&
        Object.keys(receiptData.miscItems).map((item) => {
          return (
            <p>
              {item}: {receiptData.miscItems[item]}
            </p>
          );
        })}
    </div>
  );
};

export default EditReceipt;
