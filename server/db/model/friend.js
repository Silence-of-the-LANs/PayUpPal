const Sequelize = require('sequelize');
const db = require('../db');

const Friend = db.define('friends', {
  alias: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: Sequelize.INTEGER,
    validate: {
      isInt: true,
      isNumeric: true,
      len: [10],
    },
  },
});

module.exports = Friend;
