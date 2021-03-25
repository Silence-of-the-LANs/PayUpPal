const router = require('express').Router();
const { User } = require('../db/model');

router.put('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      // Here we give a specific error message to ourselves for diagnostic
      // purposes but give an ambiguous message to the user for additional
      // security (makes it harder to bruteforce)
      console.log(`A user with the email ${req.body.email} was not found.`);
      res
        .status(401)
        .send(
          'The username and/or password entered does not match the information in our records'
        );
    } else if (!user.correctPassword(req.body.password)) {
      console.log(`The password for user ${req.body.email} was inccorect`);
      res
        .status(401)
        .send(
          'The username and/or password entered does not match the information in our records'
        );
    } else {
      req.login(user, (err) => (err ? next(err) : res.json(user)));
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
