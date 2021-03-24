const Sequelize = require('sequelize');
const db = require('../db');

const Item = db.define('item', {
  quantity: {
    type: Sequelize.INTEGER,
    validate: {
      min: 0,
    },
  },
  description: {
    type: Sequelize.STRING,
  },
  pricePerItem: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Item;
