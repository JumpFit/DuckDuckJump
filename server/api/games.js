const router = require('express').Router();
const {
  models: { Game, User },
} = require('../db');

module.exports = router;

// GET /api/games
router.get('/', async (req, res, next) => {
  try {
    res.json(
      await Game.findAll({
        include: [{ model: User, attributes: ['username'] }],
        order: [['score', 'DESC']],
      })
    );
  } catch (error) {
    next(error);
  }
});

// GET /api/games/:gameId
router.get('/:gameId', async (req, res, next) => {
  try {
    const game = await Game.findByPk(req.params.gameId, {
      include: [{ model: User, attributes: ['username'] }],
    });
    if (!game) {
      const error = new Error('No game found');
      error.status = 404;
      next(error);
    } else {
      res.json(game);
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/games
router.post('/', async (req, res, next) => {
  try {
    res.json(await Game.create(req.body));
  } catch (error) {
    next(error);
  }
});
