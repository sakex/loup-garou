const soundList = {
  death: '/sounds/death.mp3'
}

for(var sound in soundList){
  soundList[sound] = new Audio(soundList[sound]);
}

const playSound = (sound) => {
  soundList[sound].play();
}

module.exports = playSound;
