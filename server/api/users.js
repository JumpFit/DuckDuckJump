const router = require('express').Router();
const {
  models: { User },
} = require('../db');
module.exports = router;

const authenticateUser = async (req, res, next) => {
  try {
    req.user = await User.findByToken(req.headers.authorization);
    next();
  } catch (error) {
    next(error);
  }
};

// router.put('', authenticateUser, (req, res, next) => {
//   try{
//     if (req.user)
//   }
// })

// GET /api/users/:userId/games
router.get('/:username/games', authenticateUser, async (req, res, next) => {
  try {
    const { username } = req.params;
    if (req.user.username !== username) {
      const error = new Error('Insufficient permission to view user data');
      error.status = 401;
      next(error);
    } else {
      res.json(req.user.games);
    }
  } catch (error) {
    next(error);
  }
});
