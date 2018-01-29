const React = require('react');

const villageois = (
  <div>
    <h1>Villageois</h1>
    <div id="role_img_wrapper">
      <img id="role_img" src="/images/villageois.jpg" />
    </div>
    <div id="role_description">
      Les villageois sont les simples habitants du village, leur rôle est de débusquer les loups garous afin de voter contre eux pour les éliminer.
    </div>
  </div>
);

const LG = (
  <div>
    <h1>Loup Garou</h1>
    <div id="role_img_wrapper">
      <img id="role_img" src="/images/lg.jpg" />
    </div>
    <div id="role_description">
      Les loups garous sont des bêtes sournoises qui vivent parmis les humains le jour et se transforment en loup la nuit pour dévorrer un des villageois. Leur but est d'éliminer tous les villageois afin de prendre le contrôle du village.
    </div>
  </div>
);

const nympho = (
  <div>
    <h1>Nymphomane</h1>
    <div id="role_img_wrapper">
      <img id="role_img" src="/images/nympho.jpg" />
    </div>
    <div id="role_description">
      Les nymphomanes peuvent choisir un autre joueur à séduire pour passer la nuit avec eux, ils découvrent ainsi leur rôle à la fin de la nuit. Cependant, si le personnage qu'ils visitaient meurt, les nymphomanes meurent avec!
    </div>
  </div>
);

const sniper = (
  <div>
    <h1>Sniper</h1>
    <div id="role_img_wrapper">
      <img id="role_img" src="/images/sniper.jpg" />
    </div>
    <div id="role_description">
      Le sniper est un villageois sournois qui peut entraîner quelqu'un avec lui dans la tombe lorsqu'il meurt.
    </div>
  </div>
);

const roles = {
  "villageois": villageois,
  "Loups Garous": LG,
  "nymphomane": nympho,
  "sniper": sniper
}

class ShowRole extends React.Component{
  render(){
    return(
      <div id="showRole">
        {roles[this.props.role]}
      </div>
    )
  }
}

module.exports = ShowRole;
