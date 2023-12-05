const express = require('express');
const morgan = require("morgan");
const cors = require("cors");
const { Server } = require("socket.io");
const scoreRoute = require('./routes/scoresRoute');
const gameRoute = require('./routes/gameRoute');

const http = require('http');
const socketIo = require('socket.io');

const app = express();

app.use(cors({
    origin: '*',


     // Remplacez par l'URL de votre application React
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

  socket.on('join-game', (playerName) => {
    players[socket.id] = playerName;
    io.emit('player-joined', { id: socket.id, name: playerName });

    console.log(`${playerName} a rejoint la partie.`);
  });

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
  setTimeout(() => {
    res.status(200).send('Pong');
  }, 1000); // Délai d'une seconde
});

app.get('/players',(req,res) =>{
  res.status(200).send(players);
})

server.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});

