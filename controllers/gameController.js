
const Game = require('../models/game');
const fs = require('fs');

function getGamesCodes() {
    // Charger les codes des games  depuis game.json
    const gamesData = fs.readFileSync('./data/game.json');
    const games = JSON.parse(gamesData).games;

    const gameCodes = games.map(game => game.code);

    return gameCodes;
}
function getGames() {
    // Charger les codes des games  depuis game.json
    const gamesData = fs.readFileSync('./data/game.json');
    const games = JSON.parse(gamesData).games;
    return games;
}

function addGame(code, playerName, playerId) {
    const gamesData = fs.readFileSync('./data/game.json');
    const games = JSON.parse(gamesData).games;

    let gameIndex = games.findIndex((game) => game.code === code);

    if (gameIndex !== -1) {
        // Le game existe
        console.log("game code existe deja !")
    } else {
        // Le game n'existe pas, ajoutez-le
        games.push({ code: code, score: 0, playerName: playerName, playerId: playerId, nbVisiteurs: 0 });
    }


    // Mettez à jour le fichier game.json avec les nouveaux games
    fs.writeFileSync('./data/game.json', JSON.stringify({ games: games }));

    return games;
}

function deleteGame(code) {
    const gamesData = fs.readFileSync('./data/game.json');
    const games = JSON.parse(gamesData).games;
    let gameIndex = games.find((game) => {
        return game.code === code;
    });
    console.log('game index', gameIndex)
    if (gameIndex != undefined  ) {
        // Le game existe
        games.splice(gameIndex, 1);

        // Save the updated data back to game.json
        fs.writeFileSync('./data/game.json', JSON.stringify({ games }));

        return `Game with code ${code} deleted successfully`;
    } else {
        // Le game n'existe pas, ajoutez-le
        return `Game with code ${code} not found`;
    }


}
function generateUniqueCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnoprstuvwxyz0123456789';
    let code;
    let codeExists; // Declare codeExists outside the do-while loop
    const gamesData = fs.readFileSync('./data/game.json');
    const games = JSON.parse(gamesData).games;

    do {
        // Generate an 8-character random code
        code = '';
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }

        // Check if the generated code already exists in games
         codeExists = games.some((game) => game.code === code);

    } while (codeExists);

    return code;
}




module.exports = {
    getGamesCodes,
    addGame,
    getGames,
    deleteGame,
    generateUniqueCode
};
