import React, { useState, useReducer } from 'react';

export const ReceiptDataContext = React.createContext({});
// export const FinalizedReceiptDataContext = React.createContext([]);
export const receiptDataReducer = (state = {}, action) => {
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
      newItemList = state.items;
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
  // itemList presents is the global state for items
  const [receiptDataState, dispatch] = useReducer(receiptDataReducer, {});
  return (
    <ReceiptDataContext.Provider value={[receiptDataState, dispatch]}>
      {children}
    </ReceiptDataContext.Provider>
  );
};

export default Store;
