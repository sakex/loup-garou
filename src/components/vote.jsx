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
      options.push(<Option len={po[o].votes.length} name={po[o].name} width={max(ratio, 30)} key={o} handleClick={() => {
        this.props.vote && this.props.vote(vote);
      }}/>);
    }

    return(
      <div className="vote_container">
        {(this.props.message) && <p>{this.props.message}</p>}
        {this.props.title && this.props.title}
        {options}
      </div>
    )
  }
}

class Option extends React.Component{
  render(){
    const style = {width: this.props.width + "%"};
    return(
      <div className="vote_options" style={style} onClick={this.props.handleClick}>
        {this.props.name}({this.props.len})
      </div>
    )
  }
}


module.exports = Vote;
