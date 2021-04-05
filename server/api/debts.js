const { Debt, Friend, Item, Receipt } = require('../db/model/index');
const router = require('express').Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// api/debts/displayDebts/receipt route
router.get('/displayDebts/receipt', async (req, res, next) => {
  try {
    if (!req.session.passport) {
      res.json('User is not logged in!');
    } else {
      const userId = req.session.passport.user;
      let friendsBalances;
      let resArr = [];

      const friendIdOfUser = await Friend.findOne({
        where: { userId: userId, name: 'Myself' },
      });

      // find all the receipts for this user
      let receipts = await Receipt.findAll({
        where: {
          userId: userId,
        },
        order: [['eventName', 'ASC']],
      });

      let receiptItems;

      // for each receipt that belonged to the user
      for (let i = 0; i < receipts.length; i++) {
        let currentReceipt = receipts[i];
        currentReceipt.dataValues.friends = [];

        // find the balances associated with the current receipt
        receiptItems = await Debt.findAll({
          where: {
            receiptId: currentReceipt.id,
            friendId: { [Op.notIn]: [friendIdOfUser.id] },
          },
          order: [['friendId', 'ASC']],
        });

        // store the each friend's id found on this receipt to use for querying
        let friendsOnReceipt = [];

        receiptItems.forEach((item) => {
          if (!friendsOnReceipt.includes(item.friendId)) {
            friendsOnReceipt.push(item.friendId);
          }
        });

        // for each friend, find the items that belong to them on the current receipt
        for (let j = 0; j < friendsOnReceipt.length; j++) {
          let friendId = friendsOnReceipt[j];
          let friendInfo = await Friend.findByPk(friendId);

          // attach the friends information onto the current receipt
          currentReceipt.dataValues.friends.push(friendInfo);

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

// api/debts/displayDebts/person route
router.get('/displayDebts/person', async (req, res, next) => {
  try {
    if (!req.session.passport) {
      res.json('User is not logged in!');
    } else {
      const userId = req.session.passport.user;
      let resArray = [];

      // get the user's friends and their associated debts
      let friends = await Friend.findAll({
        where: {
          userId: userId,
          name: { [Op.notIn]: ['Myself'] },
        },
        order: [['name', 'ASC']],
      });

      // for each friend they have...
      for (let i = 0; i < friends.length; i++) {
        let currentFriend = friends[i];

        // find the receipts which they are part of...
        let receipts = await Receipt.findAll({
          where: { userId: userId },
          include: [
            {
              model: Debt,
              where: {
                userId: userId,
                friendId: currentFriend.id,
              },
              order: [['friendId', 'ASC']],
              include: [{ model: Item, order: [['id', 'ASC']] }],
            },
          ],
          order: [['eventName', 'ASC']],
        });

        // combine the friend's info and receipt info into an object and push add it to our response
        resArray.push({ currentFriend, receipts });
      }

      res.send(resArray);
    }
  } catch (err) {
    next(err);
  }
});

// api/debts/markPaid/:debtId route
router.put('/markPaid/:debtId', async (req, res, next) => {
  try {
    if (!req.session.passport) {
      res.json('User is not logged in!');
    } else {
      const userId = req.session.passport.user;

      const debtId = parseInt(req.params.debtId);

      const debt = await Debt.findOne({
        where: { id: debtId, userId: userId },
        order: [['friendId', 'ASC']],
      });

      await debt.update({
        paid: !debt.paid,
      });

      res.send('Successfully paid item');
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

      const debts = await Debt.update(
        {
          paid: true,
        },
        {
          where: {
            receiptId: receiptId,
            friendId: friendId,
            userId: userId,
          },
        }
      );

      res.send('Successfully marked as paid');
    }
  } catch (err) {
    next(err);
  }
});

// api/debts/getDebts/:receiptId/:friendId route
router.get('/getDebts/:receiptId/:friendId', async (req, res, next) => {
  try {
    if (!req.session.passport) {
      res.json('User is not logged in!');
    } else {
      const userId = req.session.passport.user;
      const friendId = parseInt(req.params.friendId);
      const receiptId = parseInt(req.params.receiptId);

      const debts = await Debt.findAll({
        where: { receiptId: receiptId, friendId: friendId, userId: userId },
      });

      res.send(debts);
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

        const debts = await Debt.update(
          {
            paid: false,
          },
          {
            where: {
              receiptId: receiptId,
              friendId: friendId,
              userId: userId,
            },
          }
        );

        res.send('Successfully marked as unpaid');
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

      const friendIdOfUser = await Friend.findOne({
        where: { userId: userId, name: 'Myself' },
      });

      // add up the balance, tip and tax in the Debt model for that user
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

      // add it up and send it as our response
      let total =
        parseInt(totalBalance) +
        parseInt(totalProratedTip) +
        parseInt(totalProratedTax);

      if (isNaN(total)) {
        total = 0;
      }

      // ... will break if we do not send it in this format
      res.send(`${total}`);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
