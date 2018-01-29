const Player = require('./players.js');

class Nympho extends Player{
  constructor(config, game){
    super(config, game);
    this.game.nympho = this;
  }

  night(){
    this.nympho_selection = "";
    const list = [];
    for(var player of this.game.players){
      if(player.id != this.id){
        list.push(player.name);
      }
    }
    this.list = list;
    this.socket.emit('nympho_night', {
      list: this.list,
      selection: this.nympho_selection
    });
  }

  nympho_vote(vote){
    if(this.nympho_selection == vote){
      this.nympho_selection = "";
    }
    else{
      this.nympho_selection = vote;
    }

    this.socket.emit('nympho_night', {
      list: this.list,
      selection: this.nympho_selection
    });
  }

  reveal(role){
    const msg = 'Vous avez découvert que ' +
    this.nympho_selection +  ' est ' + role +' en passant la nuit avec ';
    this.socket.emit('special', msg);
  }

  die(str){
    super.die(str);
    delete this.game.nympho;
  }

  attachListeners(){
    super.attachListeners();
    this.socket.on('nympho_selection', vote => this.nympho_vote(vote));
  }

  getRole(){
    return 'nymphomane';
  }
}

module.exports = Nympho;
