
const Game = require('../models/game');
const fs = require('fs');

const games = {};

function addGame(playerName, playerSocketId) {
    const gameCode = generateUniqueCode();
    const game = new Game(gameCode, playerName, playerSocketId);
    games[gameCode] = game;
    return gameCode;
}
  
function generateUniqueCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    let codeExists; // Declare codeExists outside the do-while loop

    // Generate an 4-character random code
    code = '';
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
  

module.exports = {
    generateUniqueCode,
    addGame,
    getGames,
    games
};
