"use strict";
exports.__esModule = !0;

var s = require('./gameSetup.js');
var n = require('./input.js');

window.__pendingRemotePlayers = window.__pendingRemotePlayers || {};

function applyRemotePlayer(player) {
    if (!player || !player.id) return;

    if (window.game && window.game.applyRemoteState) {
        window.game.applyRemoteState(player);
        return;
    }

    window.__pendingRemotePlayers[player.id] = Object.assign({
        id: player.id,
        x: 0,
        y: 0,
        pose: 'idle',
        frame: 0,
        vx: 0,
        vy: 0,
        shield: false
    }, player);
}

window.onload = function() {
    try {
        var net = require('./network.js');
        if (net && net.connect) {
            net.connect();//发起链接请求
        }
    } catch (e) {
        console.warn("network init skipped", e && e.message);
    }

    window.addEventListener('network-state-update', function(e) {
        var state = e.detail;
        if (window.game && window.game.applyRemoteState) {
            window.game.applyRemoteState(state);
        }
    });

    window.addEventListener('network-player-joined', function(e) {
        applyRemotePlayer(e && e.detail);
    });

    window.addEventListener('network-player-left', function(e) {
        var player = e && e.detail;
        if (!player || !player.id) return;

        if (window.game && window.game.removeRemotePlayer) {
            window.game.removeRemotePlayer(player.id);
            return;
        }

        delete window.__pendingRemotePlayers[player.id];
    });

    window.addEventListener('network-start', function(e) {
        if (window.game && window.game.startRace) {
            window.game.startRace(e && e.detail && e.detail.seed);
        }
    });

    n.GameInput();
    s.GameSetup();
};