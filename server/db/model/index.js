const User = require('./user');
const Debt = require('./debt');
const Friend = require('./friend');

User.hasMany(Friend);
Friend.belongsTo(User);

Debt.belongsTo(Friend);
Friend.hasMany(Debt);

Debt.belongsTo(User);
User.hasMany(Debt);

module.exports = {
  User,
  Debt,
  Friend,
};
