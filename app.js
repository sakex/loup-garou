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

.get('/js/:script', (req, res) => {
  res.sendFile(__dirname + '/build/' + req.params.script);
});

io.on('connection', (socket) => {
  socket.on('watcher', () => {
    game.addWatcher(socket);
  })
  .on('newPlayer', (name) => {
    game.addPlayer(name, socket);
  })
});


server.listen(80, () => {
  console.log('Online mothafucka');
});