const express = require('express');
const morgan = require("morgan");
const cors = require("cors");
const { Server } = require("socket.io");


const http = require('http');
const socketIo = require('socket.io');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Remplacez par l'URL de votre application React
    credentials: true,
  }));


app.use(morgan("dev"));



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
    res.status(200).send('Pong');
  });

app.get('/players',(req,res) =>{
    res.status(200).send(players);
})
server.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
