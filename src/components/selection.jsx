const React = require('react');

const selected = {
  backgroundColor: "#FFC107"
}

const normal = {
  backgroundColor: '#262626'
}

class Selection extends React.Component{
  render(){
    const list = [];
    for(let player of this.props.list){
      list.push(
        <div className="selection_item"
          style={
            (player == this.props.selection)?selected:normal
          }
          onClick={() => {
            this.props.handler(player);
          }}>
          {player}
        </div>
      )
    }
    return(
      <div id="selection">
        {(this.props.message) && (<p>{this.props.message}</p>)}
        {list}
      </div>
    )
  }
}

module.exports = Selection;
