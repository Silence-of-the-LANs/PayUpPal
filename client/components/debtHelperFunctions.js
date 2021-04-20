export const formatTwoDecimals = (dollarAmount) => {
  return `$${(dollarAmount / 100).toFixed(2)}`;
};

// export const getTotalPrice = (price, tip, tax) => {
//   return `$${((price + tip + tax) / 100).toFixed(2)}`;
// };
