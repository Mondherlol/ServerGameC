// controllers/playerController.js
const Player = require('../models/player');
const fs = require('fs');

function getScores() {
    // Charge les données depuis score.json
    const scoreData = fs.readFileSync('./data/score.json');
    const scores = JSON.parse(scoreData).players;
  
    // Trie les scores par ordre décroissant
    const sortedScores = scores.sort((a, b) => b.score - a.score);
  
    return sortedScores;
  }

  function addScore(playerId,playerName, newScore) {
    const scoreData = fs.readFileSync('./data/score.json');
    const scores = JSON.parse(scoreData).players;
  
    const playerIndex = scores.findIndex((player) => player.id === playerId);
  
    if (playerIndex !== -1) {
      // Le joueur existe, vérifiez si le nouveau score est supérieur
      if (newScore > scores[playerIndex].score) {
        scores[playerIndex].score = newScore;
      }
    } else {
      // Le joueur n'existe pas, ajoutez-le
      scores.push({ id: playerId,name:playerName, score: newScore });
    }
  
    // Triez les scores par ordre décroissant
    const sortedScores = scores.sort((a, b) => b.score - a.score);
  
    // Mettez à jour le fichier score.json avec les nouveaux scores
    fs.writeFileSync('./data/score.json', JSON.stringify({ players: sortedScores }));
  
    return sortedScores;
  }
module.exports = {
  getScores,
  addScore
};
