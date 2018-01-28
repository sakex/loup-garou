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

const LG = (
  <div>
    <h1>Loup Garou</h1>
    <div>
      Les loups garous sont des bêtes sournoises qui vivent parmis les humains le jour et se transforment en loup la nuit pour dévorrer un des villageois. Leur but est d'éliminer tous les villageois afin de prendre le contrôle du village.
    </div>
    <img src="/images/lg.jpg" />
  </div>
);

const roles = {
  "villageois": villageois,
  "Loups Garous": LG
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
