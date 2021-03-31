const User = require('./user');
const Debt = require('./debt');
const Friend = require('./friend');
const Item = require('./item');
const Receipt = require('./receipt');

User.hasMany(Friend);
Friend.belongsTo(User);

Debt.belongsTo(Friend, {
  onDelete: 'cascade',
  foreignKeyConstraint: true,
});
Friend.hasMany(Debt);

User.hasMany(Receipt);
Receipt.belongsTo(User);

Item.belongsTo(Receipt, {
  onDelete: 'cascade',
  foreignKeyConstraint: true,
});
Receipt.hasMany(Item);

Debt.belongsTo(User);
User.hasMany(Debt);

Debt.belongsTo(Item, {
  onDelete: 'cascade',
  foreignKeyConstraint: true,
});
Item.hasMany(Debt);

Debt.belongsTo(Receipt, {
  onDelete: 'cascade',
  foreignKeyConstraint: true,
});
Receipt.hasMany(Debt);

module.exports = {
  User,
  Debt,
  Friend,
  Item,
  Receipt,
};
