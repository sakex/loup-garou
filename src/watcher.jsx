const React = require('react');
const ReactDOM = require('react-dom');
const socket = require('socket.io-client')();
const playSound = require('./modules/sound_library.js');
const Vote = require('./components/vote.jsx');
const YN = require('./components/yn.jsx');


const day = {
  backgroundColor: "#FFC107",
  color: "#4D342A"
}

const night = {
  backgroundColor: "#131A22",
  color: "aliceblue"
}

class Watcher extends React.Component{
  constructor(props){
    super(props);
    this.socket = props.socket;

    this.start = this.start.bind(this);

    this.state = {
      players: [],
      timer:0,
      view: (
        <div>
          <p id="instructions">
            Cliquez sur "Commencer" quand vous souhaitez commencer la partie
          </p>
          <button id="begin" onClick={this.start}>Commencer</button>
        </div>
      ),
      daynight: day
    };

    this.socket.emit('watcher');

    this.attachListeners();
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

  vote_suspect(data){
    this.setState({
      view: <Vote options={data} />
    })
  }

  YN(data){
    this.setState({
      view: <YN data={data} />
    })
  }

  doNothing(message){
    this.setState({
      view: <div id="instructions">{message}</div>
    });
  }

  daynight(isDay){
    const dn = isDay?day:night;
    this.setState({daynight: dn});
  }

  win(winner){
    let opponents;
    if(winner.name == 'villageois') opponents = 'loups garous';
    else opponents = 'villageois';
    this.setState({
      view: <div id="instructions">
        Félicitations, tous les {opponents} ont été éliminés, les {winner.name} ont donc gagné la partie!
      </div>
    })
  }

  render(){
    const player_list = [];
    for(var i of this.state.players){
      player_list.push(<div className="player" key={i}>{i}</div>);
    }
    return(
      <div id="page" style={this.state.daynight}>
        <div id="player_list">
          <p id="p_l_title">Joueurs:</p>
          {player_list}
        </div>
        <div id="timer"><span id="timmer_wrapper">{this.state.timer}</span></div>
        {this.state.view}
      </div>
    )
  }

  attachListeners(){
    this.socket.on('isDay', isDay => this.daynight(isDay))

    .on('doNothing', message => this.doNothing(message))

    .on('choose_suspect', data => this.vote_suspect(data))

    .on('vote_execute', data => this.YN(data))

    .on('win', winner => this.win(winner))

    .on('update_players', players => this.update_players(players))

    .on('updateTimer', timer => this.update_timer(timer))

    .on('doNothing', message => this.doNothing(message));
  }
}


ReactDOM.render(
  <Watcher socket={socket}/>,
  document.getElementById('react')
)
