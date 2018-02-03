const Player = require('./players.js');

class Sniper extends Player{
  constructor(config, game){
    super(config, game);
  }

  die(str){
    const list = [];
    this.die_str = str;
    for(var player of this.game.players){
      if(player.id != this.id){
        list.push(player.name);
      }
    }
    this.victime = "";
    this.list = list;
    this.game.sniperDie(this);
    this.socket.emit("sniper_die", {
      list: this.list,
      victime: this.victime
    });

    this.state = [
      "sniper_die", {
        list: this.list,
        victime: this.victime
      }
    ];
    
    this.socket.on('sniper_select', vote => {
      if(this.victime == vote){
        this.victime = "";
      }
      else{
        this.victime = vote;
      }

      this.socket.emit("sniper_die", {
        list: this.list,
        victime: this.victime
      });
    })
  }

  finally_die(){
    super.die(this.die_str);
  }

  getRole(){
    return 'sniper';
  }
}

module.exports = Sniper;
