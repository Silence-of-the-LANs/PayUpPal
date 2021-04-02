const router = require('express').Router();
const sendInitialEmail = require('./email');

// api/reminder/send
router.put('/send', async (req, res, next) => {
  try {
    console.log('The send route hit!');

    console.log(req.body);
    const { total, friend, receipt, userInformation } = req.body;
    const alias = friend.name;
    const userName = userInformation.name;
    const requesteeEmail = friend.email;
    const eventName = receipt.eventName;
    const paypalLink = userInformation.paypalLink;
    const transactionDate = receipt.date;
    const debts = receipt.debts;
    sendInitialEmail(
      alias,
      userName,
      requesteeEmail,
      eventName,
      paypalLink,
      transactionDate,
      debts,
      total
    );
    res.send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
