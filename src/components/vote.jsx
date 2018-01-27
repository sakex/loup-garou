const React = require('react');

const max = (a, b) => (a>b)?a:b;

class Vote extends React.Component{
  render(){
    const options = [];
    const po = this.props.options;
    let vote_count = 0 | 0;
    for(var o in po){
      vote_count += po[o].votes.length;
    }
    for(var o in po){
      const ratio = (po[o].votes.length/vote_count)*100;
      const vote = o;
      options.push(<Option name={po[o].name} width={max(ratio, 10)} key={o} handleClick={() => {
        this.props.vote(vote);
      }}/>);
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
      <div className="vote_options" style={style} onClick={this.props.handleClick}>
        {this.props.name}
      </div>
    )
  }
}


module.exports = Vote;
