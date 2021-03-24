const Sequelize = require('sequelize');
const db = require('../db');

const Receipt = db.define('receipt', {
  imageUrl: {
    type: Sequelize.STRING,
  },
  eventName: {
    type: Sequelize.STRING,
  },
  date: {
    type: Sequelize.STRING,
  },
  tax: {
    type: Sequelize.INTEGER,
  },
  tip: {
    type: Sequelize.INTEGER,
  },
  total: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Receipt;
