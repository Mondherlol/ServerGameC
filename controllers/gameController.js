const Game = require("../models/game");
const fs = require("fs");

const games = [
  {
    gameCode: "TEST",
    playerName: " TEST",
    playerSocketId: "PtXoJZ6h1jXnJ5lNAAAH",
    isPlaying: false,
    visitors: [],
    score: 0,
    createdAt: "2023-12-28T16:00:41.552Z",
  },
];

function addGame(playerName, playerSocketId) {
  const gameCode = generateUniqueCode();
  const game = new Game(gameCode, playerName, playerSocketId);
  games[gameCode] = game;
  return gameCode;
}

function generateUniqueCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code;
  let codeExists; // Declare codeExists outside the do-while loop

  // Generate an 4-character random code
  code = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  // Check if the generated code already exists in games
  //  codeExists = games.some((game) => game.code === code);

  return code;
}

function getGames() {
  // Convertir le tableau games en tableau d'objets pour l'envoyer comme réponse JSON
  const gamesList = Object.values(games);
  return gamesList;
}

function addPlayerToGame(username, socketId, codeGame) {
  const gameToJoin = Object.values(games).find(
    (game) => game.gameCode.toUpperCase() === codeGame.toUpperCase()
  );

  if (gameToJoin) {
    // Vérifier si le visiteur n'est pas déjà dans la partie
    const isVisitorInGame = gameToJoin.visitors.some(
      (visitor) => visitor.socketId === socketId
    );
    if (!isVisitorInGame) {
      gameToJoin.visitors.push({
        username: username,
        socketId: socketId,
        score: 0,
        joinedAt: new Date(),
      });
      return gameToJoin;
    } else {
      console.log("Le joueur est déjà dans la partie.");
    }
  } else {
    console.log("Partie non existante.");
  }

  return null;
}

function getGameByPlayerSocketId(playerSocketId) {
  const game = Object.values(games).find(
    (game) => game.playerSocketId === playerSocketId
  );
  return game || null;
}

function getGameByGameCode(gameCode) {
  if (gameCode) {
    const game = Object.values(games).find(
      (game) => game.gameCode.toUpperCase() === gameCode.toUpperCase()
    );
    return game;
  }
  return null;
}

function getVisitorBySocketIdAndGameCode(socketId, gameCode) {
  const game = getGameByGameCode(gameCode);

  if (game) {
    const visitor = game.visitors.find(
      (visitor) => visitor.socketId === socketId
    );

    return visitor || null;
  } else {
    console.log("Partie non existante.");
    return null;
  }
}

function changeIsPlaying(playerSocketId, isPlaying) {
  const game = getGameByPlayerSocketId(playerSocketId);

  if (game) {
    game.isPlaying = isPlaying;
    return game;
  } else {
    console.log("Partie non trouvée.");
    return null;
  }
}

function addScoreToVisitor(socketId, gameCode) {
  const game = getGameByGameCode(gameCode);

  if (game) {
    const visitor = game.visitors.find(
      (visitor) => visitor.socketId === socketId
    );

    if (visitor) {
      visitor.score += 1; // Augmenter le score du visiteur de 1
      console.log(`Score de ${visitor.username} augmenté à ${visitor.score}`);
      return game;
    } else {
      console.log("Visiteur non trouvé dans la partie.");
      return null;
    }
  } else {
    console.log("Partie non existante.");
    return null;
  }
}

module.exports = {
  generateUniqueCode,
  addGame,
  getGames,
  addPlayerToGame,
  games,
  getGameByPlayerSocketId,
  changeIsPlaying,
  getGameByGameCode,
  getVisitorBySocketIdAndGameCode,
  addScoreToVisitor,
};
