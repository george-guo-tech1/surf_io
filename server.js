"use strict";
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var players = {};
var rooms = {};

function normalizeRoomId(roomId) {
  var value = String(roomId || 'lobby').trim();
  return value || 'lobby';
}

function getPlayerState(socketId, meta, roomId) {
  return Object.assign({
    id: socketId,
    roomId: roomId || 'lobby',
    x: 0,
    y: 0,
    pose: 'idle',
    frame: 0,
    vx: 0,
    vy: 0,
    shield: false,
    ready: false
  }, meta || {});
}

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
  console.log('connect', socket.id);

  socket.on('join', function(meta) {
    var roomId = normalizeRoomId(meta && meta.roomId);

    if (socket.currentRoom && socket.currentRoom !== roomId) {
      socket.leave(socket.currentRoom);
    }

    socket.currentRoom = roomId;
    socket.join(roomId);

    var player = getPlayerState(socket.id, Object.assign({ roomId: roomId }, meta || {}), roomId);
    players[socket.id] = player;

    if (!rooms[roomId]) {
      rooms[roomId] = { id: roomId, players: {} };
    }
    rooms[roomId].players[socket.id] = player;
    rooms[roomId].started = false;

    var roomPlayers = Object.keys(rooms[roomId].players).map(function(id) {
      return rooms[roomId].players[id];
    });

    socket.emit('joined', { id: socket.id, roomId: roomId, players: roomPlayers });
    socket.to(roomId).emit('playerJoined', player);
  });

  socket.on('state', function(data) {
    if (!players[socket.id]) return;

    var roomId = players[socket.id].roomId || 'lobby';
    var state = {
      id: socket.id,
      roomId: roomId,
      state: data.state || 'stop',
      frame: Number(data.frame) || 0,
      character: Number(data.character) || 0,
      surfboardPose: Number(data.surfboardPose) || 0,
      distance: Number(data.distance) || 0,
      trackX: Number(data.trackX) || 0,
      shield: !!data.shield,
      ready: !!data.ready,
      finished: !!data.finished
    };

    players[socket.id] = Object.assign({}, players[socket.id], state);
    if (rooms[roomId]) {
      rooms[roomId].players[socket.id] = players[socket.id];
    }
    socket.to(roomId).emit('state-update', state);

    if (rooms[roomId]) {
      // 有人取消 ready 时重置 started，方便下一局重新起跑
      if (!state.ready) rooms[roomId].started = false;

      // 房间里所有玩家（至少 2 人）都 ready 时，广播开始信号
      if (state.ready && !rooms[roomId].started) {
        var ids = Object.keys(rooms[roomId].players);
        var allReady = ids.length >= 2 && ids.every(function(id) {
          return rooms[roomId].players[id].ready === true;
        });
        if (allReady) {
          rooms[roomId].started = true;
          io.to(roomId).emit('start', { seed: Math.floor(Math.random() * 0x7fffffff) });
        }
      }
    }
  });

  socket.on('disconnect', function() {
    console.log('disconnect', socket.id);

    if (!players[socket.id]) return;

    var roomId = players[socket.id].roomId || 'lobby';
    if (rooms[roomId]) {
      delete rooms[roomId].players[socket.id];
      if (Object.keys(rooms[roomId].players).length === 0) {
        delete rooms[roomId];
      } else {
        io.to(roomId).emit('playerLeft', { id: socket.id });
      }
    }

    delete players[socket.id];
  });
});

server.listen(3000, function() {
  console.log('listening on *:3000');
});



