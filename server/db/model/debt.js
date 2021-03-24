const Sequelize = require('sequelize');
const db = require('../db');

const Debt = db.define('debt', {
  paid: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  balance: {
    type: Sequelize.INTEGER,
    validate: {
      allowNull: false,
      notEmpty: true,
    },
  },
});

module.exports = Debt;
