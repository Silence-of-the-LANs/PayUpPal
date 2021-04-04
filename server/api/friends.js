const { Friend } = require('../db/model/index');
const router = require('express').Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// api/friends/displayFriends route
router.get('/displayFriends', async (req, res, next) => {
  try {
    if (!req.session.passport) {
      res.json('User is not logged in!');
    } else {
      const userId = req.session.passport.user;

      const friends = await Friend.findAll({
        where: {
          userId: userId,
          name: { [Op.notIn]: ['Myself'] },
        },
        order: [['name', 'asc']],
      });

      res.json(friends);
    }
  } catch (err) {
    next(err);
  }
});

// api/friends/displayFriends route
router.get('/displayListOfFriends', async (req, res, next) => {
  try {
    if (!req.session.passport) {
      res.json('User is not logged in!');
    } else {
      const userId = req.session.passport.user;

      const friends = await Friend.findAll({
        where: {
          userId: userId,
        },
        order: [['name', 'asc']],
      });

      res.json(friends);
    }
  } catch (err) {
    next(err);
  }
});

// api/friends/addFriend route
router.post('/addFriend', async (req, res, next) => {
  try {
    if (!req.session.passport) {
      res.json('User is not logged in!');
    } else {
      const name = req.body.name;
      const email = req.body.email || null;
      const phone = req.body.phone || null;
      const userId = req.session.passport.user;

      await Friend.findOrCreate({
        where: {
          name: name,
          email: email,
          phone: phone,
          userId: userId,
        },
      });

      const updatedFriends = await Friend.findAll({
        where: {
          userId: userId,
          name: { [Op.notIn]: ['Myself'] },
        },
        order: [['name', 'asc']],
      });

      res.json(updatedFriends);
    }
  } catch (err) {
    next(err);
  }
});

// api/friends/editFriend route
router.put('/editFriend', async (req, res, next) => {
  try {
    if (!req.session.passport) {
      res.json('User is not logged in!');
    } else {
      const name = req.body.name;
      const email = req.body.email || null;
      const phone = req.body.phone || null;
      const userId = req.session.passport.user;
      const friendId = req.body.id;

      await Friend.update(
        { name: name, email: email, phone: phone },
        {
          where: {
            id: friendId,
            userId: userId,
          },
        }
      );

      const updatedFriends = await Friend.findAll({
        where: {
          userId: userId,
          name: { [Op.notIn]: ['Myself'] },
        },
        order: [['name', 'asc']],
      });

      res.json(updatedFriends);
    }
  } catch (err) {
    next(err);
  }
});

// api/friends/removeFriend/:friendId route
router.put('/removeFriend/:friendId', async (req, res, next) => {
  try {
    if (!req.session.passport) {
      res.json('User is not logged in!');
    } else {
      const userId = req.session.passport.user;

      await Friend.update(
        { userId: null },
        {
          where: {
            id: req.params.friendId,
            userId: userId,
          },
        }
      );

      const updatedFriends = await Friend.findAll({
        where: {
          userId: userId,
          name: { [Op.notIn]: ['Myself'] },
        },
        order: [['name', 'asc']],
      });

      res.json(updatedFriends);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
