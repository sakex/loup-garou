const Villageois = require('./categories/players.js');
const LG = require('./categories/LG.js');
const Watcher = require(__dirname + '/watcher.js');
const genSessId = require(__dirname + '/genSessId.js');

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

    this.session = genSessId(20);

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

    const game = this;
    const player = {
      id: this.idAt++,
      name: name,
      socket: socket,
      newSocket: function(socket){
        this.socket = socket;
        socket.emit('inscrit', game.getPlayerList());
      }
    }

    this.players.push(player);
    player.socket.emit('setCookie', {
      id: player.id,
      sessId: this.session
    });

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
      config = {
        "Loups Garous": Math.floor(this.players.length/3),
        timePerRound: 300
      }
    }
    else if(!config.timePerRound) config.timePerRound = 300;
    else if(!config["Loups Garous"]) config["Loups Garous"] = Math.floor(this.players.length/3);

    this.baseTime = config.timePerRound;
    delete config.timePerRound;

    config["Villageois"] = this.players.length - config["Loups Garous"];
    const players = [],
      categories = {
      "Villageois": [],
      "Loups Garous": []
    };
    for (var category in config) {
      for(var it = 0; it<config[category]; ++it){
        let index = 0;
        if(this.players.length > 1) index = Math.round(Math.random() * (this.players.length-1));
        const player = new this.categories[category](this.players[index], this);
        players.push(player);
        if (category == "Loups Garous") {
          categories[category].push(player);
        } else {
          categories["Villageois"].push(player);
        }
        this.players.splice(index, 1);
      }
    }
    this.players = players;
    this.categories = categories;

    this.nextStep = this.choose_suspect;
    this.timer = this.baseTime;
    this.interval = setInterval(this.updateTimer, 1000);
    this.watcher.doNothing('Vous venez de recevoir votre rôle, lisez les instructions sur votre écran discrètement!');
  }

  day() {
    this.timer = this.baseTime;
    this.isDay = true;
    const msg = 'Le jour est revenu, vous avez 60 secondes pour discuter de quel villageois vous allez exécuter';
    this.io.emit('isDay', this.isDay);
    this.io.emit('doNothing', msg);
    this.players.map(player => player.state = ['doNothing', msg]);
    this.nextStep = this.choose_suspect;
  }

  choose_suspect() {
    this.timer = this.baseTime;

    let votes = {};
    this.votes = {};
    for (var player of this.players) {
      player.state = ['choose_suspect', this.votes];
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
    this.timer = this.baseTime;

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

    for (var player of this.players){
      player.execute = "";
      player.state = ['vote_execute', this.execute];
    }

    this.io.emit('vote_execute', this.execute);

    this.nextStep = this.execution;
  }

  execution(){
    this.timer = this.baseTime;
    let str = "Etant donné le nombre de votes en faveur de l'exécution de "+this.execute.player.name;

    if(this.execute.yes.length > this.execute.no.length){
      str += ", celui-ci va être exécuté";
      const player = this.findPlayerById(this.execute.player.id);
      player.die("Le village a decide de vous executer!");
    }
    else{
      str += ", vous avez décidé de l'épargner";
    }

    for(var player of this.players){
      player.socket.emit('doNothing', str);
      player.state = ['doNothing', str];
    }
    this.watcher.socket.emit('doNothing', str);

    this.nextStep = this.night;
    this.checkWin();
  }

  night() {
    this.timer = this.baseTime;
    this.isDay = false;

    this.lg_votes = {};
    for(var villageois of this.categories['Villageois']){
      this.lg_votes[villageois.id] = {
        name: villageois.name,
        votes: [],
        id: villageois.id
      }
    }
    for(var player of this.players){
      player.night();
    }
    this.watcher.doNothing(
      "La nuit est tombée sur le village. Alors que les villageois dorment \
      les créatures maléfiques et les villageois avec des pouvoirs spéciaux se réveillent\
      pour effectuer leurs tâches nocturnes."
    );
    this.io.emit('isDay', this.isDay);


    this.nextStep = this.nightSummary;
  }

  loup_garou_vote(){
    for(var lg of this.categories['Loups Garous']){
      lg.socket.emit('loup_garou_vote', this.lg_votes);
    }
  }

  nightSummary(){
    this.timer = this.baseTime;
    let victime = this.lg_votes[Object.keys(this.lg_votes)[0]];
    for(var villageois in this.lg_votes){
      if(victime.votes.length < this.lg_votes[villageois].votes.length){
        vitime = this.lg_votes[villageois];
      }
    }
    const str = "Cette nuit, les loups garous \
    se sont réveillés et ont décidé d'éliminer "
    + victime.name;
    this.io.emit('doNothing', str);
    const player = this.findPlayerById(victime.id);
    player.die('Les loups garous vous ont mange dans la nuit');
    this.players.map(player => player.state = ['doNothing', str]);
    this.nextStep = this.day;
    this.checkWin();
  }

  updateTimer() {
    this.timer -= 1;
    this.io.emit('updateTimer', this.timer);
    if (this.timer == 0) {
      this.nextStep();
    }
  }

  findPlayerById(id){
    for(var player of this.players){
      if(player.id == id) return player;
    }
    return false;
  }

  getPlayerList(){
    const players = [];
    for(var i=0, l=this.players.length; i<l; ++i){
      players.push(this.players[i].name);
    }
    return players;
  }

  checkWin(){
    if(this.categories["Villageois"].length == 0){
      this.nextStep = () => {
        this.win("loups garous");
      }
    }
    else if(this.categories["Loups Garous"].length == 0){
      this.nextStep = () => {
        this.win("villageois");
      }
    }
  }

  win(teamName){
    clearInterval(this.interval);
    this.io.emit('win', {team: this.getPlayerList(), name: teamName});
  }
}

module.exports = Game;
