const React = require('react');

const villageois = (
  <div>
    <h1>Villageois</h1>
    <div>
      Les villageois sont les simples habitants du village, leur rôle est de débusquer les loups garous afin de voter contre eux pour les éliminer.
    </div>
    <img src="/images/villageois.jpg" />
  </div>
);

const roles = {
  "villageois": villageois
}

class ShowRole extends React.Component{
  render(){
    return(
      <div>
        {roles[this.props.role]}
      </div>
    )
  }
}

module.exports = ShowRole;
