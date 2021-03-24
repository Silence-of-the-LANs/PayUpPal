const { User } = require('../db/model/index');
const router = require('express').Router();

// GET single user
// api/users/userId

router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
