const React = require('react');

class Vote extends React.Component{
  render(){
    const options = [];
    const po = this.props.options;
    let vote_count = 0 | 0;
    for(var o in po){
      vote_count += po[o].votes.length;
    }
    for(var o in po){
      options.push(<Option name={po[o].name} width={po[o].votes.length/vote_count} key={o} onClick={_ => this.props.vote(o)}/>);
    }

    return(
      <div className="vote_container">
        {options}
      </div>
    )
  }
}

class Option extends React.Component{
  render(){
    const style = {width: this.props.width + "vw"};
    return(
      <div className="vote_options" style={style}>
        {this.props.name}
      </div>
    )
  }
}


module.exports = Vote;
