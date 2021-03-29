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
      console.log(`The password for user ${req.body.email} was incorrect`);
      res
        .status(401)
        .send(
          'The username and/or password entered does not match the information in our records'
        );
    } else {
      // Logs the user in
      req.login(user, (err) => (err ? next(err) : res.json(user)));
    }
  } catch (err) {
    next(err);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    console.log('The body in signup is', req.body);
    if (req.body.password !== req.body.confirmPassword) {
      console.log('The entered passwords do not match. Please try again.');
      res
        .status(401)
        .send('The entered passwords do not match. Please try again.');
    } else {
      const user = await User.create(req.body);
      req.login(user, (err) => (err ? next(err) : res.json(user)));
    }
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res
        .status(401)
        .send(
          'A user with username already exists. Please choose another username.'
        );
    } else {
      next(err);
    }
  }
});

router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.json(req.body.session);
});

router.get('/me', async (req, res) => {
  // Since passport attaches the session user to the request object, we can
  // just respond with that to get the logged-in user
  res.json(req.user);
});

module.exports = router;
