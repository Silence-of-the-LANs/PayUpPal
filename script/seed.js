const db = require('../server/db/db');
const { Friend, Debt } = require('../server/db/model/index');
const listOfDebts = require('./listOfDebts');
const listOfFriends = require('./listOfFriends');

const seed = async () => {
  try {
    console.log('database is seeding');

    await db.sync({ force: true });

    await Promise.all(
      listOfFriends.map((friend) => {
        return Friend.create(friend);
      })
    );

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
