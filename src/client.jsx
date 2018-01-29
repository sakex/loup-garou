const React = require('react');
const ReactDOM = require('react-dom');
const socket = require('socket.io-client')();
const Inscription = require('./components/inscription.jsx');
const ShowRole = require('./components/showrole.jsx');
const Vote = require('./components/vote.jsx');
const YN = require('./components/yn.jsx');
const Dead = require('./components/dead.jsx');
const Win = require('./components/win.jsx');
const Selection = require('./components/selection.jsx');


const day = {
  backgroundColor: "#FFC107",
  color: "#4D342A"
}

const night = {
  backgroundColor: "#131A22",
  color: "aliceblue"
}

class Client extends React.Component {
  constructor(props) {
    super(props);
    this.socket = props.socket;

    this.state = {
      view: <Inscription socket={this.socket}/>,
      daynight: day
    };

    if(document.cookie){
      const cookies = document.cookie;
      const id = cookies.match(/id=\w+/)[0].split("=")[1],
      session = cookies.match(/session=[\w\[\\\]\^\_\`]+/)[0].split("=")[1];
      this.socket.emit('askState', {id: id, session: session});
    }

    this.attachListeners();

    this.choose_suspect = this.choose_suspect.bind(this);
    this.choosePrey = this.choosePrey.bind(this);
    this.vote_execute = this.vote_execute.bind(this);
    this.nympho_selection = this.nympho_selection.bind(this);
    this.sniper_select = this.sniper_select.bind(this);
  }

  inscrit(data) {
    this.setState({view: <Inscription data={data} socket={this.socket}/>});
  }

  showRole(role) {
    this.setState({view: <ShowRole role={role}/>});
  }

  doNothing(message) {
    this.setState({
      view: <div id="doNothing">{message}</div>
    });
  }

  vote_suspect(data){
    this.setState({
      view: <Vote options={data} title={<h3>Vote: </h3>} vote={this.choose_suspect}/>
    })
  }

  vote_execute(yn){
    this.socket.emit('vote_execute', yn);
  }

  YN(data){
    this.setState({
      view: <YN data={data} vote_execute={this.vote_execute}/>
    })
  }

  choose_suspect(id){
    this.socket.emit('choose_suspect', id);
  }

  loup_garou_vote(data){
    this.setState({
      view: <Vote options={data} vote={this.choosePrey} />
    })
  }

  choosePrey(id){
    this.socket.emit('loup_garou_vote', id);
  }

  nympho_night(data){
    this.setState({
      view: <Selection list={data.list} selection={data.selection} handler={this.nympho_selection} />
    })
  }

  nympho_selection(vote){
    this.socket.emit('nympho_selection', vote);
  }

  sniper_die(data){
    this.setState({
      special: <Selection list={data.list} selection={data.victime} handler={this.sniper_select} />
    })
  }

  sniper_select(victime){
    this.socket.emit('sniper_select', victime);
  }

  special(msg){
    this.setState({
      special: <div id="special">{msg}</div>
    })
  }

  die(msg){
    this.socket.removeAllListeners();
    this.socket = undefined;
    this.setState({
      view: <Dead msg={msg} />
    })
  }

  daynight(isDay){
    const dn = isDay?day:night;
    this.setState({daynight: dn});
  }

  win(winner){
    this.setState({
      view: <Win {...winner} />
    })
  }

  render() {
    return (
    <div id="page" style={this.state.daynight}>
      {this.state.view}
      {this.state.special && this.state.special}
    </div>)
  }

  setCookie(session){
    document.cookie = 'id='+session.id;
    document.cookie = 'session='+session.sessId;
  }

  attachListeners(){
    this.socket.on('retrieveState', state => this.retrieveState(state))

    .on('setCookie', cookie => this.setCookie(cookie))

    .on('inscrit', data => this.inscrit(data))

    .on('cookie', id => this.setCookie(id))

    .on('already_started', () => {alert('La partie a déjà commencé, vous ne pouvez plus vous inscrire!')})

    .on('bad_name', msg => alert(msg))

    .on('isDay', isDay => this.daynight(isDay))

    .on('getRole', role => this.showRole(role))

    .on('doNothing', message => this.doNothing(message))

    .on('choose_suspect', data => this.vote_suspect(data))

    .on('vote_execute', data => this.YN(data))

    .on('loup_garou_vote', data => this.loup_garou_vote(data))

    .on('die', msg => this.die(msg))

    .on('nympho_night', list => this.nympho_night(list))

    .on('special', role => this.special(role))

    .on('sniper_die', data => this.sniper_die(data))

    .on('win', winner => this.win(winner));
  }
}

ReactDOM.render(<Client socket={socket}/>, document.getElementById('react'))
