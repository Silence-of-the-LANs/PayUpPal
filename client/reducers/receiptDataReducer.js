export default (state = {}, action) => {
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
    case 'ADD_FRIENDS':
      let index = action.index;
      let friends = action.friends; // also with a balance
      newItemList = state.items;
      newItemList[index].friends = action.friends;
      return { ...state, items: [...state.items, newItemList] };
    case 'ASSIGN_FRIEND':
      newItemList = state.items;
      newItemList[action.itemIndex].friends = action.friends;
      return { ...state, items: newItemList };
    default:
      return state;
  }
};
