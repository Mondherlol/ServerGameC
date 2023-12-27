const express = require('express');
const morgan = require("morgan");
const cors = require("cors");
const { Server } = require("socket.io");
const scoreRoute = require('./routes/scoresRoute');
const gameRoute = require('./routes/gameRoute');
const {  addGame, games}= require('./controllers/gameController');

const http = require('http');
const socketIo = require('socket.io');

const app = express();

app.use(cors({
    origin: '*',
    credentials: true,
}));

app.use(morgan("dev"));

app.use('/scores/', scoreRoute);
app.use('/games/', gameRoute);


// Création du serveur HTTP
const server = http.createServer(app);

//Creation du serveur socket io
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


const port = process.env.PORT || 3001;


// Liste des joueurs
const players = {};

io.on('connection', (socket) => {
  console.log('Nouvelle connexion :', socket.id);


    // Gérer les erreurs
    socket.on('error', (error) => {
      console.error('Erreur de connexion:', error);
    });

// Quand un visiteur veut rejoindre une partie
  socket.on('join-game', (playerName,gameCode) => {
    players[socket.id] = playerName;
    io.emit('player-joined', { id: socket.id, name: playerName });
    console.log(`${playerName} a rejoint la partie.`);
  });

  socket.on('create-game', (playerName) => {
    gameCode = addGame(playerName, socket.id);
    console.log(playerName + " a creer une partie. Code Partie = "+gameCode);
    socket.emit('game-code', {gameCode});
  })

  socket.on('disconnect', () => {
    console.log(socket.id + " a fermé la connexion.");

    
    // Vérifier si le socket avait créé une partie
    const gameToDelete = Object.values(games).find((game) => game.playerSocketId === socket.id);

    if (gameToDelete) {
      // Supprimer la partie du tableau games
      delete games[gameToDelete.gameCode];
      console.log(`Partie ${gameToDelete.gameCode} supprimée car le joueur ${gameToDelete.playerName} a fermé la connexion.`);
    }

  });
});

// Route ping pour effectuer un test
app.get('/ping', (req, res) => {
    res.status(200).send('Pong');
});

app.get('/players',(req,res) =>{
  res.status(200).send(players);
});


// Route de test pour envoyer un message à tous les sockets
app.get('/send-message', (req, res) => {
  const message = "Hello, c'est le serveur Socket.IO!";
  
  // Envoyer le message à tous les sockets connectés
  io.emit('test-message', { message });

  res.status(200).send('Message envoyé avec succès.');
});


server.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});



