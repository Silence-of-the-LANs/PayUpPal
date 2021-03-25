const Debt = require('./debt');
const Friend = require('./friend');
const Item = require('./item');
const Receipt = require('./receipt');

Debt.belongsTo(Friend);
Friend.hasMany(Debt);

Item.belongsTo(Receipt);
Receipt.hasMany(Item);
module.exports = {
  Debt,
  Friend,
  Item,
  Receipt,
};
