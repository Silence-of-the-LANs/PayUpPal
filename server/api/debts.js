const { Debt, Friend, Item, Receipt, User } = require('../db/model/index');
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

      let receipts = await Receipt.findAll({
        where: { userId: userId },
        include: [{ model: Debt }],
      });

      // create unique list of friends from the listed Debts

      const friends = await Friend.findAll({ where: { userId: userId } });

      let friendsObj = {};
      let itemsObj = {};

      friends.map((friend) => (friendsObj[friend.id] = friend.name));

      for (let i = 0; i < receipts.length; i++) {
        let receipt = receipts[i];

        let receiptItems = await Item.findAll({
          where: { receiptId: receipt.id },
        });

        receiptItems.forEach((item) => (itemsObj[item.id] = item.description));
      }

      receipts.forEach((receipt) => {
        receipt.debts.forEach((debt) => {
          debt.dataValues.friendName = friendsObj[debt.friendId];
        });
      });

      receipts.forEach((receipt) => {
        receipt.debts.forEach((debt) => {
          debt.dataValues.itemName = itemsObj[debt.itemId];
        });
      });

      res.json(receipts);
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
      // get our friends and their associated debts
      let friends = await Friend.findAll({
        where: { userId: userId },
      });

      for (let i = 0; i < friends.length; i++) {
        let currentFriend = friends[i];

        let receipts = await Receipt.findAll({
          where: { userId: userId },
          include: [
            {
              model: Debt,
              where: {
                userId: userId,
                friendId: {
                  [Op.in]: [currentFriend.id],
                },
              },
              include: [{ model: Item }],
            },
          ],
        });

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
      console.log('hitting route');
      const userId = req.session.passport.user;

      const debtId = parseInt(req.params.debtId);

      const debt = await Debt.findOne({
        where: { id: debtId, userId: userId },
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
      console.log('hitting receipt paid route');

      const userId = req.session.passport.user;
      const friendId = parseInt(req.params.friendId);
      const receiptId = parseInt(req.params.receiptId);
      console.log('friendId: ', friendId);
      console.log('receiptId: ', receiptId);

      const debts = await Debt.update(
        { paid: true },
        {
          where: { receiptId: receiptId, friendId: friendId, userId: userId },
        }
      );
      console.log(debts);

      res.send('Successfully paid bill');
    }
  } catch (err) {
    next(err);
  }
});

// api/debts/total route
router.get('/total', async (req, res, next) => {
  try {
    if (!req.session.passport) {
      res.json('User is not logged in!');
    } else {
      console.log('hitting total');
      const userId = req.session.passport.user;

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
        where: { userId: userId, paid: false },
      });

      let {
        totalBalance,
        totalProratedTip,
        totalProratedTax,
      } = debt[0].dataValues;

      let total =
        parseInt(totalBalance) +
        parseInt(totalProratedTip) +
        parseInt(totalProratedTax);

      res.send(`${total}`);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
