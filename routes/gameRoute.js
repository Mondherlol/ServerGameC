// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const {generateUniqueCode, getGames} = require('../controllers/gameController');


//generer code pour les games cette fonction est utiliser par le c lorsque il lance une jeux il lui donne un code unique 
  router.get('/generercode', (req, res) => {
    const  Code = generateUniqueCode();
    res.status(200).send(Code);
  });


// Route pour récupérer la liste des parties
router.get('/', (req, res) => {
  const gamesList = getGames();
  res.status(200).json(gamesList);
});



module.exports = router;
