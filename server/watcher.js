class Watcher{
  constructor(socket, game){
    this.socket = socket;
    this.game = game;

    this.socket.on('start', config => this.game.init(config));
    this.update_players();
  }

  update_players(){
    const players = [];
    for(var i=0, l=this.game.players.length; i<l; ++i){
      players.push(this.game.players[i].name);
    }
    this.socket.emit('update_players', players);
  }
}

module.exports = Watcher;
