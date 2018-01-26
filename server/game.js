const Villageois = require('./categories/players.js');
const LG = require('./categories/LG.js');
const Watcher = require(__dirname + '/watcher.js');

/**
* The main logic for the whole game
*/
class Game {
  constructor(io) {
    this.players = [];
    this.idAt = 0;
    this.isDay = true;
    this.io = io;

    this.categories = {
      "Villageois": Villageois,
      "Loups Garous": LG
    }

    this.updateTimer = this.updateTimer.bind(this);
  }

  addWatcher(socket){
    this.watcher = new Watcher(socket, this);
  }

  /**
  * @param {String} name - Name of the player
  * @param {socket} socket - The socket to communicate with the player
  */
  addPlayer(name, socket) {
    const player = {
      id: this.idAt++,
      name: name,
      socket: socket
    }
    this.players.push(player);
    if(this.watcher) this.watcher.update_players();
    socket.emit('inscrit', this.getPlayerList());
  }

  /**
  * Initialize the game
  * @param {Object} config - Game config
  * @param {number} config.value - The number of player in a given category
  */
  init(config) {
    if(!config){
      config = {Villageois: 1}
    }
    const players = [],
      categories = [];
    for (var category in config) {
      let index = 0;
      if(this.players.length > 1) index = Math.round(Math.random() * (this.players.length-1));
      const player = new this.categories[category](this.players[index], this);
      players.push(player);
      if (categories[category]) {
        categories[category].push(player);
      } else {
        categories[category] = [player];
      }
      this.players.splice(index, 1);
    }
    this.players = players;
    this.categories = categories;

    this.nextStep = this.choose_suspect;
    this.timer = 1000;//60000;
    this.inverval = setInterval(this.updateTimer, 1000);
    this.watcher.doNothing('Vous venez de recevoir votre rôle, lisez les instructions sur votre écran et cachez-les!');
  }

  day() {
    this.timer = 60000;
    this.isDay = true;

    this.io.emit('doNothing', 'Le jour est revenu, vous avez 60 secondes pour discuter de quel villageois vous allez exécuter');
    this.nextStep = this.choose_suspect;
  }

  choose_suspect() {
    this.timer = 60000;

    const votes = {};
    for (var player of this.players) {
      player.currentVote = undefined;
      votes[player.id] = {
        name: player.name,
        votes: [],
        id: player.id
      };
    }
    this.votes = votes;
    console.log(this.votes)
    this.io.emit('choose_suspect', this.votes);

    this.nextStep = this.vote_execute;
  }

  vote_execute() {
    this.timer = 60000;

    let max = this.votes[0];
    for(var i = 1; i<this.votes.length; ++i){
      const player = this.votes[i];
      if(max.votes.length<player.votes.length){
        max = player;
      }
    }

    this.execute = {
      player: max,
      yes: new Set(),
      no: new Set()
    }

    for (var player of this.players)
      player.execute = "";

    this.io.emit('vote_execute', this.execute);

    this.nextStep = this.execution;
  }

  execution(){
    this.timer = 30000;
    let str = "Etant donné le nombre de votes en faveur de l'exécution de "+this.execute.player.name;

    if(this.execute.yes.size > this.execute.no.size){
      str += ", celui-ci va être exécuté";
      this.io.emit('executed', str);
      const player = this.findPlayerById(this.execute.player.id);
      player.die("Vous avec été exécuté");
    }
    else{
      str += ", vous avez décidé de l'épargner";
      this.io.emit('executed', str);
    }

    this.nextStep = this.night;
  }

  night() {
    this.timer = 1000;
    this.isDay = false;
  }

  updateTimer() {
    this.timer -= 1000;
    this.io.emit('updateTimer', this.timer/1000);
    if (this.timer == 0) {
      this.nextStep();
    }
  }

  findPlayerById(id){
    let player;
    for(var i in this.players){
      if(i.id == id) return player;
    }
  }

  getPlayerList(){
    const players = [];
    for(var i=0, l=this.players.length; i<l; ++i){
      players.push(this.players[i].name);
    }
    return players;
  }
}

module.exports = Game;
