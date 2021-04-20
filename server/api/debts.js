const { Debt, Friend, Item, Receipt } = require('../db/model/index');
const router = require('express').Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getDebtsByFriend = async (userId) => {
  // initialize our array that will be sent back
  let resArray = [];

  // get a list of the user's friend...
  let listOfFriends = await Friend.findAll({
    where: {
      userId: userId,
      name: { [Op.notIn]: ['Myself'] },
    },
    order: [['name', 'ASC']],
  });

  // and for each friend they have...
  for (let i = 0; i < listOfFriends.length; i++) {
    let currentFriend = listOfFriends[i];
    let total = await getTotal(userId, currentFriend.id);

    // find all the receipts which they are part of...
    let receipts = await Receipt.findAll({
      attributes: ['id', 'date', 'eventName'],
      where: { userId: userId },
      include: [
        {
          model: Debt,
          where: {
            userId: userId,
            friendId: currentFriend.id,
          },
          order: [['friendId', 'ASC']],
          include: [
            {
              model: Item,
              attributes: ['id', 'description'],
              order: [['id', 'ASC']],
            },
          ],
        },
      ],
      order: [['eventName', 'ASC']],
    });

    // and for each of those receipts, calculate the friend's total on each receipt and add it onto the receipt object
    for (let j = 0; j < receipts.length; j++) {
      let currentReceipt = receipts[j];
      const friendTotal = await getTotal(
        userId,
        currentFriend.id,
        currentReceipt.id
      );

      currentReceipt.dataValues.friendTotal = friendTotal;
    }

    // combine the friend's info, friend's total, and receipt info into an object and push onto our response array
    resArray.push({
      ...currentFriend.dataValues,
      total,
      receipts,
    });
  }

  return resArray;
};

const getTotal = async (userId, friendId = null, receiptId = null) => {
  // this is a helper function to calculate the total outstanding debts owed to the user based on what information we provide to it
  let whereCondition = {
    userId: userId,
    paid: false,
  };

  // if a receipt is passed in, we can add it to our where clause and calculate the total for that specific receipt as well
  if (friendId) {
    whereCondition.friendId = friendId;
  }

  if (receiptId) {
    whereCondition.receiptId = receiptId;
  }

  // query to find the total balance + tax + tip based on our where condition
  let currentFriendBalance = await Debt.findAll({
    attributes: [
      [Sequelize.fn('SUM', Sequelize.col('balance')), 'totalBalance'],
      [Sequelize.fn('SUM', Sequelize.col('proratedTip')), 'totalProratedTip'],
      [Sequelize.fn('SUM', Sequelize.col('proratedTax')), 'totalProratedTax'],
    ],
    where: whereCondition,
  });

  // destructure and sum the numbers up
  let {
    totalBalance,
    totalProratedTip,
    totalProratedTax,
  } = currentFriendBalance[0].dataValues;

  let total =
    parseInt(totalBalance) +
    parseInt(totalProratedTip) +
    parseInt(totalProratedTax);

  if (isNaN(total)) {
    total = 0;
  }

  // return the calculated total
  return total;
};

// api/debts/displayDebts/receipt route
router.get('/displayDebts/receipt', async (req, res, next) => {
  try {
    if (!req.session.passport) {
      res.json('User is not logged in!');
    } else {
      const userId = req.session.passport.user;
      let friendsBalances;
      let resArr = [];

      // find the friendId of the User so we can omit that id from our queries (and so it does not show on our debts page)
      const friendIdOfUser = await Friend.findOne({
        attributes: ['id'],
        where: { userId: userId, name: 'Myself' },
      });

      // find all the receipts for this user
      let receipts = await Receipt.findAll({
        where: { userId: userId },
        order: [['eventName', 'ASC']],
      });

      // for each receipt that belonged to the user
      for (let i = 0; i < receipts.length; i++) {
        let currentReceipt = receipts[i];
        currentReceipt.dataValues.friends = [];

        // get the total unpaid debts of the receipt
        currentReceipt.dataValues.receiptUnpaidTotal = await getTotal(
          userId,
          null,
          currentReceipt.id
        );

        // find the balances associated with the current receipt
        let friendsIdsOnReceipt = await Debt.findAll({
          attributes: [
            Sequelize.fn('DISTINCT', Sequelize.col('friendId')),
            'friendId',
          ],
          where: {
            receiptId: currentReceipt.id,
            friendId: { [Op.notIn]: [friendIdOfUser.id] },
          },
          order: [['friendId', 'ASC']],
        });

        // for each friend, find the items that belong to them on the current receipt
        for (let j = 0; j < friendsIdsOnReceipt.length; j++) {
          // get the friend's name based on their friendId
          let friendId = friendsIdsOnReceipt[j].friendId;
          let friendInfo = await Friend.findByPk(friendId);

          // attach the friends information onto the current receipt
          currentReceipt.dataValues.friends.push(friendInfo);

          // grab the friend's specific debts owed on eaach specific receipt
          friendInfo.dataValues.friendUnpaidTotal = await getTotal(
            userId,
            friendId,
            currentReceipt.id
          );

          // grab the balances associated with that friend
          friendsBalances = await Item.findAll({
            where: { receiptId: currentReceipt.id },
            include: [
              {
                model: Debt,
                where: { receiptId: currentReceipt.id, friendId: friendId },
                order: [['friendId', 'ASC']],
              },
            ],
            order: [['id', 'ASC']],
          });

          // attach that friend's balance information to the friend's info
          friendInfo.dataValues.items = friendsBalances;
        }

        // add the receipt (now containing our extra friend and friend's balance data) to our response array
        resArr.push(currentReceipt);
      }

      res.json(resArr);
    }
  } catch (err) {
    next(err);
  }
});

