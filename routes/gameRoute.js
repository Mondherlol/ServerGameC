// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const { getGamesCodes,addGame,getGames,deleteGame,generateUniqueCode} = require('../controllers/gameController');


//retourner la liste des games
router.get('/', (req, res) => {
    const  games = getGames();
    res.status(200).json(games);
  });
  //retourner la liste des codes des games est utiliser par react lorsque le joueur veut rejoindre une jeux il verifie si le code existe ou pas
router.get('/code', (req, res) => {
    const  gamesCodes = getGamesCodes();
    res.status(200).json(gamesCodes);
  });
//generer code pour les games cette fonction est utiliser par le c lorsque il lance une jeux il lui donne un code unique 
  router.get('/generercode', (req, res) => {
    const  Code = generateUniqueCode();
    res.status(200).send(Code);
  });
//lorsque c cree une jeux avec un code on va le stoqué dans la base
  router.post('/:code/:playerName/:playerId', (req, res) => {
    const {code,playerName,playerId } = req.params;
    const games = addGame(code,playerName,playerId);
    res.status(200).json(games);
  });
router.delete('/:code',(req,res)=>{
    const {code} =req.params;
    res.status(200).json(deleteGame(code));
})

module.exports = router;
