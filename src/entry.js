"use strict";
exports.__esModule = !0;

var s = require('./gameSetup.js');
var n = require('./input.js');

window.onload = function() {
    try {
        var net = require('./network.js');
        if (net && net.connect) {
            net.connect();
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

    n.GameInput();
    s.GameSetup();
};