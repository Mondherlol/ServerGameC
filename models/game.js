class Game {
  constructor(gameCode, playerName, playerSocketId) {
    this.gameCode = gameCode;
    this.playerName = playerName;
    this.playerSocketId = playerSocketId;
    this.isPlaying = false;
    this.visitors = [];
    this.score = 0;
    this.createdAt = new Date();
  }
}
 
module.exports = Game;
  