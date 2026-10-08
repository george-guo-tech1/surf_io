"use strict";

var socket = null;

function connect() {
  if (socket) return socket;
  if (!window.io) {
    console.warn("socket.io not ready yet");
    return null;
  }

  socket = window.io();// 发起链接请求

  socket.on('connect', function() {
    console.log('network connected', socket.id);
    socket.emit('join', {
      x: 0,
      y: 0,
      pose: 'idle',
      frame: 0
    });
  });

  socket.on('joined', function(data) {
    console.log('joined ok', data);
  });

  socket.on('playerJoined', function(player) {
    window.dispatchEvent(new CustomEvent('network-player-joined', {
      detail: player
    }));
  });

  socket.on('playerLeft', function(player) {
    window.dispatchEvent(new CustomEvent('network-player-left', {
      detail: player
    }));
  });

  socket.on('state-update', function(state) {
    window.dispatchEvent(new CustomEvent('network-state-update', {
      detail: state
    }));
  });

  return socket;
}

function sendState(state) {
  if (!socket) connect();
  if (!socket) return;
  socket.emit('state', state);
}

window.Network = {
  connect: connect,
  sendState: sendState
};

module.exports = {
  connect: connect,
  sendState: sendState
};