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
    this.started = false;

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
    const length = name.length;
    if(length < 4){
      socket.emit('bad_name', 'Votre nom doit contenir au moins 4 carractères');
      return;
    }
    if(length > 10){
      socket.emit('bad_name', 'Votre nom doit contenir au maximum 10 carractères');
      return;
    }
    for(var p of this.players){
      if(name == p.name){
        socket.emit('bad_name', 'Ce nom est déjà pris, veuillez en choisir un autre');
        return;
      }
    }
    const player = {
      id: this.idAt++,
      name: name,
      socket: socket
    }
    this.players.push(player);
    if(this.watcher) this.watcher.update_players();

    for(var p of this.players){
      p.socket.emit('inscrit', this.getPlayerList());
    }
    (this.watcher) && this.watcher.update_players();
  }

  /**
  * Initialize the game
  * @param {Object} config - Game config
  * @param {number} config.value - The number of player in a given category
  */
  init(config) {
    this.started = true;
    if(!config){
      config = {Villageois: 2}
    }
    const players = [],
      categories = [];
    for (var category in config) {
      for(var it = 0; it<config[category]; ++it){
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
    this.timer = 1000;

    let votes = {};
    for (var player of this.players) {
      player.currentVote = undefined;
      votes[player.id] = {
        name: player.name,
        votes: [],
        id: player.id
      };
    }
    this.votes = votes;
    this.io.emit('choose_suspect', this.votes);

    this.nextStep = this.vote_execute;
  }

  vote_execute() {
    this.timer = 5000;

    let max = this.votes[Object.keys(this.votes)[0]];
    for(var i in this.votes){
      const player = this.votes[i];
      if(max.votes.length<player.votes.length){
        max = player;
      }
    }

    this.execute = {
      player: max,
      yes: [],
      no: []
    }

    for (var player of this.players)
      player.execute = "";

    this.io.emit('vote_execute', this.execute);

    this.nextStep = this.execution;
  }

  execution(){
    this.timer = 20000;
    let str = "Etant donné le nombre de votes en faveur de l'exécution de "+this.execute.player.name;

    if(this.execute.yes.length > this.execute.no.length){
      str += ", celui-ci va être exécuté";
      this.io.emit('executed', str);
      const player = this.findPlayerById(this.execute.player.id);
      player.die("Le village a décidé de vous exécuter!");
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
    for(var player of this.players){
      if(player.id == id) return player;
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
