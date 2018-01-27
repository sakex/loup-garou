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

    .on('vote_execute', yn => {
      this.vote_execute(yn);
    });

    this.socket.emit('getRole', this.getRole());
  }

  choose_suspect(suspectID) {
    if (this.currentVote) {
      const index = this.game.votes[this.currentVote].votes.indexOf(this.name);
      this.game.votes[this.currentVote].votes.splice(index, 1);
      if (this.currentVote == suspectID) {
        this.currentVote = undefined;
        this.game.io.emit('choose_suspect', this.game.votes);
        return;
      }
    }
    this.game.votes[suspectID].votes.push(this.name);
    this.currentVote = suspectID;
    this.game.io.emit('choose_suspect', this.game.votes);
  }

  vote_execute(yn) {
    if (this.execute) {
      const index = this.game.execute[this.execute].indexOf(this.id);
      this.game.execute[this.execute].splice(index, 1);
      if (this.execute == yn) {
        this.execute = "";
        this.game.io.emit('vote_execute', this.game.execute);
        return;
      }
    }
    this.game.execute[yn].push(this.id);
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

  getRole(){
    return 'villageois';
  }
}

module.exports = Player;
