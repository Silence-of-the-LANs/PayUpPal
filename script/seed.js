const db = require('../server/db/db');
const { Friend, Debt } = require('../server/db/model/index');
const listOfDebts = require('./listOfDebts');
const listOfFriends = require('./listOfFriends');

const seed = async () => {
  try {
    console.log('database is seeding');

    await db.sync({ force: true });

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

    // randomize friend-debt associations
    const allDebts = await Debt.findAll();

    await Promise.all(
      allDebts.map((debt) => {
        return debt.setFriend(
          Math.floor(Math.random() * listOfFriends.length + 1)
        );
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
