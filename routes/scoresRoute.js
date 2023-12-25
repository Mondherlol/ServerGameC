const express = require('express');
const router = express.Router();
const { joinGame, leaveGame, getPlayers,getScores,addScore} = require('../controllers/playerController');

router.get('/', (req, res) => {
  const limit = req.query.limit; // Récupère la valeur du paramètre "limit" depuis l'URL
  const scores = getScores(limit);
  res.status(200).json(scores);
});


  router.post('/:playerName/:newScore', (req, res) => {
    const { playerName, newScore } = req.params;

    // Vérifier si le score est un nombre valide
    if (isNaN(newScore) || newScore < 0) {
      res.status(400).json({ error: 'Le score doit être un nombre entier positif.' });
      return;
    }

    // Appeler la fonction addScore pour ajouter le score
    addScore(playerName, parseInt(newScore, 10));

    // Renvoyer une réponse avec le code approprié et le tableau de scores
    res.status(201).json({ message: 'Score ajouté avec succès.' });
  });
module.exports = router;
