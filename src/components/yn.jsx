const React = require('react');

class YN extends React.Component{
  render(){
    let s_yes = this.props.data.yes.length,
    s_no = this.props.data.no.length,
    total = s_yes + s_no;
    s_yes = s_yes/total;
    s_no = 1 - s_yes; // Optimisation ma gueule

    if(s_yes == 0 && s_no == 0){
      s_yes = .5;
      s_no = .5;
    }

    return(
      <div id="YN">
        <h1>{this.props.data.player.name}</h1>
        <div id="yn_yes" style={{width: "calc("+(s_yes*30)+"vw + 3em"}} onClick={() => this.props.vote_execute('yes')}>Oui</div>
        <div id="yn_no" style={{width: "calc("+(s_no*30)+"vw + 3em"}} onClick={() => this.props.vote_execute('no')}>Non</div>
      </div>
    );
  }
}


module.exports = YN;
