const React = require('react');
const ReactDOM = require('react-dom');
const socket = require('socket.io-client')();

class Client extends React.Component{
  constructor(props){
    super(props);
    this.socket = props.socket;

    this.inscription = this.inscription.bind(this);
  }

  inscription(){
    this.socket.emit('newPlayer', document.getElementById('name').value);
  }

  render(){
    return(
      <div id="page">
        <div id="inscription" onKeyPress={e => {
          if(e.which == 13) this.inscription();
        }}>
          <input type="text" id="name" placeholder="Nom"></input>
          <button type="button" onClick={this.inscription}>S'inscrire</button>
        </div>
    </div>
    )
  }
}


ReactDOM.render(
  <Client socket={socket}/>,
  document.getElementById('react')
)
