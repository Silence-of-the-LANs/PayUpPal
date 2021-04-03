const router = require('express').Router();
const sendInitialEmail = require('./email');
const sendTextMessage = require('./twilio');

// api/reminders/send
router.put('/send', async (req, res, next) => {
  try {
    const { total, friend, receipt, userInformation, checkboxes } = req.body;
    const alias = friend.name;
    const requesteePhone = friend.phone;
    const userName = userInformation.name;
    const requesteeEmail = friend.email;
    const eventName = receipt.eventName;
    const paypalLink = userInformation.paypalLink;
    const transactionDate = receipt.date;
    let debts = [];

    // Since the receipt information comes in differently from the FriendView
    // and ReceiptView components, we need make sure we send it in the same
    // format
    if (friend.items) {
      // This is the information from ReceiptView
      debts = friend.items;
    } else {
      // This is the information from FriendView
      debts = receipt.debts;
    }

    if (checkboxes.email) {
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
    }
    if (checkboxes.textMessage) {
      sendTextMessage(userName, total, eventName, paypalLink, requesteePhone);
    }
    res.send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
