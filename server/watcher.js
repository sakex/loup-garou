class Watcher{
  constructor(socket, game){
    this.socket = socket;
    this.game = game;

    this.socket.on('start', config => this.game.init(config));
    this.update_players();
  }

  update_players(){
    const players = this.game.getPlayerList();
    this.socket.emit('update_players', players);
  }

  doNothing(message){
    this.socket.emit('doNothing', message);
  }
}

module.exports = Watcher;
