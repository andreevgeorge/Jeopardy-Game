const express = require('express');
const router = express.Router();
const { getTopics, getQuestions } = require('../controllers/indexController');
const { Game } = require('../db/models');

router.get('/topics', getTopics);
router.get('/questions', getQuestions);
router.post('/gameId', async (req, res) => {
  const gameId = await Game.create({
    user_id: req.body.userId,
    completed: false
  });

  res.json(gameId.id);
});

router.post('/gameData', async (req, res) => {
  const gameData = await Game.findOne({ where: { id: req.body.gameId }, raw: true });

  gameData.completed = true;
  gameData.total_score = req.body.points;

  await gameData.save();

  res.end();
});

module.exports = router;

