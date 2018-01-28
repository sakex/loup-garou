const genSessId = length => {
  let randomArray = [];
  for(var i = 0; i<length; ++i){
    randomArray.push(Math.round(Math.random()*57)+65);
  }
  return String.fromCharCode.apply(null, randomArray);
}


module.exports = genSessId;
