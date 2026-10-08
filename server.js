"use strict";
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var players = {};

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
  console.log('connect', socket.id);

  socket.on('join', function(meta) {
    players[socket.id] = Object.assign({
      id: socket.id,
      x: 0,
      y: 0,
      pose: 'idle',
      frame: 0,
      vx: 0,
      vy: 0,
      shield: false
    }, meta || {});

    socket.emit('joined', { id: socket.id });
    socket.broadcast.emit('playerJoined', players[socket.id]);
  });

  socket.on('state', function(data) {
    if (!players[socket.id]) return;

    var state = {
      id: socket.id,
      x: Number(data.x) || 0,
      y: Number(data.y) || 0,
      pose: data.pose || 'idle',
      frame: Number(data.frame) || 0,
      vx: Number(data.vx) || 0,
      vy: Number(data.vy) || 0,
      shield: !!data.shield
    };

    players[socket.id] = state;
    io.emit('state-update', state);
  });

  socket.on('disconnect', function() {
    console.log('disconnect', socket.id);

    if (players[socket.id]) {
      socket.broadcast.emit('playerLeft', { id: socket.id });
      delete players[socket.id];
    }
  });
});

server.listen(3000, function() {
  console.log('listening on *:3000');
});



