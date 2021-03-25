import React, { useState, useContext, useEffect } from 'react';
import { ReceiptDataContext } from '../Store';

const IndividualItem = (props) => {
  const [receiptDataState, dispatch] = useContext(ReceiptDataContext);

  const { item, itemIndex } = props;
  const [quantity, setQuantity] = useState(item.quantity);
  const [description, setDescription] = useState(item.description);
  const [pricePerItem, setPricePerItem] = useState(item.pricePerItem);
  const [totalPrice, setTotalPrice] = useState(item.totalPrice);
  const changePricePerItem = (e) => {
    setPricePerItem(e.target.value);
    setTotalPrice(e.target.value * quantity);
    let PPI = e.target.value;
    let TP = e.target.value * quantity;
    updateItem(PPI, TP, quantity);
  };
  const changeTotalPrice = (e) => {
    setTotalPrice(e.target.value);
    setPricePerItem(e.target.value / quantity);
    let PPI = e.target.value / quantity;
    let TP = e.target.value;
    updateItem(PPI, TP, quantity);
  };
  const changeQuantity = (e) => {
    setQuantity(e.target.value);
    setTotalPrice(pricePerItem * e.target.value);
    let TP = pricePerItem * e.target.value;
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
    </tr>
  );
};

export default IndividualItem;
