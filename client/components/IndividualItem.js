import React, { useState, useContext, useEffect } from 'react';
import { ReceiptDataContext } from '../Store';

const IndividualItem = (props) => {
  // grab receipt data from store
  const [receiptDataState, dispatch] = useContext(ReceiptDataContext);

  // grab each item and index from parent prop
  const { item, itemIndex, splitEvenly } = props;
  // set quantity, description, pricePerItem, and totalPrice to state
  const [quantity, setQuantity] = useState(item.quantity);
  const [description, setDescription] = useState(item.description);
  const [pricePerItem, setPricePerItem] = useState(item.pricePerItem);
  const [totalPrice, setTotalPrice] = useState(item.totalPrice);
  // event handlers for each change of users' input
  const changePricePerItem = (e) => {
    setPricePerItem(e.target.value);
    setTotalPrice(parseFloat((e.target.value * quantity).toFixed(2)));
    let PPI = e.target.value;
    let TP = parseFloat((e.target.value * quantity).toFixed(2));
    updateItem(PPI, TP, quantity);
  };
  const changeTotalPrice = (e) => {
    setTotalPrice(e.target.value);
    setPricePerItem(parseFloat((e.target.value / quantity).toFixed(2)));
    let PPI = parseFloat((e.target.value / quantity).toFixed(2));
    let TP = e.target.value;
    updateItem(PPI, TP, quantity);
  };
  const changeQuantity = (e) => {
    setQuantity(e.target.value);
    setTotalPrice(parseFloat((pricePerItem * e.target.value).toFixed(2)));
    let TP = parseFloat((pricePerItem * e.target.value).toFixed(2));
    let quant = e.target.value;
    updateItem(pricePerItem, TP, quant);
  };
  // dispatches updated individual item to store
  const updateItem = (PPI, TP, quant) => {
    let updatedItem = {
      quant,
      description,
      PPI,
      TP,
      itemIndex,
    };
    dispatch({ type: 'EDIT_ITEM', updatedItem });
  };
  // dispatches updated description for individual item to store
  const editDescription = (e) => {
    setDescription(e.target.value);
    dispatch({
      type: 'EDIT_DESCRIPTION',
      description: e.target.value,
      itemIndex,
    });
  };
  const deleteItem = () => {
    dispatch({ type: 'DELETE_ITEM', itemIndex });
  };
  return (
    <tr className='item-input'>
      <button type='button' onClick={deleteItem}>
        X
      </button>
      <td>
        <input
          type='number'
          min='1'
          value={quantity}
          onChange={changeQuantity}
        />
      </td>
      <td>
        <input type='text' value={description} onChange={editDescription} />
      </td>
      <td>
        <input
          type='number'
          min='0'
          step='0.01'
          value={pricePerItem}
          onChange={changePricePerItem}
        />
      </td>
      <td>
        <input
          type='number'
          min='0'
          step='0.01'
          value={totalPrice}
          onChange={changeTotalPrice}
        />
      </td>
      {!splitEvenly && (
        <td>
          <input type='text' />
        </td>
      )}
    </tr>
  );
};

export default IndividualItem;
