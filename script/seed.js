const db = require('../server/db/db');
const { Friend, Debt } = require('../server/db/model/index');

const seed = async () => {
  try {
    console.log('database is seeding');

    await db.sync({ force: true });

    console.log('seeding completed!');
  } catch (err) {
    console.error('Database failed to seed');
    console.error(err);
    db.close();
  }
};

seed();

module.exports = seed;
