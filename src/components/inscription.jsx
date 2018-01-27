const React = require('react');

class Inscription extends React.Component {
  inscription(){
    this.socket.emit('newPlayer', document.getElementById('i_name').value);
  }

  render() {
    this.socket = this.props.socket;
    this.inscription = this.inscription.bind(this);
    if (!this.props.data) {
      const div = (<div id="inscription" onKeyPress={e => {
          if (e.which == 13)
            this.inscription();
          }}>
        <input type="text" id="i_name" placeholder="Nom"></input>
        <button type="button" id="i_but" onClick={this.inscription}>S'inscrire</button>
      </div>)
      return div;
    }
    else{
      const names = [];
      for(var d of this.props.data){
        names.push(<div className="i_name" key={d}>{d}</div>);
      }
      const div = (
        <div id="inscription">
          <div id="i_title">Vous êtes bien inscrit, veuillez attendre le début de la partie!</div>
          <p id="i_liste">Joueurs inscrits: </p>
          {names}
        </div>
      )
      return div;
    }
  }
}

module.exports = Inscription;
