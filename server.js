const express = require('express');
const morgan = require("morgan");
const cors = require("cors");
const { Server } = require("socket.io");
const scoreRoute = require('./routes/scoresRoute');
const gameRoute = require('./routes/gameRoute');
const {addEnemy}= require('./controllers/gameController');

const http = require('http');
const socketIo = require('socket.io');

const app = express();

app.use(cors({
    origin: '*',
    credentials: true,
  }));


app.use(morgan("dev"));

app.use('/scores/', scoreRoute);
app.use('/game/', gameRoute);


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


    // Ajoutez cette partie pour gérer les erreurs
    socket.on('error', (error) => {
      console.error('Erreur de connexion:', error);
    });

  socket.on('join-game', (playerName,gameCode) => {
    players[socket.id] = playerName;
    io.emit('player-joined', { id: socket.id, name: playerName });

    console.log(`${playerName} a rejoint la partie.`);
  });
  socket.on('add-enemy',(enemyCode,gameCode,playerName,selectedSide)=>{
    console.log('enemy ',enemyCode)
    console.log('game code',gameCode)
    console.log('selected side',selectedSide)
    addEnemy(enemyCode, gameCode, playerName,selectedSide);
  })

  socket.on('disconnect', () => {
    if (players[socket.id]) {
      const playerName = players[socket.id];
      delete players[socket.id];
      io.emit('player-left', { id: socket.id, name: playerName });

      console.log(`${playerName} a quitté la partie.`);
    }
  });
});

// Route ping pour effectuer un test
app.get('/ping', (req, res) => {
    res.status(200).send('Pong');
});

app.get('/players',(req,res) =>{
  res.status(200).send(players);
})

server.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});