// api/debts/displayDebts/friend route
router.get('/displayDebts/friend', async (req, res, next) => {
  try {
    if (!req.session.passport) {
      res.json('User is not logged in!');
    } else {
      const userId = req.session.passport.user;
      // call our helper function which will calculate each friend's total, friend's total by receipt,  and give us the data structure we want
      const responseArray = await getDebtsByFriend(userId);

      res.send(responseArray);
    }
  } catch (err) {
    next(err);
  }
});

// api/debts/markReceiptPaid/:receiptId route
router.put('/markReceiptPaid/:receiptId/:friendId', async (req, res, next) => {
  try {
    if (!req.session.passport) {
      res.json('User is not logged in!');
    } else {
      const userId = req.session.passport.user;
      const friendId = parseInt(req.params.friendId);
      const receiptId = parseInt(req.params.receiptId);

      await Debt.update(
        { paid: true },
        {
          where: {
            receiptId: receiptId,
            friendId: friendId,
            userId: userId,
          },
        }
      );

      console.log('im hit');

      res.sendStatus(200);
    }
  } catch (err) {
    next(err);
  }
});

// api/debts/markReceiptPaid/:receiptId route
router.put(
  '/markReceiptUnpaid/:receiptId/:friendId',
  async (req, res, next) => {
    try {
      if (!req.session.passport) {
        res.json('User is not logged in!');
      } else {
        const userId = req.session.passport.user;
        const friendId = parseInt(req.params.friendId);
        const receiptId = parseInt(req.params.receiptId);

        await Debt.update(
          { paid: false },
          {
            where: {
              receiptId: receiptId,
              friendId: friendId,
              userId: userId,
            },
          }
        );

        res.sendStatus(200);
      }
    } catch (err) {
      next(err);
    }
  }
);

// api/debts/total route
router.get('/total', async (req, res, next) => {
  try {
    if (!req.session.passport) {
      res.json('User is not logged in!');
    } else {
      const userId = req.session.passport.user;

      // grab the friendId that belongs to the user so we can omit their own debt to themselves
      const friendIdOfUser = await Friend.findOne({
        where: { userId: userId, name: 'Myself' },
      });

      // query and sum up the balances, tips and taxs that is owed to the user
      const debt = await Debt.findAll({
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('balance')), 'totalBalance'],
          [
            Sequelize.fn('SUM', Sequelize.col('proratedTip')),
            'totalProratedTip',
          ],
          [
            Sequelize.fn('SUM', Sequelize.col('proratedTax')),
            'totalProratedTax',
          ],
        ],
        where: {
          userId: userId,
          paid: false,
          friendId: { [Op.notIn]: [friendIdOfUser.id] },
        },
      });

      let {
        totalBalance,
        totalProratedTip,
        totalProratedTax,
      } = debt[0].dataValues;

      // sum it up and send it as our response
      let total =
        parseInt(totalBalance) +
        parseInt(totalProratedTip) +
        parseInt(totalProratedTax);

      if (isNaN(total)) {
        total = 0;
      }

      // ... will break if we do not send it in string format
      res.send(`${total}`);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
