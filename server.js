const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { Server } = require("socket.io");
const scoreRoute = require("./routes/scoresRoute");
const gameRoute = require("./routes/gameRoute");
const {
  addPlayerToGame,
  addGame,
  games,
  getGameByPlayerSocketId,
  changeIsPlaying,
  getVisitorBySocketIdAndGameCode,
  getGameByGameCode,
  addScoreToVisitor,
} = require("./controllers/gameController");

const http = require("http");
const socketIo = require("socket.io");

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use("/scores/", scoreRoute);
app.use("/games/", gameRoute);

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

io.on("connection", (socket) => {
  console.log("Nouvelle connexion :", socket.id);
  // Gérer les erreurs
  socket.on("error", (error) => {
    console.error("Erreur de connexion:", error);
  });

  // Quand un visiteur veut rejoindre une partie
  socket.on("join-game", (visitorName, gameCode) => {
    gameToJoin = addPlayerToGame(visitorName, socket.id, gameCode);
    if (gameToJoin) {
      console.log(
        `${visitorName} a rejoint la partie de ${gameToJoin.playerName}.`
      );
      socket.emit("joined-game-success", gameToJoin);
      // Émettre un message uniquement au socket correspondant à gameToJoin.playerSocketId
      console.log(
        "socket partie a rejoindre = '" + gameToJoin.playerSocketId + "'"
      );
      io.to(gameToJoin.playerSocketId.trim()).emit("visitor-joined", {
        visitorName: visitorName,
        socketId: socket.id,
      });

      // Prevenir les autres visiteurs
      gameToJoin.visitors.forEach((visitor) => {
        io.to(visitor.socketId.trim()).emit("game-changed", gameToJoin);
      });
    }
  });

  socket.on("create-game", (playerName) => {
    gameCode = addGame(playerName, socket.id);
    console.log(playerName + " a creer une partie. Code Partie = " + gameCode);
    socket.emit("game-code", { gameCode });
    io.emit("new-game-created");
  });

  socket.on("game-statut-changed", (data) => {
    const { game_statut, socket_id_killer } = data;
    let game = changeIsPlaying(socket.id, game_statut);
    if (game) {
      // Verifier si il a été tuer par un visiteur
      if (socket_id_killer) {
        // Augmenter son score
        game = addScoreToVisitor(socket_id_killer, game.gameCode);
      }
      // Prevenir les visiteurs
      game.visitors.forEach((visitor) => {
        io.to(visitor.socketId.trim()).emit("game-changed", game);
      });
      io.emit("new-game-created");
    }
  });

  socket.on("add-enemy", (enemyType, gameCode) => {
    const game = getGameByGameCode(gameCode);
    const visitor = getVisitorBySocketIdAndGameCode(socket.id, gameCode);
    // if (visitor && game)
    //   console.log(
    //     `${visitor.username} a envoyer l'ennemi ${enemyType} a la partie de ${game.playerName}`
    //   );

    // Envoyer l'ennemi au joueur
    io.to(game.playerSocketId.trim()).emit("new-enemy", {
      enemyType: enemyType,
      visitorName: visitor.username,
      socketId: socket.id,
    });

    // Informer les autres joueurs
  });

  socket.on("disconnect", () => {
    console.log(socket.id + " a fermé la connexion.");

    // Vérifier si le socket avait créé une partie
    const gameToDelete = Object.values(games).find(
      (game) => game.playerSocketId === socket.id
    );

    if (gameToDelete) {
      //Prevenir les visiteurs dans la partie
      gameToDelete.visitors.forEach((visitor) => {
        io.to(visitor.socketId.trim()).emit("closed-game");
      });
      // Supprimer la partie du tableau games
      delete games[gameToDelete.gameCode];
      console.log(
        `Partie ${gameToDelete.gameCode} supprimée car le joueur ${gameToDelete.playerName} a fermé la connexion.`
      );
      io.emit("game-was-removed");
    } else {
      // Vérifier si le socket était un visiteur dans une partie
      Object.values(games).forEach((game) => {
        const visitorIndex = game.visitors.findIndex(
          (visitor) => visitor.socketId === socket.id
        );

        if (visitorIndex !== -1) {
          // Retirer le visiteur de la partie
          const removedVisitor = game.visitors.splice(visitorIndex, 1)[0];
          console.log(
            `Le visiteur ${removedVisitor.username} a quitté la partie  de ${game.playerName}.`
          );
          // Prevenir le joueur du départ du visiteur
          io.to(game.playerSocketId.trim()).emit("visitor-leaved", {
            visitorName: removedVisitor.username,
            socketId: socket.id,
          });

          // Prevenir les autres visiteurs
          game.visitors.forEach((visitor) => {
            io.to(visitor.socketId.trim()).emit("game-changed", game);
          });
        }
      });
    }
  });
});

// Route ping pour effectuer un test
app.get("/ping", (req, res) => {
  res.status(200).send("Pong");
});

app.get("/players", (req, res) => {
  res.status(200).send(players);
});

// Route de test pour envoyer un message à tous les sockets
app.get("/send-message", (req, res) => {
  const message = "Hello, c'est le serveur Socket.IO!";

  // Envoyer le message à tous les sockets connectés
  io.emit("test-message", { message });

  res.status(200).send("Message envoyé avec succès.");
});

server.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
