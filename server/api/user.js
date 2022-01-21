const router = require('express').router();
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
