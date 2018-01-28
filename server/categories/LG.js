const Player = require('./players.js');

class LG extends Player{
  constructor(config, game){
    super(config, game);
    this.team = 'Loups Garous';
  }

  night(){
    this.socket.emit('loup_garou_vote', this.game.lg_votes);
    this.state = ['loup_garou_vote', this.game.lg_votes];
  }

  loup_garou_vote(vote){
    if (this.LG_vote) {
      const index = this.game.lg_votes[this.LG_vote].votes.indexOf(this.name);
      this.game.lg_votes[this.LG_vote].votes.splice(index, 1);
      if (this.LG_vote == vote) {
        this.LG_vote = undefined;
        this.game.loup_garou_vote();
        return;
      }
    }
    this.game.lg_votes[vote].votes.push(this.name);
    this.LG_vote = vote;
    this.game.loup_garou_vote();
  }


  attachListeners(){
    super.attachListeners();
    
    this.socket.on('loup_garou_vote', vote => {
      this.loup_garou_vote(vote);
    });
  }


  getRole(){
    return 'Loups Garous';
  }
}

module.exports = LG;
