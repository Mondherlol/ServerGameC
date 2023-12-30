const fs = require("fs");

function getScores(limit) {
  // Charge les données depuis score.json
  const scoreData = fs.readFileSync("./data/score.json");
  const scores = JSON.parse(scoreData).scores;

  // Trie les scores par ordre décroissant
  const sortedScores = scores.sort((a, b) => b.score - a.score);

  // Si la limite est spécifiée, retourne seulement le nombre d'éléments demandé
  if (limit) {
    return sortedScores.slice(0, limit);
  }

  return sortedScores;
}

function addScore(playerName, newScore) {
  // Lire les données du fichier score.json
  const scoreData = fs.readFileSync("./data/score.json");
  const scores = JSON.parse(scoreData).scores;

  // Trouver le dernier ID dans le fichier JSON
  const lastPlayer = scores[scores.length - 1];
  const lastPlayerId = lastPlayer ? lastPlayer.id : 0;

  // Incrémenter le playerId
  const playerId = lastPlayerId + 1;

  // Obtenir la date et l'heure actuelles
  const currentDate = new Date();
  const dateTimeString = currentDate.toISOString(); // Format ISO

  // Ajouter le nouveau score avec le nouvel ID et la date/heure
  scores.push({
    id: playerId,
    name: playerName,
    score: newScore,
    dateTime: dateTimeString,
  });

  // Triez les scores par ordre décroissant
  const sortedScores = scores.sort((a, b) => b.score - a.score);

  // Mettez à jour le fichier score.json avec les nouveaux scores
  fs.writeFileSync(
    "./data/score.json",
    JSON.stringify({ scores: sortedScores }, null, 2)
  );
}
module.exports = {
  getScores,
  addScore,
};
