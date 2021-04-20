export const formatTwoDecimals = (dollarAmount) => {
  return `$${(dollarAmount / 100).toFixed(2)}`;
};
