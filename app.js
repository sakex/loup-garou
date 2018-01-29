const express = require('express');
const app = new express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Game = require(__dirname + '/server/game.js');

const game = new Game(io);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/main.html');
})

.get('/watcher', (req, res) => {
  res.sendFile(__dirname + '/views/watcher.html');
})

.get('/images/:image', (req, res) => {
  res.sendFile(__dirname + '/images/' + req.params.image);
})

.get('/js/:script', (req, res) => {
  res.sendFile(__dirname + '/build/' + req.params.script);
})

.get('/css/:style', (req, res) => {
  res.sendFile(__dirname + '/css/' + req.params.style);
})

.get('/fonts/:font', (req, res) => {
  res.sendFile(__dirname + '/fonts/' + req.params.font);
})

.get('/sounds/:sound', (req, res) => {
  res.sendFile(__dirname + '/sounds/' + req.params.sound);
})

io.on('connection', (socket) => {
  socket.on('watcher', () => {
    game.addWatcher(socket);
  })
  .on('askState', cookie => {
    if(game.session == cookie.session){
      const player = game.findPlayerById(cookie.id);
      if(player){
        player.newSocket(socket);
      }
      else{
        socket.emit('setCookie', '');
      }
    }
    else{
      socket.emit('setCookie', '');
    }
  })
  .on('newPlayer', name => {
    if(!game.started){
      game.addPlayer(name, socket);
    }
    else{
      socket.emit('already_started');
    }
  })
});


server.listen(80, () => {
  console.log('Online mothafucka');
});
