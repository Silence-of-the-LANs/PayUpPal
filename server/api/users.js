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

// POST single user
// api/users/
router.post('/', async (req, res, next) => {
  try {
    const user = await User.Create(req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// UPDATE single user
// api/users/userId
router.put('/:userId', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { userId } = req.params;

    const salt = User.generateSalt();
    const hashedPw = User.encryptPassword(password, salt);

    await User.update(
      { email, salt, password: hashedPw },
      { where: { id: userId } }
    );
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// DELETE single user
// api/users/userId
router.delete('/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    await user.destroy();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
