import React, { useState, useReducer } from 'react';

// create a context (similar to when components call connect on redux))
export const ReceiptDataContext = React.createContext({});
// export const FinalizedReceiptDataContext = React.createContext([]);
export const receiptDataReducer = (state = {}, action) => {
  // need to declare all variables, switch cases are all in the same local env
  // so i can't declare multiple times
  let quantity;
  let pricePerItem;
  let totalPrice;
  let description;
  let itemIndex;
  let newItemList;
  switch (action.type) {
    case 'GET_ITEMS':
      return action.itemsInfo;
    case 'EDIT_ITEM':
      quantity = Number(action.updatedItem.quant);
      pricePerItem = Number(action.updatedItem.PPI);
      totalPrice = Number(action.updatedItem.TP);
      description = action.updatedItem.description;
      itemIndex = action.updatedItem.itemIndex;
      let itemDescription = { quantity, description, pricePerItem, totalPrice };
      // makes a copy of item list
      newItemList = state.items;
      // pinpoints the index we are changing, and replace it with new itemDescription
      newItemList[itemIndex] = itemDescription;
      return { ...state, items: newItemList };
    case 'EDIT_DESCRIPTION':
      description = action.description;
      itemIndex = action.itemIndex;
      newItemList = state.items;
      newItemList[itemIndex].description = description;
      return { ...state, items: newItemList };
    case 'DELETE_ITEM':
      itemIndex = action.itemIndex;
      newItemList = state.items.filter((items, i) => {
        return i === itemIndex ? false : true;
      });
      return { ...state, items: newItemList };
    case 'ADD_ITEM':
      if (!state.items) {
        return { ...state, items: [action.newItem] };
      }
      return { ...state, items: [...state.items, action.newItem] };
    default:
      return state;
  }
};

const Store = ({ children }) => {
  // similar to mapState & mapProps
  const [receiptDataState, dispatch] = useReducer(receiptDataReducer, {});
  return (
    // ReceiptDataContext gives all components access to receiptDataState
    <ReceiptDataContext.Provider value={[receiptDataState, dispatch]}>
      {children}
    </ReceiptDataContext.Provider>
  );
};

export default Store;
