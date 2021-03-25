import React, { useState, useEffect } from 'react';

const IndividualItem = (props) => {
  const { item } = props;
  const [quantity, setQuantity] = useState(item.quantity);
  const [description, setDescription] = useState(item.description);
  const [pricePerItem, setPricePerItem] = useState(item.pricePerItem);
  const [totalPrice, setTotalPrice] = useState(item.totalPrice);
  const changePricePerItem = (e) => {
    setPricePerItem(e.target.value);
    setTotalPrice(e.target.value * quantity);
  };
  const changeTotalPrice = (e) => {
    setTotalPrice(e.target.value);
    setPricePerItem(e.target.value / quantity);
  };
  const changeQuantity = (e) => {
    setQuantity(e.target.value);
    setTotalPrice(pricePerItem * e.target.value);
  };
  useEffect(() => {});
  const adjustPricePerItem = () => {
    setPricePerItem(totalPrice / quantity);
  };
  return (
    <tr className='item-input'>
      <td>
        <input
          type='number'
          min='1'
          value={quantity}
          onChange={changeQuantity}
        />
      </td>
      <td>
        <input
          type='text'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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
