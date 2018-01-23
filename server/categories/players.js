/**
* The base class for players
*/

class Player {
  /**
  * Init player
  * @param {Object} config - Informations about the player
  * @param {Object} config.socket - The socket used by the player
  * @param {string} config.name - The name of the player
  * @param {number} config.id - Id of the player
  */
  constructor(config, game) {
    this.socket = config.socket;
    this.id = config.id;
    this.name = config.name;
    this.dead = false;

    this.game = game;

    this.socket.on('choose_suspect', (suspect) => {
      this.choose_suspect(suspect);
    })

    .on('vote_execute', (yn) => {
      this.vote_execute(yn);
    });
  }

  choose_suspect(suspect) {
    if (this.currentVote) {
      const index = this.game.votes[this.currentVote].indexOf(this.name);
      this.game.votes[this.currentVote].splice(index, 1);
      if (this.currentVote == suspect.id) {
        this.currentVote = undefined;
        return;
      }
    }
    this.game.votes[suspect.id].votes.push(this.name);
    this.currentVote = suspect.id;
    this.game.io.emit('choose_suspect', this.game.votes);
  }

  vote_execute(yn) {
    if (this.execute) {
      this.game.execute[this.execute].delete(this.id);
      if (this.execute == yn) {
        this.execute = "";
        return;
      }
    }
    this.game.execute[this.execute].add(this.id);
    this.execute = yn;
    this.game.io.emit('vote_execute', this.game.execute);
  }

  die(str){
    this.dead = true;
    const index = this.game.players.indexOf(this);
    this.game.players.splice(index, 1);
    this.socket.emit("die", str);
    this.socket.removeAllListeners();
    this.game.watcher.update_players();
  }
}

module.exports = Player;
