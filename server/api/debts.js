const { Debt, Friend } = require('../db/model/index');
const router = require('express').Router();

// api/debts/displayDebts route
router.get('/displayDebts', async (req, res, next) => {
  try {
    const userId = 3; // replace with req.session.user and add if condition in case req.session.user is not defined

    const debts = await Debt.findAll({
      where: { userId: userId },
      include: [{ model: Friend }],
    });

    res.json(debts);
  } catch (err) {
    next(err);
  }
});

// api/debts/markPaid/:debtId route
router.put('/markPaid/:debtId', async (req, res, next) => {
  try {
    // const userId = req.session.user

    const debtId = parseInt(req.params.debtId);

    const debt = await Debt.findByPk(debtId);

    await debt.update({
      paid: !debt.paid,
    });

    const updatedDebts = await Debt.findAll({
      //   where: {
      //     // userId: userId,
      //   },
      //   include: [{ model: Friend }],
    });

    res.json(updatedDebts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
