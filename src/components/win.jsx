const React = require('react');

class Win extends React.Component{
  render(){
    const players = [];
    for(var name of this.props.team){
      players.push(<li>{name}</li>);
    }
    return(
      <div id="win">
        <h1>Félicitations, les {this.props.name} ont gagné!</h1>
        <ul>
          {players}
        </ul>
      </div>
    )
  }
}

module.exports = Win;
