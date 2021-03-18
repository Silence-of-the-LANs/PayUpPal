const router = require('express').Router();

router.get('/', (req, res, next) => {
  try {
    res.send('hello from google api');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
