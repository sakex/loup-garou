const React = require('react');

class Dead extends React.Component{
  render(){
    return(
      <div id="dead">
        <div id="d_img_wrapper">
          <img src="/images/dead.jpg" id="dead_img"/>
        </div>
        <div id="dead_msg">{this.props.msg.toUpperCase()}</div>
      </div>
    )
  }
}


module.exports = Dead;
