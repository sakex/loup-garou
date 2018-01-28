const React = require('react');

class YN extends React.Component{
  render(){
    let s_yes = this.props.data.yes.length,
    s_no = this.props.data.no.length,
    total = s_yes + s_no;
    s_yes = (total == 0)?0:(s_yes/total);
    s_no = (total == 0)?0:(1 - s_yes); // Optimisation ma gueule

    let persY, persN;

    if(s_no == 1){
      s_no = "calc("+(s_no*100)+"% - 3em)";
      s_yes = "3em";
      persN = "100%";
      persY = "0%";
    }

    else if(s_yes == 1){
      s_yes = "calc("+(s_yes*100)+"% - 3em)";
      s_no = "3em";
      persY = "100%";
      persN = "0%";
    }

    else if(s_yes == 0 && s_no == 0){
      s_yes = "50%";
      s_no = "50%";
      persN = persY = "50%";
    }

    else{
      s_yes = (s_yes*100) + "%";
      s_no = (s_no*100) + "%";
      persY = s_yes;
      persN = s_no;
    }

    return(
      <div id="YN">
        <p id="yn_question">Voulez vous exécuter {this.props.data.player.name}?</p>
        <div id="yn_wrapper"><div id="yn_yes" style={{width: s_yes}}
          onClick={() => {
            this.props.vote_execute && this.props.vote_execute('yes')
          }}>Oui {this.props.data.yes.length}</div>
        <div id="yn_no" style={{width: s_no}}
          onClick={() => {
            this.props.vote_execute && this.props.vote_execute('no')
          }}>Non {this.props.data.no.length}</div>
        </div>
      </div>
    );
  }
}


module.exports = YN;
