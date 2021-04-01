const router = require('express').Router();
const sendInitialEmail = require('./email');

// api/reminder/send
router.put('/send', async (req, res, next) => {
  try {
    console.log('The send route hit!');

    // console.log(req.body);
    const { total, friend, receipt } = req.body;
    // console.log('Your receipt is', receipt);
    // console.log('Your total is,', total);
    // console.log('Your friend is,', friend);
    // console.log('Your event was', receipt.eventName);
    const alias = friend.name;
    const requesteeEmail = friend.email;
    const eventName = receipt.eventName;

    res.send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
