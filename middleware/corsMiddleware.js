// CORS est une fonctionnalité de sécurité implémentée par les navigateurs web qui restreint les pages web à effectuer des requêtes vers un domaine différent de celui qui a servi la page web.
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your React app's URL
  credentials: true,
};
//origin : Spécifie quelles URLs sont autorisées à accéder aux ressources sur le serveur. 
//credentials : Indique si le navigateur doit inclure des cookies ou des informations d'authentification HTTP avec la requête entre origines. En le définissant sur true, cela autorise l'envoi de données d'identification.
module.exports = cors(corsOptions);
