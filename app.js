const express = require('express');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const corsMiddleware = require('./middleware/corsMiddleware');
const playerRoute = require('./routes/playerRoute');

const app = express();

app.use(corsMiddleware);
//app.use(corsMiddleware):Cela garantit que le middleware CORS est appliqué à toutes les routes définies après cette configuration du middleware. Cela permet à votre application React d'effectuer des requêtes vers votre serveur Express sans rencontrer de problèmes liés à CORS.
app.use(morgan('dev'));
app.use('/', playerRoute);

const server = http.createServer(app);
const io = new socketIo.Server(server, {
  cors: {
    origin: '*',
  },
});

// ... (socket.io logic remains the same)

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
