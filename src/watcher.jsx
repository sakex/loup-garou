const React = require('react');
const ReactDOM = require('react-dom');
const socket = require('socket.io-client')();
const playSound = require('./modules/sound_library.js');

class Watcher extends React.Component{
  constructor(props){
    super(props);
    this.socket = props.socket;
    this.state = {
      players: [],
      timer:0,
      instruction: "Cliquez sur commencer quand vous souhaitez commencer la partie"
    };

    this.socket.emit('watcher');

    this.socket.on('update_players', (players) => {
      this.update_players(players);
    })

    .on('updateTimer', timer => this.update_timer(timer))
    .on('doNothing', message => this.doNothing(message));

    this.start = this.start.bind(this);
  }

  update_players(players){
    this.setState({players: players});
  }

  update_timer(timer){
    this.setState({timer: timer});
  }

  start(){
    this.socket.emit('start');
  }

  doNothing(message){
    this.setState({instruction: message});
  }

  render(){
    const player_list = [];
    for(var i of this.state.players){
      player_list.push(<div className="player">{i}</div>);
    }
    return(
      <div id="container">
        {player_list}
        <div id="timer">{this.state.timer}</div>
        <div id="instruction">{this.state.instruction}</div>
        <button id="begin" onClick={this.start}>Commencer</button>
      </div>
    )
  }
}


ReactDOM.render(
  <Watcher socket={socket}/>,
  document.getElementById('react')
)
