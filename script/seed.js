const db = require('../server/db/db');
const { User, Friend, Debt } = require('../server/db/model/index');
const listOfDebts = require('./listOfDebts');
const listOfFriends = require('./listOfFriends');
const listOfUsers = require('./listOfUsers');

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

    console.log('seeding completed!');
  } catch (err) {
    console.error('Database failed to seed');
    console.error(err);
    db.close();
  }
};

seed();

module.exports = seed;
