// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const { joinGame, leaveGame, getPlayers,getScores,addScore} = require('../controllers/playerController');

router.get('/ping', (req, res) => {
  res.status(200).send('Pong');
});

router.get('/players', (req, res) => {
  const players = getPlayers();
  res.status(200).send(players);
});
router.get('/scores', (req, res) => {
    const scores = getScores();
    console.log("scores",scores);
    res.status(200).json(scores);
  });

  router.post('/addScore/:playerId/:playerName/:newScore', (req, res) => {
    const { playerId,playerName, newScore } = req.params;
    const scores = addScore(playerId,playerName, parseInt(newScore, 10));
    res.status(200).json(scores);
  });
module.exports = router;
