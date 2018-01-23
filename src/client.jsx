const React = require('react');
const ReactDOM = require('react-dom');
const socket = require('socket.io-client')();
const Inscription = require('./components/inscription.jsx');
const ShowRole = require('./components/showrole.jsx');

class Client extends React.Component {
  constructor(props) {
    super(props);
    this.socket = props.socket;

    this.state = {
      view: <Inscription socket={this.socket}/>
    };

    this.socket.on('inscrit', data => this.inscrit(data))
    
    .on('getRole', role => this.showRole(role))

    .on('doNothing', message => this.doNothing(message));
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

  render() {
    return (<div id="page">
      {this.state.view}
    </div>)
  }
}

ReactDOM.render(<Client socket={socket}/>, document.getElementById('react'))
