const User = require('./user');
const Debt = require('./debt');
const Friend = require('./friend');
const Item = require('./item');
const Receipt = require('./receipt');

User.hasMany(Friend);
Friend.belongsTo(User);

Debt.belongsTo(Friend);
Friend.hasMany(Debt);

User.hasMany(Receipt);
Receipt.belongsTo(User);

Item.belongsTo(Receipt);
Receipt.hasMany(Item);

Debt.belongsTo(User);
User.hasMany(Debt);

Debt.belongsTo(Item);
Item.hasMany(Debt);

Debt.belongsTo(Receipt);
Receipt.hasMany(Debt);

module.exports = {
  User,
  Debt,
  Friend,
  Item,
  Receipt,
};
