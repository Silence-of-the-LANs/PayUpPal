const Debt = require('./debt');
const Friend = require('./friend');

Debt.belongsTo(Friend);
Friend.hasMany(Debt);

module.exports = {
  Debt,
  Friend,
};
