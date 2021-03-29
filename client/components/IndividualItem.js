import React, { useState, useContext, useEffect } from 'react';
import { ReceiptDataContext } from '../Store';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize='medium' />;
const checkedIcon = <CheckBoxIcon fontSize='medium' />;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'white',
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
  icon: {
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow:
      'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
  },
}));

const IndividualItem = (props) => {
  const classes = useStyles();
  // grab receipt data from store
  const [receiptDataState, dispatch] = useContext(ReceiptDataContext);

  // grab each item and index from parent prop
  const { item, itemIndex, splitEvenly, pool } = props;
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
    // e.target.value = $1.00
    // before it was = $0.99
    let PPI = parseFloat((e.target.value / quantity).toFixed(2));
    let TP = e.target.value;
    //
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
        <Autocomplete
          className={classes.root}
          noOptionsText='Please add some friends...'
          multiple
          // onChange={}
          id='autocomplete'
          options={pool}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          renderOption={(option, state) => (
            <React.Fragment>
              <Checkbox
                checkedIcon={<span className={classes.checkedIcon} />}
                icon={<span className={classes.icon} />}
                checked={state.selected}
                onChange={() => {
                  console.log('changing');
                }}
              />
              {option.name}
            </React.Fragment>
          )}
          style={{ width: 500 }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Friends List'
              placeholder='Select friends...'
            />
          )}
        />
      )}
    </tr>
  );
};

export default IndividualItem;
