const db = require('../server/db/db');
const {
  User,
  Friend,
  Debt,
  Receipt,
  Item,
} = require('../server/db/model/index');
const listOfDebts = require('./listOfDebts');
const listOfFriends = require('./listOfFriends');
const listOfUsers = require('./listOfUsers');
const receipt1 = require('./listOfReceiptWithItems');

const seed = async () => {
  try {
    console.log('database is seeding');

    await db.sync({ force: true });

    // populate users into the database
    await Promise.all(
      listOfUsers.map((user) => {
        return User.create(user);
      })
    );

    // populate friends into the database
    await Promise.all(
      listOfFriends.map((friend) => {
        return Friend.create(friend);
      })
    );

    // populate debts into the databsae
    await Promise.all(
      listOfDebts.map((debt) => {
        return Debt.create(debt);
      })
    );

    // adding a test user, receipt, and items into database
    const tommyUser = await User.findByPk(4);
    const testReceipt = await Receipt.create(receipt1);
    await tommyUser.addReceipt(testReceipt);
    await Promise.all(
      receipt1.items.map(async (singleItem) => {
        let newItem = await Item.create(singleItem);
        await testReceipt.addItem(newItem);
        return newItem;
      })
    );

    console.log('seeding completed!');
  } catch (err) {
    console.error('Database failed to seed');
    console.error(err);
    db.close();
  }
};

seed();

module.exports = seed;
