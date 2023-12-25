class Game {
    constructor(code, score, playerName, playerId, visitors) {
      this.code = code;
      this.score = score;
      this.playerName = playerName;
      this.playerId = playerId;
      this.visitors = visitors || [];
    }
  
    
  }
  
  module.exports = Game;
  