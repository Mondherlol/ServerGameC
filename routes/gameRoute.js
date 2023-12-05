// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const { getGamesCodes,addGame,getGames,deleteGame,generateUniqueCode} = require('../controllers/gameController');



router.get('/', (req, res) => {
    const  games = getGames();
    res.status(200).json(games);
  });
router.get('/code', (req, res) => {
    const  gamesCodes = getGamesCodes();
    res.status(200).json(gamesCodes);
  });
  router.get('/generercode', (req, res) => {
    const  Code = generateUniqueCode();
    res.status(200).json(Code);
  });
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
