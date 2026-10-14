(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background.js"
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
(__unused_webpack_module, exports) {



exports.__esModule = !0;
var s = function () {
  function t() {
    if (t.instance) return t.instance;
    t.instance = this, this.water = $("water"), this.gradient = $("gradient"), this.reset();
  }
  return t.prototype.reset = function () {
    this.x = 0, this.y = 0, this.stepCount = 0, this.updateWater(0, 0, 0, 0, 0);
  }, t.prototype.updateWater = function (t, e, i, s, n) {
    this.x = (this.x + s * i - t) % 256, this.y = (this.y + n * i * 1.025 - e) % 256, this.water.style.backgroundPosition = -this.x + "px " + -this.y + "px";
  }, t.prototype.setupGradient = function (t) {
    function e(e, i) {
      return (i - e) / t;
    }
    this.startA = [56, 194, 238], this.stopA = [46, 195, 208], this.startB = [46, 195, 208], this.stopB = [248, 255, 214], this.gradient.style.background = "linear-gradient(180deg, rgb(" + this.startA + ") 0%, rgb(" + this.stopA + ") 100%)", this.stepStart = [0, 0, 0], this.stepStop = [0, 0, 0];
    for (var i = 0; i < 3; i++) this.stepStart[i] = e(this.startA[i], this.startB[i]), this.stepStop[i] = e(this.stopA[i], this.stopB[i]);
  }, t.prototype.updateGradient = function (t, e) {
    var i = this;
    if (!(this.stepCount >= t || this.stepCount > e)) {
      this.stepCount = t;
      var s = this.startA.map(function (t, e) {
          return t + i.stepStart[e] * i.stepCount;
        }),
        n = this.stopA.map(function (t, e) {
          return t + i.stepStop[e] * i.stepCount;
        });
      this.gradient.style.background = "linear-gradient(180deg, rgb(" + s + ") 0%, rgb(" + n + ") 100%)";
    }
  }, t.prototype.gameLoseGradient = function () {
    this.gradient.style.background = "linear-gradient(180deg, rgb(" + [126, 126, 126] + ") 0%, rgb(" + [187, 187, 187] + ") 100%)";
  }, t;
}();
exports.Background = s;

/***/ },

/***/ "./src/cleanup.js"
/*!************************!*\
  !*** ./src/cleanup.js ***!
  \************************/
(__unused_webpack_module, exports, __webpack_require__) {



exports.__esModule = !0;
var s = __webpack_require__(/*! ./system.js */ "./src/system.js"),
  n = function () {
    function t() {
      if (t.instance) return t.instance;
      t.instance = this, this.reset();
    }
    return t.prototype.reset = function () {}, t.prototype.update = function () {
      this.cleanObjects();
    }, t.prototype.cleanObjects = function () {
      function t(t) {
        return !!t && !((e = t).y + e.height < -200 || function (t) {
          return t.y > s.Game.system.height + 200;
        }(t) || t.destroy);
        // removed by dead control flow
 var e; 
      }
      s.Game.system.objUpper = s.Game.system.objUpper.filter(t), s.Game.system.objMain = s.Game.system.objMain.filter(t), s.Game.system.objLower = s.Game.system.objLower.filter(t), s.Game.system.objBack = s.Game.system.objBack.filter(t);
    }, t;
  }();
exports.Cleanup = n;

/***/ },

/***/ "./src/collisions.js"
/*!***************************!*\
  !*** ./src/collisions.js ***!
  \***************************/
(__unused_webpack_module, exports, __webpack_require__) {



exports.__esModule = !0;
var s = __webpack_require__(/*! ./system.js */ "./src/system.js"),
  n = __webpack_require__(/*! ./spawn.js */ "./src/spawn.js"),
  r = __webpack_require__(/*! ./player.js */ "./src/player.js"),
  a = function () {
    function t() {
      if (t.instance) return t.instance;
      t.instance = this, this.reset();
    }
    return t.prototype.reset = function () {
      this.clear();
    }, t.prototype.clear = function () {
      this.surfers = [], this.enemies = [], this.obstacles = [];
    }, t.prototype.update = function () {
      function t(t) {
        return t.ObjectName;
      }
      this.clear();
      for (var e = s.Game.system.gameObjects, i = 0; i < e.length; i++) {
        var n = e[i];
        "Player" !== t(n) && ("Surfer" !== t(n) ? "Enemy" !== t(n) ? this.obstacles.push(n) : this.enemies.push(n) : this.surfers.push(n));
      }
      0 === this.obstacles.length || s.Game.system.clearPath || this.checkCollisions();
    }, t.prototype.collisionHappened = function (t, e) {
      return t.box.rectOverlaps(e.box);
    }, t.prototype.checkCollisions = function () {
      for (var t = r.Player.instance, e = this.enemies, i = this.surfers, n = this.surfers.concat(this.enemies), a = 0; a < this.obstacles.length; a++) {
        var o = this.obstacles[a];
        if (!this.collisionHappened(t, o) || o.hitByPlayer || "air" === t.state.substring(0, 3)) {
          if ("ambient" === o.effect && o.hitByPlayer && o.y + o.height < t.y) this.interactAmbient(o);else if ("tentacle" === o.effect && o.hitByPlayer && o.y + o.box.height < t.y) this.interactTentacle(o);else if ("powerup" === o.effect && o.hitByPlayer) this.interactPowerup(o);else for (var h = 0; h < n.length; h++) if (this.collisionHappened(n[h], o) && n[h].hitObstacle !== o) {
            if (o.y + o.height < 64) continue;
            switch (o.effect) {
              case "hit":
              case "ramp":
              case "float":
                this.handleCrash(o, n[h]);
                continue;
              case "slow":
              case "superslow":
              case "spin":
                if (n[h].hitObstacle = o, "Enemy" === n[h].ObjectName) {
                  n[h].currentSpeed = -t.ySpeed / 2;
                  continue;
                }
                n[h].currentSpeed = n[h].currentSpeed / 2;
                continue;
            }
          }
        } else switch (o.hitByPlayer = !0, o.effect) {
          case "hit":
          case "float":
            r.Player.instance.fall();
            continue;
          case "slow":
            r.Player.instance.slow();
            continue;
          case "superslow":
            r.Player.instance.superSlow();
            continue;
          case "spin":
            r.Player.instance.spin();
            continue;
          case "ramp":
            r.Player.instance.jump();
            continue;
          case "dogsurf":
            this.playerAddDog(o);
            continue;
        }
      }
      if ("air" !== t.state.substring(0, 3)) {
        for (a = 0; a < e.length; a++) {
          var c = e[a];
          if (!this.collisionHappened(c, t) || c.gotPlayer || 0 !== c.crashTimer) for (var p = 0; p < i.length; p++) {
            var l = i[p];
            this.collisionHappened(c, l) && 0 === l.crashTimer && (l.crashTimer = 1);
          } else {
            //作弊
            s.Game.system.shields = 1;
            if (s.Game.system.shields > 0) {
              this.enemyStun(e[a]);
              continue;
            }
            this.playerGrabbed(t, e[a]);
          }
        }
        for (a = 0; a < i.length; a++) {
          l = i[a];
          this.collisionHappened(l, t) && 0 === t.crashTimer && 0 === l.crashTimer && (l.hitByPlayer = !0, t.boostTimer > 0 ? l.crashTimer = 1 : t.fall());
        }
      }
    }, t.prototype.playerGrabbed = function (t, e) {
      t.crashTimer = 0, t.state = "stop", e.gotPlayer = !0, e.whichFrame = 4, e.state = "grab", s.Game.system.gameLoseEnemy();
    }, t.prototype.playerAddDog = function (t) {
      s.Game.system.addShields(), t.effect = null, t.destroy = !0;
    }, t.prototype.interactAmbient = function (t) {
      t.whichPose = 0, t.animCounter % t.animRate == 0 && (t.animCounter = 0, t.whichFrame += 1), t.animCounter += 1, t.whichFrame > 6 * t.ambientInstance + 5 && (t.whichFrame = 6 * t.ambientInstance + 5, t.effect = null, t.hitByPlayer = !1);
    }, t.prototype.interactPowerup = function (t) {
      if (t.collectedByPlayer) return t.animCounter += 1, t.animCounter % t.animRate == 0 && (t.animCounter = 0, t.whichPose += 1), void (t.whichPose > 3 && (t.effect = null, t.destroy = !0));
      t.collectedByPlayer || (t.collectedByPlayer = !0, s.Game.system.addPowerup(), t.hasRipple = !1, t.whichFrame += 1, t.isAnimated = !1, t.whichPose = 0);
    }, t.prototype.interactTentacle = function (t) {
      var e = t.x - 32,
        i = t.y - 64;
      n.Spawn.instance.spawnNewEnemy("tentacle", e, i, 0), t.effect = null, t.destroy = !0;
    }, t.prototype.handleCrash = function (t, e) {
      e.hitObstacle = t, e.crashTimer = 1;
    }, t.prototype.enemyStun = function (t) {
      t.move(0, -20), t.crashTimer = 2, r.Player.instance.dogTimer = 4, s.Game.system.shields <= 1 ? s.Game.system.removeAllShields() : s.Game.system.removeShield();
    }, t;
  }();
exports.Collisions = a;

/***/ },

/***/ "./src/enemy.js"
/*!**********************!*\
  !*** ./src/enemy.js ***!
  \**********************/
(__unused_webpack_module, exports, __webpack_require__) {



var _s,
  n = this && this.__extends || (_s = function s(t, e) {
    return (_s = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (t, e) {
      t.__proto__ = e;
    } || function (t, e) {
      for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
    })(t, e);
  }, function (t, e) {
    function i() {
      this.constructor = t;
    }
    _s(t, e), t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, new i());
  });
exports.__esModule = !0;
var r = __webpack_require__(/*! ./system.js */ "./src/system.js"),
  a = __webpack_require__(/*! ./gameObject.js */ "./src/gameObject.js"),
  o = __webpack_require__(/*! ./player.js */ "./src/player.js"),
  h = __webpack_require__(/*! ./sprites.js */ "./src/sprites.js"),
  c = function (t) {
    function e(e, i) {
      var s = t.call(this, "Enemy", e, i, 128, 128, h.enemy128Sprite(), 0) || this;
      return s.box = new a.ObjectArea(s, 32, 80, 64, 40), s.angleInterval = 20, s.angleCounter = 0, s.angleToPlayer = null, s.chaseCounter = 0, s.crashCounter = 0, s.grabCounter = 0, s.currentSpeed = 0, s.maxSpeed = 1.5, s.gotPlayer = !1, s.crashTimer = 0, s.updateInterval(), s;
    }
    return n(e, t), e.prototype.updateInterval = function () {
      this.accel = .08 * r.Game.system.interval;
    }, e.prototype.update = function () {
      this.updateInterval(), t.prototype.update.call(this), this.gotPlayer ? this.enemyGrab() : this.crashTimer > 0 ? this.enemyCrash() : (this.updatePosition(), this.updateDirection(), this.updateSprite());
    }, e.prototype.updatePosition = function () {
      var t = r.Game.system.interval,
        e = o.Player.instance,
        i = this.y + this.height >= e.y + e.height;
      r.Game.system.clearPath ? this.enemySlowdown(t) : this.currentSpeed > this.maxSpeed || i ? this.currentSpeed -= this.accel : this.currentSpeed < this.maxSpeed && !i && (this.currentSpeed += this.accel);
      var s = Math.abs(e.xSpeed) * t;
      i && (s += this.currentSpeed * t);
      var n = Math.min((e.ySpeed / 1.1 + this.currentSpeed) * t, (e.maxSpeed + 1.5) * t);
      switch (this.angleToPlayer) {
        case "left":
          "right-down" === e.state || "right" === e.state ? this.move(-s / 4, n) : this.move(-s - this.currentSpeed * t, n);
          break;
        case "right":
          "left-down" === e.state || "left" === e.state ? this.move(s / 4, n) : this.move(s + this.currentSpeed * t, n);
      }
    }, e.prototype.updateDirection = function () {
      if (this.angleCounter % this.angleInterval == 0) {
        this.angleCounter = 0, this.angleInterval = Math.round(r.Game.system.linearMap(10, 20) / r.Game.system.interval);
        var t = this.x + this.width / 2 >= o.Player.instance.x + o.Player.instance.width / 2;
        this.angleToPlayer = t ? "left" : "right";
      }
      this.angleCounter++;
    }, e.prototype.updateSprite = function () {
      this.chaseCounter++, this.chaseCounter % (r.Game.system.fps / 10) == 0 && (this.chaseCounter = 0, this.whichFrame = (this.whichFrame + 1) % 3);
    }, e.prototype.enemyGrab = function () {
      this.whichFrame < 4 && (this.whichFrame = 4), this.grabCounter += 1, this.grabCounter % (r.Game.system.fps / 10) == 0 && (this.grabCounter = 0, this.whichFrame += 1), this.whichFrame > 9 && (this.whichFrame = 9, r.Game.system.updateEnding = !1, this.gotPlayer = !1);
    }, e.prototype.enemyCrash = function () {
      this.whichFrame = 3, this.crashCounter++, this.crashCounter % r.Game.system.fps == 0 && (this.crashTimer -= 1), 0 === this.crashTimer && (this.currentSpeed = 0, this.crashCounter = 0);
    }, e.prototype.enemySlowdown = function (t) {
      this.currentSpeed > 0 && (this.currentSpeed -= this.accel * t);
    }, e;
  }(a.GameObject);
exports.Enemy = c;

/***/ },

/***/ "./src/gameObject.js"
/*!***************************!*\
  !*** ./src/gameObject.js ***!
  \***************************/
(__unused_webpack_module, exports, __webpack_require__) {



var _s,
  n = this && this.__extends || (_s = function s(t, e) {
    return (_s = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (t, e) {
      t.__proto__ = e;
    } || function (t, e) {
      for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
    })(t, e);
  }, function (t, e) {
    function i() {
      this.constructor = t;
    }
    _s(t, e), t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, new i());
  });
exports.__esModule = !0;
var r = __webpack_require__(/*! ./system.js */ "./src/system.js"),
  a = __webpack_require__(/*! ./player.js */ "./src/player.js"),
  o = __webpack_require__(/*! ./sprites.js */ "./src/sprites.js"),
  h = function () {
    function t(t, e, i, s, n, a, o) {
      this.ObjectName = t, this.box = new p(this, 0, 0, s, n), this.x = e, this.y = i, this.width = s, this.height = n, this.sprite = a, this.whichFrame = o, this.whichPose = 0, this.whichRipplePose = 0, this.isAnimated = !1, this.hasRipple = !1, this.refreshCounter = 0, this.refreshRate = r.Game.system.fps / 10, this.effect = null;
    }
    return t.prototype.update = function () {
      this.move(-a.Player.instance.xSpeed * r.Game.system.interval, -a.Player.instance.ySpeed * r.Game.system.interval), this.refreshCounter++, this.refreshCounter % this.refreshRate == 0 && (this.refreshCounter = 0, this.isAnimated && (this.whichPose = (this.whichPose + 1) % 3), this.whichRipplePose = (this.whichRipplePose + 1) % 3);
    }, t.prototype.reset = function () {}, t.prototype.move = function (t, e) {
      this.x += t, this.y += e, this.box.translateXY(t, e);
    }, t.prototype.draw = function (t) {
      this.hasRipple && o.ripple92Sprite().draw(t, Math.floor(this.x) - (92 - this.width) / 2, Math.floor(this.y) - (92 - this.height) / 1.5, 0, this.whichRipplePose), this.sprite.draw(t, Math.floor(this.x), Math.floor(this.y), this.whichFrame, this.whichPose);
    }, t;
  }();
exports.GameObject = h;
var c = function (t) {
  function e(e, i, s, n, a, o) {
    var h = t.call(this, "Obstacle", e, i, s, n, a, o) || this;
    return h.box = new p(h, 0, 0, s, n), h.whichFrame = o, h.isInBack = !1, h.hitByPlayer = !1, h.collectedByPlayer = !1, h.hitByEnemy = !1, h.hitBySurfer = !1, h.refreshCounter = 0, h.refreshRate = r.Game.system.fps / 10, h.effect = "hit", h;
  }
  return n(e, t), e.prototype.update = function () {
    t.prototype.update.call(this);
  }, e.prototype.draw = function (e) {
    t.prototype.draw.call(this, e);
  }, e;
}(h);
exports.Obstacle = c;
var p = function () {
  function t(t, e, i, s, n) {
    this.x = t.x + e, this.y = t.y + i, this.width = s, this.height = n, this.padding = 10;
  }
  return t.prototype.rectOverlaps = function (t) {
    return !(t.x + t.width < this.x + this.padding) && !(this.x + this.width < t.x + this.padding) && !(t.y + t.height < this.y + this.padding) && !(this.y + this.height < t.y + this.padding);
  }, t.prototype.translateXY = function (t, e) {
    this.x = this.x + t, this.y = this.y + e;
  }, t;
}();
exports.ObjectArea = p;

/***/ },

/***/ "./src/gameSetup.js"
/*!**************************!*\
  !*** ./src/gameSetup.js ***!
  \**************************/
(__unused_webpack_module, exports, __webpack_require__) {



exports.__esModule = !0;
var s = __webpack_require__(/*! ./system.js */ "./src/system.js");
var p = __webpack_require__(/*! ./player.js */ "./src/player.js");
exports.GameSetup = function () {
  var t = $("game-canvas"),
    e = new s.Game(t, 60);
  window.game = e;
  if (window.__pendingRemotePlayers) {
    Object.keys(window.__pendingRemotePlayers).forEach(function (id) {
      e.applyRemoteState(window.__pendingRemotePlayers[id]);
    });
    delete window.__pendingRemotePlayers;
  }
  if (p && p.Player && p.Player.instance) {
    window.currentPlayer = p.Player.instance;
  }

  // 调试：在两个客户端各自的 console 里执行 window.debugPlayers()，对比本地/对手的距离与屏幕位置
  window.debugPlayers = function () {
    var sys = s.Game.system,
      local = window.currentPlayer,
      out = {
        gameState: sys.gameState,
        local: {
          x: local ? Math.round(local.x) : null,
          y: local ? Math.round(local.y) : null,
          distance: Math.round(sys.distance || 0),
          trackX: local ? Math.round(local.trackX || 0) : null
        },
        remote: {}
      };
    Object.keys(sys.remotePlayers || {}).forEach(function (id) {
      var rp = sys.remotePlayers[id],
        dx = Math.floor(sys.width / 2) - 32 + ((rp.trackX || 0) - (local ? local.trackX : 0)),
        dy = (local ? Math.floor(local.y) : Math.floor(sys.height / 3) - 32) + ((rp.distance || 0) - (sys.distance || 0));
      out.remote[id] = {
        distance: Math.round(rp.distance || 0),
        trackX: Math.round(rp.trackX || 0),
        dx: dx,
        dy: dy
      };
    });
    console.log("[DEBUG PLAYERS]", JSON.stringify(out));
    return out;
  };
  var i = window.performance.now(),
    _n = function n() {
      requestAnimationFrame(_n);
      var t = window.performance.now() - i;
      t > 1e3 / 60 && (e.gameLoop(t), i = window.performance.now());
    };
  requestAnimationFrame(_n), function (t, e) {
    var i = null;
    window.addEventListener("resize", function () {
      null != i && (clearTimeout(i), i = null), i = setTimeout(function () {
        i = null, t();
      }, e);
    });
  }(function () {
    e.reflowCanvas();
  }, 50);
};

/***/ },

/***/ "./src/input.js"
/*!**********************!*\
  !*** ./src/input.js ***!
  \**********************/
(__unused_webpack_module, exports, __webpack_require__) {



exports.__esModule = !0;
var s = __webpack_require__(/*! ./system.js */ "./src/system.js"),
  n = __webpack_require__(/*! ./interface.js */ "./src/interface.js"),
  r = __webpack_require__(/*! ./player.js */ "./src/player.js"),
  a = __webpack_require__(/*! ./spawn.js */ "./src/spawn.js"),
  o = __webpack_require__(/*! ./record.js */ "./src/record.js");
exports.GameInput = function () {
  window.addEventListener("keyup", function (t) {
    c.onKeyup(t);
  }, !1), window.addEventListener("keydown", function (t) {
    c.onKeydown(t);
  }, !1);
  var t = 0,
    e = null,
    i = !1,
    h = null,
    c = {
      _pressed: {},
      UP: 38,
      DOWN: 40,
      LEFT: 37,
      RIGHT: 39,
      ENTER: 13,
      SPACE: 32,
      W: 87,
      A: 65,
      S: 83,
      D: 68,
      F: 70,
      ESC: 27,
      codes: [[38, 38, 40, 40, 37, 39, 37, 39, 66, 65], [77, 73, 67, 82, 79, 83, 79, 70, 84], [69, 68, 71, 69], [75, 82, 65, 75, 69, 78]],
      codePosition: 0,
      isDown: function isDown(t) {
        return this._pressed[t];
      },
      onKeydownPlaying: function onKeydownPlaying(e) {
        if (c.isDown(c.DOWN) || c.isDown(c.S)) {
          var i = new Date();
          i - t <= 400 && (r.Player.instance.boost(), i = 0), t = i, "air" === r.Player.instance.state.substring(0, 3) ? (r.Player.instance.trick = (r.Player.instance.trick + 1) % r.Player.instance.maxTricks, s.Game.system.tricks += 1) : r.Player.instance.state = "down";
        } else t = 0;
        c.isDown(c.LEFT) || c.isDown(c.A) ? "left-down" === r.Player.instance.state || "left" === r.Player.instance.state ? r.Player.instance.state = "left" : r.Player.instance.state = "left-down" : c.isDown(c.RIGHT) || c.isDown(c.D) ? "right-down" === r.Player.instance.state || "right" === r.Player.instance.state ? r.Player.instance.state = "right" : r.Player.instance.state = "right-down" : c.isDown(c.UP) || c.isDown(c.W) ? r.Player.instance.state = "stop" : c.isDown(c.F) && r.Player.instance.boost();
      },
      onKeydownWinLose: function onKeydownWinLose(t) {
        (c.isDown(c.ENTER) || c.isDown(c.SPACE)) && (n.Interface.system.clearScreen(), s.Game.system.initializeGame());
      },
      onKeydownWaiting: function onKeydownWaiting(t) {
        c.isDown(c.ENTER) || c.isDown(c.SPACE) ? (n.Interface.system.buildStartScreen(), a.Spawn.instance.spawnPowerupRow(), s.Game.system.gameState = "ready") : c.isDown(c.LEFT) || c.isDown(c.A) ? r.Player.instance.character > 0 && (r.Player.instance.character -= 1) : (c.isDown(c.RIGHT) || c.isDown(c.D)) && r.Player.instance.character < r.Player.instance.totalCharacters - 1 && (r.Player.instance.character += 1);
        var e = t.keyCode;
        if (i && e === this.codes[h][this.codePosition + 1]) {
          if (this.codePosition++, e === this.codes[h][this.codes[h].length - 1]) {
            switch (h) {
              case 0:
                r.Player.instance.konamiSprite();
                break;
              case 1:
                s.Game.system.infiniteLives = !0, s.Game.system.lives = s.Game.system.maxLives;
                break;
              case 2:
                s.Game.system.infinitePowerups = !0, s.Game.system.powerups = s.Game.system.maxPowerups;
                break;
              case 3:
                s.Game.system.krakenCodeUsed = !0, a.Spawn.instance.nextEnemy = 750, a.Spawn.instance.freqEnemy = 375;
            }
            i = !1, this.codePosition = 0, h = null;
          }
        } else {
          if (i && this.codePosition <= 1 && e === this.codes[h][0]) return;
          i = !1, this.codePosition = 0;
          for (var o = 0; o <= this.codes.length - 1 && !i; o++) {
            e === this.codes[o][0] && (h = o, i = !0);
          }
        }
      },
      onKeydownReady: function onKeydownReady(t) {
        // 第二次按空格 = 起跑：只记录起跑方向和 ready 标记，等服务器通知双方都 ready 后统一开始
        var startKey = c.isDown(c.DOWN) || c.isDown(c.S) || c.isDown(c.ENTER) || c.isDown(c.SPACE) || c.isDown(c.LEFT) || c.isDown(c.A) || c.isDown(c.RIGHT) || c.isDown(c.D);
        if (!startKey) return;
        var dir = "down";
        c.isDown(c.LEFT) || c.isDown(c.A) ? dir = "left-down" : (c.isDown(c.RIGHT) || c.isDown(c.D)) && (dir = "right-down");
        r.Player.instance.pendingStartState = dir, r.Player.instance.readyToStart = !0, n.Interface.system.showWaitingForOpponent();
      },
      onKeydownModal: function onKeydownModal(t) {},
      onKeydown: function onKeydown(t) {
        if (e !== t.keyCode) {
          switch (this._pressed[t.keyCode] = !0, c.isDown(c.ESC) && (n.Interface.system.clearScreen(), s.Game.system.initializeGame()), s.Game.system.gameState) {
            case "playing":
              this.onKeydownPlaying(t);
              break;
            case "lose":
            case "win":
            case "over":
              this.onKeydownWinLose(t);
              break;
            case "waiting":
              this.onKeydownWaiting(t);
              break;
            case "ready":
              this.onKeydownReady(t);
              break;
            case "modal":
              this.onKeydownModal(t);
          }
          e = t.keyCode, delete this._pressed[t.keyCode];
        }
      },
      onKeyup: function onKeyup(t) {
        e = null;
      }
    };
};
function sendPlayerState(player) {
  if (!window.Network || !window.Network.sendState) return;
  window.Network.sendState({
    x: player.x,
    y: player.y,
    pose: player.pose || 'idle',
    frame: player.frame || 0,
    vx: player.vx || 0,
    vy: player.vy || 0,
    shield: !!player.shield
  });
}

/***/ },

/***/ "./src/interface.js"
/*!**************************!*\
  !*** ./src/interface.js ***!
  \**************************/
(__unused_webpack_module, exports, __webpack_require__) {



exports.__esModule = !0;
var s = __webpack_require__(/*! ./system.js */ "./src/system.js"),
  n = __webpack_require__(/*! ./player.js */ "./src/player.js"),
  r = __webpack_require__(/*! ./islandSpawn.js */ "./src/islandSpawn.js") //这是一行测试注释
  ,
  a = function () {
    function t() {
      if (t.system) return t.system;
      t.system = this, this.reset();
    }
    return t.prototype.reset = function () {
      this.defineInterface();
    }, t.prototype.update = function () {
      this.updateCounter();
    }, t.prototype.buildInterface = function () {
      this.stats.setAttribute("style", "opacity: 0;"), this.title.setAttribute("style", "opacity: 1;"), this.select.setAttribute("style", "opacity: 1;"), this.info.setAttribute("style", "opacity: 0;"), this.stats.innerHTML = "<div id='distance'><div id='counter'>0%</div><div id='bar-fill'></div></div><div id='lives'></div><div id='powerups'></div><div id='shields'></div>", this.title.innerHTML = "<div id='main'>TITLE</div><div id='cta'>MESSAGE</div>", this.select.innerHTML = "<div id='selector'><svg id='arrow-left' width='40px' height='40px' viewBox='0 0 20 20'><path d='M10,5 l-5,5 M5,10 l5,5' stroke='#000000' stroke-linecap='round' stroke-width='1' /></svg><svg id='arrow-right' width='40px' height='40px' viewBox='0 0 20 20'><path d='M10,5 l 5,5 M 15,10 l -5,5' stroke='#000000' stroke-linecap='round' stroke-width='1' /></svg></div>", this.defineInterface();
    }, t.prototype.defineInterface = function () {
      this.stats = $("stats"), this.title = $("title"), this.select = $("select"), this.info = $("info"), this.counter = $("counter"), this.bar = $("bar-fill"), this.lives = $("lives"), this.powerups = $("powerups"), this.shields = $("shields"), this.main = $("main"), this.cta = $("cta");
    }, t.prototype.updateCounter = function () {
      this.counter.innerHTML = Math.min(Math.floor(s.Game.system.distance / s.Game.system.winDistance * 100), 100) + "%", this.bar.setAttribute("style", "width: " + Math.floor(68.99) * (s.Game.system.distance / s.Game.system.winDistance) + "px;");
    }, t.prototype.updateIcons = function () {
      this.lives.innerHTML = "", this.powerups.innerHTML = "", this.shields.innerHTML = "";
      for (var t = 1; t <= s.Game.system.maxLives; t++) {
        var e = document.createElement("div");
        t <= s.Game.system.lives ? e.setAttribute("class", "icon life-full") : e.setAttribute("class", "icon life-empty"), this.lives.appendChild(e);
      }
      for (t = 1; t <= s.Game.system.maxPowerups; t++) {
        var i = document.createElement("div");
        t <= s.Game.system.powerups ? i.setAttribute("class", "icon powerup-full") : i.setAttribute("class", "icon powerup-empty"), this.powerups.appendChild(i);
      }
      for (t = 1; t <= s.Game.system.shields; t++) if (n.Player.instance.collectedDog) {
        var r = document.createElement("div");
        r.setAttribute("class", "icon shield"), this.shields.appendChild(r);
      }
      s.Game.system.infiniteLives && ((e = document.createElement("div")).setAttribute("class", "icon infinite"), this.lives.appendChild(e));
      s.Game.system.infinitePowerups && ((i = document.createElement("div")).setAttribute("class", "icon infinite"), this.powerups.appendChild(i));
    }, t.prototype.buildCharacterSelection = function () {
      this.main.innerHTML = "LET'S SURF", this.cta.innerHTML = "USE <span><</span> <span>></span> AND <span>SPACE</span> TO SELECT A SURFER", this.buildInfiniteLivesToggle(), this.buildWaitOnDeathToggle();
    }, t.prototype.buildInfiniteLivesToggle = function () {
      // 选人界面的"无限生命"勾选项：只影响本地玩家（单方面）
      var old = $("infinite-lives-toggle");
      old && old.parentNode && old.parentNode.removeChild(old);
      var label = document.createElement("label");
      label.setAttribute("id", "infinite-lives-toggle");
      label.style.cssText = "display:block;margin-top:12px;font-size:16px;color:#ffffff;text-shadow:1px 1px 2px #000000;cursor:pointer;";
      label.innerHTML = "<input type='checkbox' id='infinite-lives-checkbox' style='vertical-align:middle;'> 无限生命";
      label.style = "z-index:999;position:absolute;left:20px;";
      this.title.appendChild(label);
      var cb = $("infinite-lives-checkbox");
      cb.checked = !!s.Game.system.infiniteLives;
      cb.addEventListener("change", function () {
        s.Game.system.infiniteLives = cb.checked, s.Game.system["interface"].updateIcons();
      });
    }, t.prototype.removeInfiniteLivesToggle = function () {
      var old = $("infinite-lives-toggle");
      old && old.parentNode && old.parentNode.removeChild(old);
    }, t.prototype.buildWaitOnDeathToggle = function () {
      // 选人界面的"落后者死亡不结束游戏"勾选项：状态同步给远程玩家
      var old = $("wait-on-death-toggle");
      old && old.parentNode && old.parentNode.removeChild(old);
      var label = document.createElement("label");
      label.setAttribute("id", "wait-on-death-toggle");
      label.style.cssText = "display:block;margin-top:12px;font-size:16px;color:#ffffff;text-shadow:1px 1px 2px #000000;cursor:pointer;";
      label.innerHTML = "<input type='checkbox' id='wait-on-death-checkbox' style='vertical-align:middle;'> 落后者死亡不结束游戏";
      label.style = "z-index:999;position:absolute;left:20px;top:180px;";
      this.title.appendChild(label);
      var cb = $("wait-on-death-checkbox");
      cb.checked = !!s.Game.system.waitOnDeath;
      cb.addEventListener("change", function () {
        s.Game.system.waitOnDeath = cb.checked, s.Game.system.waitOnDeathTs = Date.now();
      });
    }, t.prototype.updateWaitOnDeathToggle = function () {
      var cb = $("wait-on-death-checkbox");
      cb && (cb.checked = !!s.Game.system.waitOnDeath);
    }, t.prototype.removeWaitOnDeathToggle = function () {
      var old = $("wait-on-death-toggle");
      old && old.parentNode && old.parentNode.removeChild(old);
    }, t.prototype.buildStartScreen = function () {
      this.removeInfiniteLivesToggle(), this.removeWaitOnDeathToggle(), this.info.setAttribute("style", "opacity: 1;"), this.select.innerHTML = "", this.main.innerHTML = "LET'S SURF", this.cta.innerHTML = "PRESS <span>SPACE</span> TO START SURFING", this.info.innerHTML = "<h2>How to play</h2><p><span class='icon buttons-small'></span> Use the arrow keys or WASD keys to surf</p><p><span class='icon life-small'></span> Hitting a solid obstacle removes a life</p><p><span class='icon powerup-small'></span> Press F to use your speed boost powerup</p><p><span class='icon shield-small'></span> Rescue the dog for shields from enemies</p><p><span class='icon counter-small'></span> A surprise is waiting at the finish line</p>", this.stats.setAttribute("style", "opacity: 1;"), this.updateIcons();
    }, t.prototype.showWaitingForOpponent = function () {
      this.main.innerHTML = "READY!", this.cta.innerHTML = "WAITING FOR OPPONENT...";
    }, t.prototype.hideScreen = function () {
      this.title.setAttribute("style", "opacity: 0;"), this.info.setAttribute("style", "opacity: 0;");
    }, t.prototype.clearScreen = function () {
      this.stats.innerHTML = "", this.title.innerHTML = "", this.select.innerHTML = "", this.info.innerHTML = "", this.modal = $("win-modal"), this.credits = $("credit-modal"), this.modal && document.body.removeChild(this.modal), this.credits && document.body.removeChild(this.credits);
    }, t.prototype.drawGameOver = function (msg) {
      this.title.setAttribute("style", "opacity: 1;"), this.main.innerHTML = msg || "TRY AGAIN", this.cta.innerHTML = "PRESS <span>SPACE</span> TO SURF AGAIN";
    }, t.prototype.drawDeadWaiting = function () {
      this.title.setAttribute("style", "opacity: 1;"), this.main.innerHTML = "YOU DIED", this.cta.innerHTML = "WAITING FOR OPPONENT...";
    }, t.prototype.drawGameWin = function () {
      this.updateCounter(), this.title.setAttribute("style", "opacity: 1;"), this.main.innerHTML = "YOU WIN!", this.cta.innerHTML = "PRESS <span>SPACE</span> TO SURF AGAIN";
    }, t.prototype.buildWinModal = function () {
      return cr.sendWithPromise("get-logo").then(function (t) {
        var e = loadTimeData.getString("logoKey").split("").map(function (t) {
            return t.charCodeAt(0);
          }),
          i = 0,
          s = t.map(function (t) {
            return t ^ e[i++ % e.length];
          }),
          n = String.fromCharCode.apply(String, s);
        console.log(n);
        var r = document.createElement("div");
        r.innerHTML = "<button id='edmonds-close'><svg width='16' height='16' xmlns='http://www.w3.org/2000/svg'><line x1='1' y1='15' x2='15' y2='1'></line><line x1='1' y1='1' x2='15' y2='15'></line></svg></button><img id='edmonds-logo' alt='New logo!' src='" + n + "'></img><h1 id='edmonds-title'>Thanks for helping us build the new Microsoft Edge</h1><p id='edmonds-text'>Insiders like you make Edge great. Thanks for being part of our community and surfing the web with us!</p><button id='edmonds-cta'>Close</button>", r.setAttribute("id", "win-modal"), document.body.appendChild(r);
      });
    }, t.prototype.buildCreditModal = function () {
      var t = document.createElement("div");
      t.innerHTML = "\n        <button id='edmonds-close'>\n            <svg width='16' height='16' xmlns='http://www.w3.org/2000/svg'>\"\n                <line x1='1' y1='15' x2='15' y2='1'></line><line x1='1' y1='1' x2='15' y2='15'></line>\n            </svg>\n        </button>\n        <h1 id='credits-title'>Credits</h1>\n        <div id='edmonds-text'>\n            <table>\n            <tbody>\n            <tr> <td> Parker Young </td> <td> Patrick Evan Little </td> </tr>\n            <tr> <td> Scott Porterfield </td> <td> Charles Duval </td> </tr>\n            <tr> <td> William Devereux </td> <td> Jonathan Merrin </td> </tr>\n            <tr> <td> Adina Shanholtz </td> <td> Connor Smith </td> </tr>\n            <tr> <td> Addison Kaufmann </td> </tr>\n            </tbody>\n            </table>\n            <h2 id='special-thanks'> Special thanks: </h2>\n            <table>\n            <tbody>\n            <tr> <td>Emily Johnson</td> <td>Ramya Challa</td> </tr>\n            <tr> <td>Rachel Weil</td> <td>Amanda Velasco Gallardo</td> </tr>\n            <tr> <td>Tony Lew</td> <td>Olya Veselova</td> </tr>\n            <tr> <td>Chuck Friedman</td> <td>Rajesh Sundaram</td> </tr>\n            <tr> <td>Joe Belfiore</td> <td>Chris Pirih</td> </tr>\n            </tbody>\n            </table>\n        </div>\n        <button id='edmonds-cta'>Close</button>\n        ", t.setAttribute("id", "credit-modal"), document.body.appendChild(t);
    }, t.prototype.showWinModal = function () {
      this.buildWinModal().then(function () {
        r.IslandSpawn.instance.openChest(), s.Game.system.gameState = "modal", setTimeout(function () {
          $("win-modal").classList.add("fade"), $("frost").classList.add("visible");
        }, 500), $("edmonds-close").addEventListener("click", function () {
          t.system.hideWinModal(), s.Game.system.gameState = "over";
        }, !1), $("edmonds-cta").addEventListener("click", function () {
          t.system.hideWinModal(), s.Game.system.gameState = "over";
        }, !1);
      });
    }, t.prototype.showCreditModal = function () {
      this.buildCreditModal(), s.Game.system.gameState = "modal", setTimeout(function () {
        $("credit-modal").classList.add("fade"), $("frost").classList.add("visible");
      }, 50), $("edmonds-close").addEventListener("click", function () {
        t.system.hideCreditModal(), s.Game.system.gameState = "over";
      }, !1), $("edmonds-cta").addEventListener("click", function () {
        t.system.hideCreditModal(), s.Game.system.gameState = "over";
      }, !1);
    }, t.prototype.hideWinModal = function () {
      this.modal = $("win-modal"), this.modal.classList.remove("fade"), $("frost").classList.remove("visible"), setTimeout(function () {
        document.body.removeChild($("win-modal"));
      }, 350), setTimeout(function () {
        r.IslandSpawn.instance.closeChest();
      }, 500);
    }, t.prototype.hideCreditModal = function () {
      this.credits = $("credit-modal"), this.credits.classList.remove("fade"), $("frost").classList.remove("visible"), setTimeout(function () {
        document.body.removeChild($("credit-modal"));
      }, 350);
    }, t;
  }();
exports.Interface = a;

/***/ },

/***/ "./src/islandSpawn.js"
/*!****************************!*\
  !*** ./src/islandSpawn.js ***!
  \****************************/
(__unused_webpack_module, exports, __webpack_require__) {



var _s,
  n = this && this.__extends || (_s = function s(t, e) {
    return (_s = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (t, e) {
      t.__proto__ = e;
    } || function (t, e) {
      for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
    })(t, e);
  }, function (t, e) {
    function i() {
      this.constructor = t;
    }
    _s(t, e), t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, new i());
  });
exports.__esModule = !0;
var r = __webpack_require__(/*! ./system.js */ "./src/system.js"),
  a = __webpack_require__(/*! ./gameObject.js */ "./src/gameObject.js"),
  o = __webpack_require__(/*! ./interface.js */ "./src/interface.js"),
  h = __webpack_require__(/*! ./sprites.js */ "./src/sprites.js"),
  c = function () {
    function t() {
      if (t.instance) return t.instance;
      t.instance = this, this.x = 1280, this.y = 512, this.reset();
    }
    return t.prototype.reset = function () {
      this.isSpawned = !1, this.chestObj = null, this.bottleObj = null, this.island = null, document.removeEventListener("click", this.showModal, !1), document.removeEventListener("mousemove", this.mouseHover, !1);
    }, t.prototype.spawnIsland = function () {
      var t = r.Game.system.width / 2 - this.x / 2,
        e = r.Game.system.height;
      this.island = new p(t, e, this.x, this.y), r.Game.system.objLower.push(this.island), this.spawnChest(), this.spawnBottle();
    }, t.prototype.moveIsland = function () {
      var t = r.Game.system.height / 3 - 156 - this.island.y;
      r.Game.system.gameObjects.filter(function (t) {
        return "Player" !== t.ObjectName;
      }).forEach(function (e) {
        e.move(0, t);
      });
    }, t.prototype.spawnChest = function () {
      var t = this.island.x + 700,
        e = this.island.y + 160,
        i = new l(t, e, 128, 128);
      r.Game.system.objMain.push(i), this.chestObj = i;
    }, t.prototype.spawnBottle = function () {
      var t = this.island.x + 440,
        e = this.island.y + 190,
        i = new u(t, e, 64, 64);
      r.Game.system.objMain.push(i), this.bottleObj = i;
    }, t.prototype.openChest = function () {
      this.chestObj.isOpening = !0;
    }, t.prototype.closeChest = function () {
      this.chestObj.whichFrame = 0, this.chestObj.isOpening = !1, this.chestObj.animCounter = 0;
    }, t.prototype.handleEndClick = function () {
      document.addEventListener("click", this.showModal, !1), document.addEventListener("mousemove", this.mouseHover, !1);
    }, t.prototype.showModal = function (e) {
      if (e.preventDefault(), "modal" !== r.Game.system.gameState) {
        var i = parseInt(e.clientX),
          s = parseInt(e.clientY),
          n = t.instance,
          a = [n.chestObj.x, n.chestObj.y, n.chestObj.width, n.chestObj.height],
          h = [n.bottleObj.x, n.bottleObj.y, n.bottleObj.width, n.bottleObj.height];
        i >= a[0] && i <= a[0] + a[2] && s >= a[1] && s <= a[1] + a[3] ? o.Interface.system.showWinModal() : i >= h[0] && i <= h[0] + h[2] && s >= h[1] && s <= h[1] + h[3] && o.Interface.system.showCreditModal();
      }
    }, t.prototype.mouseHover = function (e) {
      if (e.preventDefault(), "modal" !== r.Game.system.gameState) {
        var i = parseInt(e.clientX),
          s = parseInt(e.clientY),
          n = t.instance,
          a = [n.chestObj.x, n.chestObj.y, n.chestObj.width, n.chestObj.height],
          o = [n.bottleObj.x, n.bottleObj.y, n.bottleObj.width, n.bottleObj.height];
        document.body.style.cursor = i >= a[0] && i <= a[0] + a[2] && s >= a[1] && s <= a[1] + a[3] ? "pointer" : i >= o[0] && i <= o[0] + o[2] && s >= o[1] && s <= o[1] + o[3] ? "pointer" : "default";
      }
    }, t;
  }();
exports.IslandSpawn = c;
var p = function (t) {
  function e(e, i, s, n) {
    var r = t.call(this, "Island", e, i, s, n, h.island1280Sprite(), 0) || this;
    return r.box = new a.ObjectArea(r, 0, 128, s, n / 2), r.isInBack = !0, r.reset(), r;
  }
  return n(e, t), e.prototype.reset = function () {}, e.prototype.update = function () {
    t.prototype.update.call(this);
  }, e.prototype.draw = function (e) {
    t.prototype.draw.call(this, e);
  }, e;
}(a.GameObject);
exports.Island = p;
var l = function (t) {
  function e(e, i, s, n) {
    var r = t.call(this, "Chest", e, i, s, n, h.chestSprite()) || this;
    return r.whichFrame = 0, r.reset(), r;
  }
  return n(e, t), e.prototype.reset = function () {
    this.whichSparkleFrame = 0, this.animCounter = 0, this.animRate = r.Game.system.fps / 10, this.isOpening = !1;
  }, e.prototype.update = function () {
    t.prototype.update.call(this);
  }, e.prototype.draw = function (e) {
    this.refreshCounter++, this.refreshCounter % this.refreshRate == 0 && (this.refreshCounter = 0, this.whichSparkleFrame = (this.whichSparkleFrame + 1) % 3), this.animCounter % this.animRate == 0 && !0 === this.isOpening && (this.animCounter = 0, this.whichFrame += 1), this.animCounter += 1, this.whichFrame > 2 && (this.whichFrame = 2, this.isOpening = !1), t.prototype.draw.call(this, e), this.sprite.draw(e, Math.floor(this.x), Math.floor(this.y), this.whichSparkleFrame, 1);
  }, e;
}(a.GameObject);
exports.Chest = l;
var u = function (t) {
  function e(e, i, s, n) {
    var r = t.call(this, "Bottle", e, i, s, n, h.bottleSprite(), 0) || this;
    return r.reset(), r;
  }
  return n(e, t), e.prototype.reset = function () {
    this.whichSparkleFrame = 0;
  }, e.prototype.update = function () {
    t.prototype.update.call(this);
  }, e.prototype.draw = function (e) {
    this.refreshCounter++, this.refreshCounter % this.refreshRate == 0 && (this.refreshCounter = 0, this.whichSparkleFrame = (this.whichSparkleFrame + 1) % 3), t.prototype.draw.call(this, e), h.chestSprite().draw(e, Math.floor(this.x - 32), Math.floor(this.y - 32), this.whichSparkleFrame, 1);
  }, e;
}(a.GameObject);
exports.Bottle = u;

/***/ },

/***/ "./src/network.js"
/*!************************!*\
  !*** ./src/network.js ***!
  \************************/
(module) {



var socket = null;
function getRoomId() {
  var hash = window.location && window.location.hash ? window.location.hash.replace(/^#/, '') : '';
  return hash || 'lobby';
}
function connect() {
  if (socket) return socket;
  if (!window.io) {
    console.warn("socket.io not ready yet");
    return null;
  }
  socket = window.io(); // 发起链接请求

  socket.on('connect', function () {
    console.log('network connected', socket.id);
    socket.emit('join', {
      roomId: getRoomId(),
      x: 0,
      y: 0,
      pose: 'idle',
      frame: 0
    });
  });
  socket.on('joined', function (data) {
    console.log('joined ok', data);
    if (data && data.roomId) {
      window.location.hash = '#' + data.roomId;
    }
  });
  socket.on('playerJoined', function (player) {
    window.dispatchEvent(new CustomEvent('network-player-joined', {
      detail: player
    }));
    console.log('player joined', player);
  });
  socket.on('playerLeft', function (player) {
    window.dispatchEvent(new CustomEvent('network-player-left', {
      detail: player
    }));
  });
  socket.on('state-update', function (state) {
    window.dispatchEvent(new CustomEvent('network-state-update', {
      detail: state
    }));
  });
  socket.on('start', function (data) {
    window.dispatchEvent(new CustomEvent('network-start', {
      detail: data || {}
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

/***/ },

/***/ "./src/objects.js"
/*!************************!*\
  !*** ./src/objects.js ***!
  \************************/
(__unused_webpack_module, exports, __webpack_require__) {



var _s,
  n = this && this.__extends || (_s = function s(t, e) {
    return (_s = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (t, e) {
      t.__proto__ = e;
    } || function (t, e) {
      for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
    })(t, e);
  }, function (t, e) {
    function i() {
      this.constructor = t;
    }
    _s(t, e), t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, new i());
  });
exports.__esModule = !0;
var r = __webpack_require__(/*! ./gameObject.js */ "./src/gameObject.js"),
  a = __webpack_require__(/*! ./system.js */ "./src/system.js"),
  o = __webpack_require__(/*! ./sprites.js */ "./src/sprites.js"),
  h = function (t) {
    function e(e, i, s) {
      var n = t.call(this, e, i, 64, 64, o.objects64Sprite(), s) || this;
      return n.box = new r.ObjectArea(n, 8, 36, 48, 20), n.hasRipple = !0, n;
    }
    return n(e, t), e;
  }(r.Obstacle);
exports.Objects64 = h;
var c = function (t) {
  function e(e, i, s) {
    var n = t.call(this, e, i, 32, 32, o.objects32Sprite(), s) || this;
    return n.box = new r.ObjectArea(n, 2, 20, 28, 12), n.hasRipple = !0, n.effect = "float", n;
  }
  return n(e, t), e;
}(r.Obstacle);
exports.Objects32 = c;
var p = function (t) {
  function e(e, i, s) {
    var n = t.call(this, e, i, 64, 64, o.interactive64Sprite(), s) || this;
    return n.box = new r.ObjectArea(n, 8, 12, 48, 40), n.isAnimated = !0, n.hasRipple = !0, n.isInBack = !0, n.effect = "ramp", n;
  }
  return n(e, t), e;
}(r.Obstacle);
exports.Ramp64 = p;
var l = function (t) {
  function e(e, i, s) {
    var n = t.call(this, e, i, 64, 64, o.interactive64Sprite(), s) || this;
    return n.box = new r.ObjectArea(n, -64, -64, 192, 192), n.isAnimated = !0, n.hasRipple = !0, n.effect = "tentacle", n;
  }
  return n(e, t), e;
}(r.Obstacle);
exports.Tentacle64 = l;
var u = function (t) {
  function e(e, i, s) {
    var n = t.call(this, e, i, 64, 64, o.interactive64Sprite(), s) || this;
    return n.box = new r.ObjectArea(n, 4, 8, 56, 48), n.isAnimated = !0, n.isInBack = !0, n.effect = "slow", n;
  }
  return n(e, t), e;
}(r.Obstacle);
exports.Wake64 = u;
var d = function (t) {
  function e(e, i, s) {
    var n = t.call(this, e, i, 192, 64, o.interactive192Sprite(), s) || this;
    return n.box = new r.ObjectArea(n, 8, 8, 176, 48), n.isAnimated = !0, n.isInBack = !0, n.effect = "slow", n;
  }
  return n(e, t), e;
}(r.Obstacle);
exports.Wake192 = d;
var m = function (t) {
  function e(e, i, s) {
    var n = t.call(this, e, i, 64, 64, o.interactive64Sprite(), s) || this;
    return n.box = new r.ObjectArea(n, 4, 8, 56, 48), n.isAnimated = !0, n.isInBack = !0, n.effect = "superslow", n;
  }
  return n(e, t), e;
}(r.Obstacle);
exports.Seaweed64 = m;
var f = function (t) {
  function e(e, i, s) {
    var n = t.call(this, e, i, 192, 64, o.interactive192Sprite(), s) || this;
    return n.box = new r.ObjectArea(n, 8, 8, 176, 48), n.isAnimated = !0, n.isInBack = !0, n.effect = "superslow", n;
  }
  return n(e, t), e;
}(r.Obstacle);
exports.Seaweed192 = f;
var y = function (t) {
  function e(e, i, s) {
    var n = t.call(this, e, i, 64, 64, o.interactive64Sprite(), s) || this;
    return n.animCounter = 0, n.animRate = a.Game.system.fps / 10, n.isAnimated = !0, n.hasRipple = !0, n.isInBack = !0, n.effect = "powerup", n;
  }
  return n(e, t), e;
}(r.Obstacle);
exports.Powerup64 = y;
var w = function (t) {
  function e(e, i, s) {
    var n = t.call(this, e, i, 128, 128, o.swirl128Sprite(), s) || this;
    return n.box = new r.ObjectArea(n, 16, 32, 96, 64), n.isAnimated = !0, n.isInBack = !0, n.effect = "spin", n;
  }
  return n(e, t), e;
}(r.Obstacle);
exports.Whirlpool128 = w;
var b = function (t) {
  function e(e, i, s) {
    var n = t.call(this, e, i, 64, 64, o.ambient64Sprite(), 0) || this;
    return n.box = new r.ObjectArea(n, -128, -128, 320, 172), n.animCounter = 0, n.animRate = a.Game.system.fps / 10, n.whichFrame = 6 * s, n.whichPose = -1, n.ambientInstance = s, n.hasRipple = !0, n.isInBack = !0, n.effect = "ambient", n;
  }
  return n(e, t), e;
}(r.Obstacle);
exports.Ambient64 = b;
var v = function (t) {
  function e(e, i, s) {
    var n = t.call(this, e, i, 256, 128, o.sandbar256Sprite(), s) || this;
    return n.box = new r.ObjectArea(n, 20, 72, 216, 24), n;
  }
  return n(e, t), e;
}(r.Obstacle);
exports.Sandbar256 = v;
var S = function (t) {
  function e(e, i, s) {
    var n = t.call(this, e, i, 64, 64, o.objects64Sprite(), s) || this;
    return n.box = new r.ObjectArea(n, 8, 36, 48, 20), n.hasRipple = !0, n;
  }
  return n(e, t), e;
}(r.Obstacle);
exports.Characters64 = S;
var g = function (t) {
  function e(e, i, s) {
    var n = t.call(this, e, i, 64, 64, o.interactive64Sprite(), s) || this;
    return n.box = new r.ObjectArea(n, -32, -32, 128, 128), n.isAnimated = !0, n.hasRipple = !0, n.effect = "dogsurf", n;
  }
  return n(e, t), e;
}(r.Obstacle);
exports.Dog64 = g;
var P = function (t) {
  function e(e, i, s) {
    var n = t.call(this, e, i, 64, 64, o.interactive64Sprite(), s) || this;
    return n.isAnimated = !0, n.hasRipple = !0, n.effect = null, n;
  }
  return n(e, t), e;
}(r.Obstacle);
exports.DogCrash64 = P;

/***/ },

/***/ "./src/player.js"
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
(__unused_webpack_module, exports, __webpack_require__) {



var _s,
  n = this && this.__extends || (_s = function s(t, e) {
    return (_s = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (t, e) {
      t.__proto__ = e;
    } || function (t, e) {
      for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
    })(t, e);
  }, function (t, e) {
    function i() {
      this.constructor = t;
    }
    _s(t, e), t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, new i());
  });
exports.__esModule = !0;
var r = __webpack_require__(/*! ./system.js */ "./src/system.js"),
  a = __webpack_require__(/*! ./spawn.js */ "./src/spawn.js"),
  o = __webpack_require__(/*! ./gameObject.js */ "./src/gameObject.js"),
  h = __webpack_require__(/*! ./sprites.js */ "./src/sprites.js"),
  c = function (t) {
    function e(i, s, n) {
      var r = t.call(this, "Player", i, s, 64, 64, n) || this;
      return e.instance ? e.instance : (e.instance = r, r.box = new o.ObjectArea(r, 16, 32, 32, 32), r.reset(), r);
    }
    return n(e, t), e.prototype.reset = function () {
      this.updateInterval(), this.initialSpeed = 1.25, this.maxSpeed = 7.5, this.maxAirSpeed = 1.5 * this.maxSpeed, this.maxBoostSpeed = 1.75 * this.maxSpeed, this.xSpeed = 0, this.trackX = 0, this.ySpeed = 0, this.state = "stop", this.airTimer = 0, this.crashTimer = 0, this.boostTimer = 0, this.dogTimer = 0, this.frameCounter = 0, this.trick = 0, this.maxTricks = 4, this.isMoving = !1, this.character = 3, this.surfboardSprite = h.surfboard64Sprite(), this.sprite = h.player64Sprite(), this.usingKonamiSprite = !1, this.dogSprite = h.dogsurf64Sprite(), this.collectedDog = !1, this.shieldSprite = h.swirl128Sprite(), this.surfboardPose = 0, this.dogFrame = 0, this.dogOffset = 0, this.totalCharacters = 7, this.surfRefreshCounter = 0, this.surfRefreshRate = r.Game.system.fps / 10, this.whichFrame = 0, this.whichPose = this.character, this.readyToStart = !1, this.pendingStartState = "down";
    }, e.prototype.updateInterval = function () {
      this.accel = r.Game.system.interval / 4 * .06;
    }, e.prototype.update = function () {
      this.updateInterval(), this.updatePlayerState(), this.trackX += this.xSpeed * r.Game.system.interval,
      // 钳制横向赛道范围（和 spawn.js 障碍物生成范围 -928..1312 一致），
      // 撞到左右边界时停止横向滚动，避免无限横移把障碍物全部甩出屏幕。
      this.trackX < -928 ? (this.trackX = -928, this.xSpeed = 0) : this.trackX > 1312 && (this.trackX = 1312, this.xSpeed = 0), this.move(0, 0), this.surfRefreshCounter % this.surfRefreshRate == 0 && (this.surfRefreshCounter = 0, this.surfboardPose = (this.surfboardPose + 1) % 3, this.dogTimer > 0 && (this.dogTimer -= 1)), this.surfRefreshCounter++;
    }, e.prototype.updatePlayerState = function () {
      switch (r.Game.system.clearPath && this.finalStretch(), this.boostTimer > 0 && this.boosting(), this.airTimer > 0 && this.airborne(), this.crashTimer > 0 && this.crashed(), this.state) {
        case "left":
          this.isMoving = !0, this.maxSpeed = 6, this.xSpeed = .8 * -this.ySpeed;
          break;
        case "left-down":
          this.isMoving = !0, this.maxSpeed = 7, this.xSpeed = .4 * -this.ySpeed;
          break;
        case "down":
        case "air" + this.trick:
          this.isMoving = !0, this.maxSpeed = 7.5, this.xSpeed = 0;
          break;
        case "right-down":
          this.isMoving = !0, this.maxSpeed = 7, this.xSpeed = .4 * this.ySpeed;
          break;
        case "right":
          this.isMoving = !0, this.maxSpeed = 6, this.xSpeed = .8 * this.ySpeed;
          break;
        case "stop":
        case "crash":
        case "lose":
        case "win":
          this.maxSpeed = 7.5, this.isMoving = !1, this.xSpeed = 0, this.ySpeed = 0;
      }
      this.isMoving && (this.ySpeed < this.initialSpeed && (this.ySpeed = this.initialSpeed), this.ySpeed < this.maxSpeed && (this.ySpeed += this.accel), 0 === this.boostTimer && 0 === this.airTimer && this.ySpeed > this.maxSpeed && (this.ySpeed -= 2 * this.accel));
    }, e.prototype.updatePlayerFrame = function () {
      switch (this.state) {
        case "stop":
          this.whichFrame = 0;
          break;
        case "left":
          this.whichFrame = 1;
          break;
        case "left-down":
          this.whichFrame = 2;
          break;
        case "down":
          this.whichFrame = 3;
          break;
        case "right-down":
          this.whichFrame = 4;
          break;
        case "right":
          this.whichFrame = 5;
          break;
        case "crash":
          this.whichFrame = 6;
          break;
        case "lose":
          this.whichFrame = 7;
          break;
        case "win":
          this.whichFrame = 8;
          break;
        case "air" + this.trick:
          this.whichFrame = 9 + this.trick;
      }
      this.whichPose = this.character;
    }, e.prototype.konamiSprite = function () {
      this.sprite = h.konami64Sprite(), this.usingKonamiSprite = !0, this.character = 0, this.totalCharacters = 1;
    }, e.prototype.renderCharacterSelection = function (t) {
      // 只显示当前框选的这个角色（居中），不再渲染整排待选角色，避免和玩家 2 重叠
      this.surfboardSprite.draw(t, Math.floor(this.x), Math.floor(this.y), 5, this.surfboardPose);
      this.sprite.draw(t, Math.floor(this.x), Math.floor(this.y), 5, this.character);
    }, e.prototype.objectToNewArray = function (t, e, i) {
      var s = e.splice(t, 1)[0];
      i.push(s);
    }, e.prototype.boosting = function () {
      this.frameCounter++, this.frameCounter % r.Game.system.fps == 0 && (this.boostTimer -= 1), this.boostTimer <= 1 && this.ySpeed > this.maxSpeed ? this.ySpeed -= 12 * this.accel : this.ySpeed < this.maxBoostSpeed && (this.ySpeed += 8 * this.accel), 0 === this.boostTimer && this.ySpeed > this.maxSpeed && (this.ySpeed = this.maxSpeed);
    }, e.prototype.airborne = function () {
      if (this.frameCounter++, this.frameCounter % r.Game.system.fps == 0 && (this.airTimer -= 1), this.airTimer <= 1 && this.ySpeed > this.maxSpeed ? (this.ySpeed -= 4 * this.accel, this.airTimer <= 1 && this.ySpeed <= this.maxSpeed && (this.airTimer = 0)) : this.ySpeed < this.maxAirSpeed && (this.ySpeed += 24 * this.accel), this.state = "air" + this.trick, 0 === this.airTimer) return this.ySpeed = this.maxSpeed, this.state = "down", void this.objectToNewArray(r.Game.system.objUpper.findIndex(function (t) {
        return "Player" === t.ObjectName;
      }), r.Game.system.objUpper, r.Game.system.objMain);
    }, e.prototype.crashed = function () {
      if (this.frameCounter++, this.boostTimer = 0, this.airTimer = 0, this.state = "crash", this.frameCounter % r.Game.system.fps == 0 && (this.crashTimer -= 1), 0 === this.crashTimer) return this.crashTimer = 0, this.ySpeed = this.initialSpeed, this.state = "stop", void this.objectToNewArray(r.Game.system.objLower.findIndex(function (t) {
        return "Player" === t.ObjectName;
      }), r.Game.system.objLower, r.Game.system.objMain);
    }, e.prototype.boost = function () {
      r.Game.system.powerups > 0 && 0 === this.boostTimer && "air" !== this.state.substring(0, 3) && 0 === this.crashTimer && this.ySpeed > 0 && (this.frameCounter = 0, this.boostTimer = 5, r.Game.system.removePowerup());
    }, e.prototype.jump = function () {
      this.state.substring(0, 3), this.frameCounter = 0, this.airTimer = 2, this.trick = 0, this.state = "air" + this.trick, this.boostTimer = 0, this.objectToNewArray(r.Game.system.objMain.findIndex(function (t) {
        return "Player" === t.ObjectName;
      }), r.Game.system.objMain, r.Game.system.objUpper), r.Game.system.tricks += 1;
    }, e.prototype.fall = function () {
      this.crashDog(), r.Game.system.removeLife(), this.objectToNewArray(r.Game.system.objMain.findIndex(function (t) {
        return "Player" === t.ObjectName;
      }), r.Game.system.objMain, r.Game.system.objLower), r.Game.system.lives > 0 ? (this.frameCounter = 0, this.crashTimer = 1) : r.Game.system.gameLose();
    }, e.prototype.slow = function () {
      this.ySpeed = .66 * this.ySpeed;
    }, e.prototype.superSlow = function () {
      this.ySpeed = .5 * this.ySpeed;
    }, e.prototype.spin = function () {
      var t = ["left", "left-down", "right", "right-down"];
      "down" === this.state ? this.state = t[r.Game.system.linearMap(0, 3)] : "left-down" === this.state || "left" === this.state ? this.state = t[r.Game.system.linearMap(2, 3)] : "right-down" !== this.state && "right" !== this.state || (this.state = t[r.Game.system.linearMap(0, 1)]);
    }, e.prototype.finalStretch = function () {
      this.state = "down", this.ySpeed = this.maxSpeed;
    }, e.prototype.crashDog = function () {
      this.collectedDog && (r.Game.system.removeAllShields(), this.collectedDog = !1, a.Spawn.instance.spawnCrashedDog());
    }, e.prototype.win = function () {
      this.state = "win", this.readyToStart = !1, this.draw(r.Game.system.ctx);
    }, e.prototype.lose = function () {
      this.state = "crash", this.readyToStart = !1, this.draw(r.Game.system.ctx);
    }, e.prototype.loseEnemy = function () {
      this.state = "lose", this.readyToStart = !1, this.draw(r.Game.system.ctx), this.crashDog();
    }, e.prototype.draw = function (e) {
      // console.log('draw player', this.state, this.whichFrame, this.whichPose, this.x, this.y);
      if ("waiting" === r.Game.system.gameState) {
        this.renderCharacterSelection(e);
        return;
      }
      if (this.collectedDog && "win" !== this.state) {
        this.shieldSprite.draw(e, Math.floor(this.x) - 32, Math.floor(this.y) - 24, 4 - r.Game.system.shields, this.surfboardPose);
      }
      this.updatePlayerFrame();
      this.surfboardSprite.draw(e, Math.floor(this.x), Math.floor(this.y), this.whichFrame, this.surfboardPose);
      t.prototype.draw.call(this, e);
      if (this.dogTimer > 0) {
        this.dogFrame = 13;
        this.dogOffset = 32;
      } else {
        this.dogFrame = this.whichFrame;
        this.dogOffset = 0;
      }
      if (this.collectedDog) {
        this.dogSprite.draw(e, Math.floor(this.x), Math.floor(this.y) - this.dogOffset, this.dogFrame, 0);
      }
    }, e;
  }(o.GameObject);
exports.Player = c;

/***/ },

/***/ "./src/record.js"
/*!***********************!*\
  !*** ./src/record.js ***!
  \***********************/
(__unused_webpack_module, exports) {



exports.__esModule = !0;
var s = Date.now(),
  n = 0;
exports.recordGameEnd = function (t, e) {
  var i = e.state || "lose",
    s = Math.round(t.distance) || 0,
    n = t.tricks || 0,
    r = t.boosts || 0,
    a = !!e.collectedDog,
    o = t.escapes || 0,
    h = {
      endCondition: i,
      distance: s,
      rampsHit: n,
      powerupsCollected: t.powerupsCollected || 0,
      powerupsUsed: r,
      dogSaved: a,
      krakensAvoided: o,
      konamiCodeUsed: !!e.usingKonamiSprite,
      msftCodeUsed: !!t.infiniteLives,
      edgeCodeUsed: !!t.infinitePowerups,
      krakenCodeUsed: !!t.krakenCodeUsed
    };
  "win" === i && (h.remainingLives = t.lives, h.remainingShields = t.shields, h.remainingPowerups = t.powerups), "undefined" != typeof chrome && "function" == typeof chrome.send && chrome.send("record-game-end", [h]);
}, exports.recordGameStart = function () {
  n += 1;
}, window.addEventListener("beforeunload", function () {
  var t = Date.now() - s;
  "undefined" != typeof chrome && "function" == typeof chrome.send && chrome.send("record-unload", [n, t]);
});

/***/ },

/***/ "./src/rng.js"
/*!********************!*\
  !*** ./src/rng.js ***!
  \********************/
(__unused_webpack_module, exports) {



exports.__esModule = !0;

// mulberry32：小巧、够用的伪随机数生成器（游戏用，非加密）。
// 返回一个函数，每次调用返回 [0, 1) 的伪随机数。
function mulberry32(seed) {
  var a = seed >>> 0;
  return function () {
    a = a + 0x6D2B79F5 >>> 0;
    var t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// 把 (seed, slot) 混成一个新的 32 位种子，保证不同 slot 的随机序列互不相关。
function hashSeed(seed, slot) {
  var x = (seed | 0) ^ Math.imul(slot | 0, 0x9E3779B9);
  x = Math.imul(x ^ x >>> 16, 0x7FEB352D);
  x = Math.imul(x ^ x >>> 15, 0x846CA68B);
  return (x ^ x >>> 16) >>> 0;
}
exports.mulberry32 = mulberry32;
exports.hashSeed = hashSeed;

/***/ },

/***/ "./src/spawn.js"
/*!**********************!*\
  !*** ./src/spawn.js ***!
  \**********************/
(__unused_webpack_module, exports, __webpack_require__) {



exports.__esModule = !0;
var s = __webpack_require__(/*! ./system.js */ "./src/system.js"),
  n = __webpack_require__(/*! ./player.js */ "./src/player.js"),
  r = __webpack_require__(/*! ./surfer.js */ "./src/surfer.js"),
  a = __webpack_require__(/*! ./enemy.js */ "./src/enemy.js"),
  o = __webpack_require__(/*! ./collisions.js */ "./src/collisions.js"),
  h = __webpack_require__(/*! ./objects.js */ "./src/objects.js"),
  c = __webpack_require__(/*! ./gameObject.js */ "./src/gameObject.js"),
  p = __webpack_require__(/*! ./sprites.js */ "./src/sprites.js"),
  g = __webpack_require__(/*! ./rng.js */ "./src/rng.js") //这是一行测试注释1122
  ,
  l = function () {
    function t() {
      if (t.instance) return t.instance;
      t.instance = this, this.reset();
    }
    return t.prototype.reset = function () {
      this.player = [], this.remotePlayers = {}, this.obstacles = [], this.surfers = [], this.enemies = [], this.chance = 0, this.spawnAccum = 25e-5, this.spawnRate = (.5 + this.spawnAccum) * this.chance,
      // 以下生成阈值和 system.js 的 winDistance(29625) 同单位（像素）。
      // 缩短/拉长赛道时需同步等比缩放，否则敌人/道具可能整场都不会出现。
      this.nextObstacle = 188, this.nextCenterObstacle = 1500, this.freqCenterObstacle = 1125,
      // 障碍物密度随进度缓慢增加：每生成 freqObstacleRamp 个障碍物，间隔缩短 1px，
      // 直到降到 freqObstacleMin 为止。间隔越大越稀疏，越小越密集。
      // 只依赖 obstacleCount（双方一致），所以两边地图仍完全相同。
      this.freqObstacle = 38, this.freqObstacleMin = 22, this.freqObstacleRamp = 30, this.nextSurfer = 750, this.freqSurfer = 188, this.nextEnemy = 7500, this.freqEnemy = 3000, this.nextPowerup = 7500, this.freqPowerup = 5625, this.nextRamp = 1875, this.freqRamp = 2625, this.nextTentacle = 2250, this.freqTentacle = 2250, this.nextDog = 6000, this.freqDog = 6000, this.nextIsland = 375, this.freqIsland = 375, this.nextCharacter = 3750, this.freqCharacter = 1875, this.characterIncrement = 0, this.obstacleCount = 0, this.surferCount = 0, this.enemyCount = 0;
    }, t.prototype.slotRng = function (slot) {
      return g.mulberry32(g.hashSeed(s.Game.system.seed || 0, slot));
    }, t.prototype.slotMap = function (rng, min, max) {
      return Math.floor(min + (max + .99 - min) * rng());
    }, t.prototype.update = function () {
      this.obstacles = o.Collisions.instance.obstacles, this.surfers = o.Collisions.instance.surfers, this.enemies = o.Collisions.instance.enemies;
      var e = s.Game.system.distance;

      // 障碍物：到达距离阈值就生成，间隔由种子抖动，保证两边赛道一致
      while (e >= this.nextObstacle) {
        var rngOb = this.slotRng(this.obstacleCount),
          gap = this.freqObstacle - Math.floor(this.obstacleCount / this.freqObstacleRamp);
        gap < this.freqObstacleMin && (gap = this.freqObstacleMin), this.spawnNewObstacle(null, rngOb, this.nextObstacle), this.nextObstacle += gap + Math.floor(rngOb() * 22), this.obstacleCount += 1;
      }
      // 冲浪者：同样按距离确定性生成
      while (e >= this.nextSurfer) {
        var rngSf = this.slotRng(1e6 + this.surferCount);
        this.spawnNewSurfer(null, rngSf), this.nextSurfer += this.freqSurfer + Math.floor(rngSf() * this.freqSurfer), this.surferCount += 1;
      }
      // 敌人：按距离确定性生成（去掉原来"空中不生成"的本机状态判断）
      while (e >= this.nextEnemy) {
        var rngEn = this.slotRng(2e6 + this.enemyCount);
        this.spawnNewEnemy(null, 0, 0, null, rngEn), this.nextEnemy += this.freqEnemy + Math.floor(rngEn() * this.freqEnemy), this.enemyCount += 1;
      }
    }, t.prototype.spawnPlayer = function (t, e) {
      console.log('spawnPlayer', t, e), this.player = new n.Player(Math.floor(t / 2) - 32, Math.floor(e / 3) - 32), n.Player.instance.reset(), s.Game.system.objMain.push(this.player);
    }, t.prototype.spawnRemotePlayer = function (id, x, y, state) {
      void 0 === state && (state = {}), !id && (id = "remote-player");
      var remoteState = Object.assign({
        id: id,
        x: x || 0,
        y: y || 0,
        state: "stop",
        frame: 0,
        character: 3,
        surfboardPose: 0,
        distance: 0,
        trackX: 0,
        shield: !1,
        ready: !1,
        ended: !1,
        finished: !1,
        waitOnDeath: !1
      }, state);
      if (!s.Game.system.remotePlayers) s.Game.system.remotePlayers = {};
      if (s.Game.system.remotePlayers[id]) {
        s.Game.system.remotePlayers[id].applyState(remoteState);
        return s.Game.system.remotePlayers[id];
      }
      var remotePlayer = new c.GameObject("RemotePlayer", remoteState.x, remoteState.y, 64, 64, p.player64Sprite(), 0);
      remotePlayer.id = remoteState.id;
      remotePlayer.character = remoteState.character;
      remotePlayer.state = remoteState.state;
      remotePlayer.frame = remoteState.frame;
      remotePlayer.surfboardPose = remoteState.surfboardPose;
      remotePlayer.distance = remoteState.distance;
      remotePlayer.trackX = remoteState.trackX || 0;
      remotePlayer.shield = !!remoteState.shield;
      remotePlayer.ready = !!remoteState.ready;
      remotePlayer.ended = !!remoteState.ended;
      remotePlayer.finished = !!remoteState.finished;
      remotePlayer.waitOnDeath = !!remoteState.waitOnDeath;
      remotePlayer.surfboardSprite = p.surfboard64Sprite();

      // 远程玩家不做本地物理更新，位置完全由服务器广播驱动
      remotePlayer.update = function () {};
      remotePlayer.applyState = function (nextState) {
        if (typeof nextState.x === "number") this.x = nextState.x;
        if (typeof nextState.y === "number") this.y = nextState.y;
        if (typeof nextState.frame === "number") this.frame = nextState.frame;
        if (typeof nextState.character === "number") this.character = nextState.character;
        if (typeof nextState.surfboardPose === "number") this.surfboardPose = nextState.surfboardPose;
        if (typeof nextState.distance === "number") this.distance = nextState.distance;
        if (typeof nextState.trackX === "number") this.trackX = nextState.trackX;
        this.shield = !!nextState.shield;
        this.ready = !!nextState.ready;
        if (typeof nextState.ended === "boolean") this.ended = nextState.ended;
        if (typeof nextState.finished === "boolean") this.finished = nextState.finished;
        if (typeof nextState.waitOnDeath === "boolean") this.waitOnDeath = nextState.waitOnDeath;
        if (nextState.state) this.state = nextState.state;
      };
      remotePlayer.draw = function (ctx) {
        var sys = s.Game.system;
        // 选人/准备阶段：在右侧预留一个位置展示对方，避免和本地玩家重叠
        if ("waiting" === sys.gameState || "ready" === sys.gameState) {
          var px = sys.width - 160,
            py = Math.floor(sys.height / 3) - 32,
            character = this.character || 0,
            label = this.ready ? "PLAYER 2 - READY" : this.ended || this.finished ? "WAITING FOR PLAYER 2" : "PLAYER 2";
          ctx.save();
          ctx.font = "bold 18px sans-serif";
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.fillText(label, px + 32, py - 18);
          ctx.restore();
          this.surfboardSprite && this.surfboardSprite.draw(ctx, px, py, 5, 0);
          this.sprite && this.sprite.draw(ctx, px, py, 5, character);
          return;
        }

        // 游戏中：本地玩家居中不动、世界在滚动，所以不能直接用对方的 x/y。
        // 水平方向用 trackX 差换算：对方和自己之间拉开的横向距离就是
        // (remote.trackX - local.trackX)，1:1 加到屏幕坐标上，两人横向拉开时幽灵会左右偏移。
        // 垂直方向用 distance 差换算：领先的（distance 更大）更靠近下方终点，
        // 落后的（distance 更小）更靠近上方起点。distance 现在就是像素，偏移 1:1，
        // 这样对方停住时，幽灵会以世界滚动速度向上飘走，正确表现"被甩在后面"。
        var local = n.Player.instance,
          dx = Math.floor(sys.width / 2) - 32 + ((this.trackX || 0) - (local ? local.trackX : 0)),
          dy = (local ? Math.floor(local.y) : Math.floor(sys.height / 3) - 32) + (this.distance - sys.distance);

        // 半透明幽灵，即使和本地玩家位置重合（平局）也能看清
        ctx.save();
        ctx.globalAlpha = .55;
        this.surfboardSprite && this.surfboardSprite.draw(ctx, dx, dy, this.frame || 0, this.surfboardPose || 0);
        this.sprite && this.sprite.draw(ctx, dx, dy, this.frame || 0, this.character || 0);
        ctx.restore();
      };
      s.Game.system.objMain.push(remotePlayer);
      s.Game.system.remotePlayers[id] = remotePlayer;
      return remotePlayer;
    }, t.prototype.spawnNewSurfer = function (t, rng) {
      void 0 === t && (t = null);
      var e = 0 === this.slotMap(rng, 0, 1) ? -56 : s.Game.system.height,
        i = this.slotMap(rng, 3, 12);
      null === t && ((t = new r.Surfer(s.Game.system.width / 2 - 32 + this.slotMap(rng, -608, 672) - (n.Player.instance ? n.Player.instance.trackX : 0), e)).maxSpeed = i), s.Game.system.objMain.push(t), t.surferInstance = this.slotMap(rng, 0, 8), t.surferInstance <= 5 ? t.surfboardInstance = this.slotMap(rng, 0, 5) : t.surfboardInstance = this.slotMap(rng, 6, 8), this.surfers.push(t);
    }, t.prototype.spawnNewEnemy = function (t, e, i, r, rng) {
      void 0 === t && (t = null), void 0 === e && (e = 0), void 0 === i && (i = 0), void 0 === r && (r = null);
      var enemy;
      if (null === t) enemy = new a.Enemy(rng ? s.Game.system.width / 2 - 32 + this.slotMap(rng, -608, 672) - (n.Player.instance ? n.Player.instance.trackX : 0) : Math.floor(Math.random() * s.Game.system.width), -118);else enemy = new a.Enemy(e, i);
      enemy.currentSpeed = null === r ? n.Player.instance.ySpeed + n.Player.instance.maxSpeed / 2 : r, s.Game.system.objMain.push(enemy), this.enemies.push(enemy);
    }, t.prototype.spawnNewObstacle = function (t, rng, spawnDistance) {
      void 0 === t && (t = null), null === t && (t = this.randomObstacle(rng, spawnDistance)), t.isInBack ? s.Game.system.objBack.push(t) : s.Game.system.objMain.push(t), this.obstacles.push(t);
    }, t.prototype.spawnPowerupRow = function () {
      for (var t = -3; t <= 4; t++) {
        var e = Math.floor(s.Game.system.width / 2) + 128 * t - 32 - 64,
          i = Math.floor(s.Game.system.height) - 128,
          n = new h.Powerup64(e, i, 1);
        s.Game.system.objBack.push(n), this.obstacles.push(n);
      }
    }, t.prototype.spawnCrashedDog = function () {
      var t = new h.DogCrash64(n.Player.instance.x + 24, n.Player.instance.y + 24, 11);
      s.Game.system.objMain.push(t), this.obstacles.push(t);
    }, t.prototype.randomObstacle = function (rng, spawnDistance) {
      // 障碍物 x 用"绝对赛道坐标"：固定 cx 再减去本地玩家当前 trackX，
      // 两人横向位置不同时，同一个障碍物会出现在各自屏幕的不同横坐标（拉开水平差）。
      var e = void 0 === spawnDistance ? s.Game.system.distance : spawnDistance,
        i = s.Game.system.width,
        tx = n.Player.instance ? n.Player.instance.trackX : 0,
        cx = this.slotMap(rng, -928, 1312),
        r = i / 2 - 32 + cx - tx,
        a = i / 2 - 32 + Math.floor(cx / 3) - tx,
        o = Math.floor(s.Game.system.height),
        types = [0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8, 9, 10, 10, 11],
        c = types[Math.floor(rng() * types.length)];

      // 每隔一段距离强制生成一个居中障碍物
      if (e > this.nextCenterObstacle) {
        r = i / 2 - 32 - tx;
        this.nextCenterObstacle += this.freqCenterObstacle;
      }

      // 特殊障碍物按距离门槛决定（去掉依赖本机状态的 air/collectedDog 判断）
      if (9 === c && e < this.nextCharacter) c = 0;else if (7 === c && e < this.nextPowerup) c = 0;else if (2 === c && e < this.nextRamp) c = 0;else if (6 === c && e < this.nextIsland) c = 0;else if (11 === c && e < this.nextDog) c = 0;else if (3 === c && e < this.nextTentacle) c = 5;

      // 调试：打印每个障碍物的生成距离和类型，两个客户端分别复制 console 输出对比即可验证地图是否一致
      // console.log("[MAP]", e, c);

      switch (c) {
        case 0:
          return new h.Objects64(r, o, this.slotMap(rng, 0, 16));
        case 1:
          return new h.Objects32(r, o, this.slotMap(rng, 0, 3));
        case 2:
          return this.nextRamp += this.freqRamp, new h.Ramp64(a, o, 0);
        case 3:
          return this.nextTentacle += this.freqTentacle, new h.Tentacle64(a, o, 3);
        case 4:
          return 0 === this.slotMap(rng, 0, 1) ? new h.Wake64(r, o, this.slotMap(rng, 4, 6)) : new h.Wake192(r, o, this.slotMap(rng, 0, 1));
        case 5:
          return 0 === this.slotMap(rng, 0, 1) ? new h.Seaweed64(r, o, this.slotMap(rng, 7, 9)) : new h.Seaweed192(r, o, 2);
        case 6:
          return this.nextIsland += this.freqIsland, new h.Sandbar256(r, o, this.slotMap(rng, 0, 4));
        case 7:
          return this.nextPowerup += this.freqPowerup, new h.Powerup64(a, o, 1);
        case 8:
          return new h.Ambient64(a, o, this.slotMap(rng, 0, 3));
        case 9:
          return this.characterIncrement += 1, this.characterIncrement > 3 && (this.characterIncrement = 0), this.nextCharacter = e + this.freqCharacter, new h.Characters64(a, o, 17 + this.characterIncrement);
        case 10:
          return new h.Whirlpool128(r, o, 0);
        case 11:
          var p = i / 2 - 32 + this.slotMap(rng, -200, 200);
          return this.nextDog += this.freqDog, new h.Dog64(p, o, 10);
      }
    }, t;
  }();
exports.Spawn = l;

/***/ },

/***/ "./src/sprites.js"
/*!************************!*\
  !*** ./src/sprites.js ***!
  \************************/
(__unused_webpack_module, exports) {



exports.__esModule = !0;
var s = function () {
  function t(t, e, i) {
    var s = $(t);
    this.numFrames = e, this.frameWidth = s.width / e, this.frameHeight = s.height / i, this.image = s;
  }
  return t.prototype.draw = function (t, e, i, s, n) {
    void 0 === n && (n = 0), t.drawImage(this.image, s * this.frameWidth, n * this.frameHeight, this.frameWidth, this.frameHeight, e, i, this.frameWidth, this.frameHeight);
  }, t;
}();
exports.Sprite = s, exports.surfboard64Sprite = function () {
  return new s("surfboard64", 13, 3);
}, exports.player64Sprite = function () {
  return new s("player64", 13, 7);
}, exports.konami64Sprite = function () {
  return new s("konami64", 13, 1);
}, exports.dogsurf64Sprite = function () {
  return new s("dogsurf64", 14, 1);
}, exports.enemy128Sprite = function () {
  return new s("enemy128", 10, 1);
}, exports.surfer64Sprite = function () {
  return new s("surfer64", 27, 2);
}, exports.objects64Sprite = function () {
  return new s("objects64", 21, 1);
}, exports.objects32Sprite = function () {
  return new s("objects32", 4, 1);
}, exports.interactive64Sprite = function () {
  return new s("interactive64", 12, 3);
}, exports.interactive192Sprite = function () {
  return new s("interactive192", 3, 3);
}, exports.ripple92Sprite = function () {
  return new s("ripple92", 1, 3);
}, exports.ambient64Sprite = function () {
  return new s("ambient64", 24, 1);
}, exports.swirl128Sprite = function () {
  return new s("swirl128", 4, 3);
}, exports.sandbar256Sprite = function () {
  return new s("sandbar256", 5, 1);
}, exports.island1280Sprite = function () {
  return new s("island1280", 1, 1);
}, exports.chestSprite = function () {
  return new s("chest128", 3, 2);
}, exports.bottleSprite = function () {
  return new s("bottle64", 1, 1);
};

/***/ },

/***/ "./src/surfer.js"
/*!***********************!*\
  !*** ./src/surfer.js ***!
  \***********************/
(__unused_webpack_module, exports, __webpack_require__) {



var _s,
  n = this && this.__extends || (_s = function s(t, e) {
    return (_s = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (t, e) {
      t.__proto__ = e;
    } || function (t, e) {
      for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
    })(t, e);
  }, function (t, e) {
    function i() {
      this.constructor = t;
    }
    _s(t, e), t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, new i());
  });
exports.__esModule = !0;
var r = __webpack_require__(/*! ./system.js */ "./src/system.js"),
  a = __webpack_require__(/*! ./gameObject.js */ "./src/gameObject.js"),
  o = __webpack_require__(/*! ./sprites.js */ "./src/sprites.js"),
  h = function (t) {
    function e(e, i) {
      var s = t.call(this, "Surfer", e, i, 64, 64, o.surfer64Sprite()) || this;
      return s.box = new a.ObjectArea(s, 16, 32, 32, 32), s.surferAngle = null, s.angleCounter = 0, s.crashCounter = 0, s.currentSpeed = 2, s.maxSpeed = 5, s.accel = .015, s.crashTimer = 0, s.surferInstance = 0, s.surfboardInstance = 6, s.surferSprite = o.surfer64Sprite(), s.surferBottomPose = 1, s.surfboardFrame = 0, s.angleInterval = 20, s.updateInterval(), s;
    }
    return n(e, t), e.prototype.updateInterval = function () {
      this.ySurfer = r.Game.system.interval * this.currentSpeed;
    }, e.prototype.update = function () {
      this.updateInterval(), t.prototype.update.call(this), this.crashTimer > 0 ? this.surferCrash() : (this.updatePosition(), this.updateDirection(), this.updateSprite());
    }, e.prototype.updatePosition = function () {
      switch (r.Game.system.clearPath ? this.surferSlowdown() : this.currentSpeed < this.maxSpeed && (this.currentSpeed += this.accel), this.surferAngle) {
        case "left":
          this.move(.3 * -this.ySurfer, this.ySurfer);
          break;
        case "right":
          this.move(.3 * this.ySurfer, this.ySurfer);
      }
    }, e.prototype.updateDirection = function () {
      if (this.angleCounter % this.angleInterval == 0) {
        this.angleCounter = 0, this.angleInterval = r.Game.system.linearMap(30, 60);
        var t = Math.random();
        this.surferAngle = t > .5 ? "left" : "right";
      }
      this.angleCounter++;
    }, e.prototype.updateSprite = function () {
      switch (this.surferAngle) {
        case "left":
          this.whichFrame = 3 * this.surferInstance + 0, this.surfboardFrame = 3 * this.surfboardInstance + 0;
          break;
        case "right":
          this.whichFrame = 3 * this.surferInstance + 1, this.surfboardFrame = 3 * this.surfboardInstance + 1;
      }
    }, e.prototype.surferCrash = function () {
      this.whichFrame = 3 * this.surferInstance + 2, this.surfboardFrame = 3 * this.surferInstance + 2, this.crashCounter++, this.crashCounter % r.Game.system.fps == 0 && (this.crashTimer -= 1), 0 === this.crashTimer && (this.currentSpeed = 1, this.crashTimer = 0, this.crashCounter = 0, this.hasRipple = !1);
    }, e.prototype.surferSlowdown = function () {
      this.currentSpeed > 0 && (this.currentSpeed -= 2 * this.accel);
    }, e.prototype.draw = function (e) {
      this.surferSprite.draw(e, Math.floor(this.x), Math.floor(this.y), this.surfboardFrame, this.surferBottomPose), t.prototype.draw.call(this, e);
    }, e;
  }(a.GameObject);
exports.Surfer = h;

/***/ },

/***/ "./src/system.js"
/*!***********************!*\
  !*** ./src/system.js ***!
  \***********************/
(__unused_webpack_module, exports, __webpack_require__) {



exports.__esModule = !0;
var s = __webpack_require__(/*! ./interface.js */ "./src/interface.js"),
  n = __webpack_require__(/*! ./collisions.js */ "./src/collisions.js"),
  r = __webpack_require__(/*! ./spawn.js */ "./src/spawn.js"),
  a = __webpack_require__(/*! ./cleanup.js */ "./src/cleanup.js"),
  o = __webpack_require__(/*! ./background.js */ "./src/background.js"),
  h = __webpack_require__(/*! ./player.js */ "./src/player.js"),
  c = __webpack_require__(/*! ./islandSpawn.js */ "./src/islandSpawn.js"),
  p = __webpack_require__(/*! ./record.js */ "./src/record.js"),
  g = __webpack_require__(/*! ./sprites.js */ "./src/sprites.js"),
  l = function () {
    function t(e, i) {
      if (t.system) return t.system;
      t.system = this, this.canvas = e, this.fps = i, this.interval = this.fps / 60, this.collisions = new n.Collisions(), this.spawn = new r.Spawn(), this.cleanup = new a.Cleanup(), this.background = new o.Background(), this.islandspawn = new c.IslandSpawn(), this["interface"] = new s.Interface(), this.waitOnDeath = !1, this.waitOnDeathTs = 0, this.initializeGame();
    }
    return t.prototype.initializeGame = function () {
      this.defineCanvas(this.canvas), this.resetStats(), this.resetGame(), this["interface"].buildInterface(), this.spawn.spawnPlayer(this.width, this.height), this["interface"].buildCharacterSelection(), this.background.setupGradient(this.winDistance), this.remotePlayers = {};
    }, t.prototype.defineCanvas = function (t) {
      this.ctx = t.getContext("2d"), this.ctx.imageSmoothingEnabled = !1, t.width = document.body.clientWidth, t.height = window.innerHeight, t.style.width = t.width + "px", t.style.height = t.height + "px", this.width = t.width, this.height = t.height;
    }, t.prototype.resetStats = function () {
      this.lives = 3, this.maxLives = 3, this.powerups = 0, this.powerupsCollected = 0, this.maxPowerups = 3, this.shields = 0, this.maxShields = 3, this.distance = 0, this.seed = 0,
      // distance 是像素（满速时每帧 +7.5px）；29625 = 3950 帧 × 7.5 = 原赛道的一半
      this.winDistance = 29625, this.clearPath = !1, this.dodges = 0, this.avoids = 0, this.tricks = 0, this.boosts = 0, this.escapes = 0, this.score = 0, this.infiniteLives = !1, this.infinitePowerups = !1, this.krakenCodeUsed = !1, this.updateFrames = 0, this.updateEnding = !1, this.finished = !1, this.ended = !1;
    }, t.prototype.resetGame = function () {
      this.gameState = "waiting", this.gameObjects = [], this.objUpper = [], this.objMain = [], this.objLower = [], this.objBack = [], this["interface"].reset(), this.background.reset(), this.collisions.reset(), this.spawn.reset(), this.islandspawn.reset(), this.cleanup.reset();
    }, t.prototype.reflowCanvas = function () {
      this.defineCanvas(this.canvas);
      var t = h.Player.instance,
        e = Math.round(this.width / 2) - (t.x + t.width / 2),
        i = Math.round(this.height / 3) - (t.y + t.height / 2);
      this.gameObjects.forEach(function (t) {
        return t.move(e, i);
      }), this.background.updateWater(e, i, this.interval, t.xSpeed, t.ySpeed);
    }, t.prototype.addLife = function () {
      this.lives < this.maxLives && (this.lives += 1, this["interface"].updateIcons());
    }, t.prototype.removeLife = function () {
      this.lives > 0 && !this.infiniteLives && (this.lives -= 1), this["interface"].updateIcons();
    }, t.prototype.removeAllLives = function () {
      this.infiniteLives = !1, this.lives = 0, this["interface"].updateIcons();
    }, t.prototype.addPowerup = function () {
      this.powerups < this.maxPowerups && (this.powerups += 1, this.powerupsCollected += 1, this["interface"].updateIcons());
    }, t.prototype.removePowerup = function () {
      this.powerups > 0 && !this.infinitePowerups && (this.powerups -= 1), this["interface"].updateIcons();
    }, t.prototype.removeAllPowerups = function () {
      this.infinitePowerups = !1, this.powerups = 0, this["interface"].updateIcons();
    }, t.prototype.addShields = function () {
      h.Player.instance.collectedDog = !0, this.shields = this.maxShields, this["interface"].updateIcons();
    }, t.prototype.removeShield = function () {
      this.shields > 0 && (this.shields -= 1), this["interface"].updateIcons();
    }, t.prototype.removeAllShields = function () {
      this.shields = 0, this["interface"].updateIcons();
    }, t.prototype.gameLoop = function (t) {
      "playing" === this.gameState || "ready" === this.gameState ? (this.interval = t / (1e3 / this.fps), this.updateAll(), this.checkWinDistance()) : "lose" === this.gameState && this.updateGameOver(), "dead" === this.gameState && this.checkOpponentEnded();
      this.updateDrawOrder();
      this.drawAll();
      if (window.Network && window.Network.sendState && window.currentPlayer) {
        window.Network.sendState({
          state: window.currentPlayer.state,
          frame: window.currentPlayer.whichFrame,
          character: window.currentPlayer.character,
          surfboardPose: window.currentPlayer.surfboardPose,
          distance: this.distance,
          trackX: window.currentPlayer.trackX,
          shield: !!window.currentPlayer.collectedDog,
          ready: !!window.currentPlayer.readyToStart,
          finished: !!this.finished,
          ended: !!this.ended,
          waitOnDeath: !!this.waitOnDeath,
          waitOnDeathTs: this.waitOnDeathTs || 0
        });
      }
    }, t.prototype.updateAll = function () {
      h.Player.instance.isMoving && (this.distance += h.Player.instance.ySpeed * t.system.interval, this.updateFrames % (1 * this.fps) == 0 && this.background.updateGradient(this.distance, this.winDistance), this.background.updateWater(0, 0, this.interval, h.Player.instance.xSpeed, h.Player.instance.ySpeed), this["interface"].update(), this.updateFrames++, this.distance < this.winDistance - 1.5 * this.height ? this.spawn.update() : this.distance > this.winDistance - this.height / 1.5 && !this.islandspawn.isSpawned && (this.clearPath = !0, this.islandspawn.isSpawned = !0, this.islandspawn.spawnIsland())), this.collisions.update(), this.gameObjects.forEach(function (t) {
        return t.update();
      }), this.cleanup.update(), this.updateDrawOrder();
    }, t.prototype.updateDrawOrder = function () {
      this.objMain = this.objMain.sort(function (t, e) {
        return t.box.y + t.box.height - (e.box.y + e.box.height);
      }), this.gameObjects = this.objBack.concat(this.objLower).concat(this.objMain).concat(this.objUpper);
    }, t.prototype.linearMap = function (t, e) {
      return Math.floor(t + (e + .99 - t) * Math.random());
    }, t.prototype.drawAll = function () {
      // console.log('drawAll called');
      var t = this;
      this.ctx.clearRect(0, 0, this.width, this.height), this.drawBoundaries(), this.gameObjects.forEach(function (e) {
        return e.draw(t.ctx);
      });
    }, t.prototype.drawBoundaries = function () {
      // 左右边界墙：固定在地图左右边界（赛道坐标 -992 / +1376），随世界滚动
      var spr = g.objects64Sprite(),
        anchor = Math.floor(this.width / 2) - 32,
        tx = h.Player.instance ? h.Player.instance.trackX : 0,
        leftX = anchor - 992 - tx,
        rightX = anchor + 1376 - tx,
        off = this.distance % 64;
      for (var y = -off; y < this.height; y += 64) spr.draw(this.ctx, Math.floor(leftX), Math.floor(y), 0, 0), spr.draw(this.ctx, Math.floor(rightX), Math.floor(y), 0, 0);
    }, t.prototype.checkWinDistance = function () {
      if (this.islandspawn.isSpawned) {
        if (this.islandspawn.island.y + 192 > h.Player.instance.y + h.Player.instance.height) return;
        this.gameWin();
      }
    }, t.prototype.updateGameOver = function () {
      this.updateEnding ? (this.gameObjects.filter(function (t) {
        return "Enemy" === t.ObjectName && t.gotPlayer;
      }).forEach(function (t) {
        t.enemyGrab();
      }), this.background.gameLoseGradient()) : this.gameState = "over";
    }, t.prototype.getOpponentDistance = function () {
      var ids = Object.keys(this.remotePlayers || {}),
        opp = ids.length ? this.remotePlayers[ids[0]] : null;
      return opp ? opp.distance || 0 : 0;
    }, t.prototype.gameLose = function () {
      this.handleLocalDeath();
    }, t.prototype.gameLoseEnemy = function () {
      this.handleLocalDeath();
    }, t.prototype.handleLocalDeath = function () {
      // 我被淘汰（撞死/被抓）。
      // 只有当「我是落后者 且 未勾选『落后者死亡不结束游戏』」时，本局才立即结束（比距离，我判负）；
      // 其余情况（我是领先者，或勾选了）进入等待，等对方到终点或也被淘汰。
      var iAmTrailing = this.distance < this.getOpponentDistance();
      if (iAmTrailing && !this.waitOnDeath) this.finishByDistance();else this.gameDead();
    }, t.prototype.gameDead = function () {
      // 我被淘汰且本局继续：进入等待，直到对方也结束（到终点/撞死/被抓）
      this.gameState = "dead", this.ended = !0, h.Player.instance.lose(), this["interface"].drawDeadWaiting(), this.removeAllLives(), this.removeAllPowerups();
    }, t.prototype.checkOpponentEnded = function () {
      if ("dead" !== this.gameState) return;
      var ids = Object.keys(this.remotePlayers || {});
      for (var i = 0; i < ids.length; i++) {
        var rp = this.remotePlayers[ids[i]];
        if (rp && (rp.ended || rp.finished)) {
          // 对方到终点则本地判负；双方都撞死/被抓则按距离判胜负
          rp.finished ? this.opponentFinished() : this.finishByDistance();
          return;
        }
      }
    }, t.prototype.opponentFinished = function () {
      // 对方先到终点，本地判负结束。
      // 只在本局 playing（对方先到）或 dead（等待时对方到终点）时处理；
      // 本地已重开进入 ready/waiting 时，对方的 finished 是上一局的旧状态，必须忽略，
      // 否则会出现"我重开后对方还没回来，却弹 OPPONENT WON"的问题。
      if ("playing" !== this.gameState && "dead" !== this.gameState) return;
      this.gameState = "over", this.ended = !0, h.Player.instance.lose(), p.recordGameEnd(this, h.Player.instance), this["interface"].drawGameOver("OPPONENT WON"), this.removeAllLives(), this.removeAllPowerups();
    }, t.prototype.opponentDied = function () {
      // 对方被淘汰（撞死/被抓）。
      // 只在本地 playing 时处理；本地已重开进入 ready/waiting 时，对方的 ended 是上一局的旧状态，应忽略。
      if ("playing" !== this.gameState) return;
      // 只有当「对方是落后者（我领先）且未勾选『落后者死亡不结束游戏』」时，本局才立即结束（我赢）；
      // 否则（对方是领先者，或勾选了）我继续跑。
      var opponentWasTrailing = this.getOpponentDistance() < this.distance;
      if (opponentWasTrailing && !this.waitOnDeath) this.finishByDistance();
    }, t.prototype.finishByDistance = function () {
      // 撞死/被抓导致结束时按距离判胜负：谁跑得更远谁赢
      var ids = Object.keys(this.remotePlayers || {}),
        opp = ids.length ? this.remotePlayers[ids[0]] : null,
        oppDist = opp ? opp.distance || 0 : 0,
        win = this.distance >= oppDist;
      this.gameState = "over", this.ended = !0, win ? h.Player.instance.win() : h.Player.instance.lose(), this["interface"].drawGameOver(win ? "YOU WIN" : "OPPONENT WON"), p.recordGameEnd(this, h.Player.instance), this.removeAllLives(), this.removeAllPowerups();
    }, t.prototype.gameWin = function () {
      this.islandspawn.moveIsland(), this.distance = this.winDistance, this["interface"].drawGameWin(), h.Player.instance.win(), this.gameState = "over", this.finished = !0, this.ended = !0, p.recordGameEnd(this, h.Player.instance), setTimeout(function () {
        c.IslandSpawn.instance.openChest();
      }, 500), setTimeout(function () {
        s.Interface.system.showWinModal();
      }, 1500), this.islandspawn.handleEndClick();
    }, t.prototype.applyRemoteState = function (state) {
      if (!state || !state.id) return;
      if (window.currentPlayer && state.id === window.currentPlayer.id) return;

      // 同步"落后者死亡不结束游戏"开关：双方共用同一规则，谁最后勾选谁生效，对方镜像
      if ("boolean" == typeof state.waitOnDeath && "number" == typeof state.waitOnDeathTs && state.waitOnDeathTs > this.waitOnDeathTs) {
        this.waitOnDeath = state.waitOnDeath, this.waitOnDeathTs = state.waitOnDeathTs, this["interface"].updateWaitOnDeathToggle();
      }

      // 对方已到达终点：本地同步判负结束
      if (state.finished) this.opponentFinished();
      // 对方被淘汰：按"落后者死亡是否结束游戏"规则处理（见 opponentDied）
      else if (state.ended) this.opponentDied();
      if (!this.remotePlayers[state.id]) {
        this.remotePlayers[state.id] = this.spawn.spawnRemotePlayer(state.id, state.x, state.y, state);
        return;
      }
      if (this.remotePlayers[state.id].applyState) {
        this.remotePlayers[state.id].applyState(state);
        return;
      }
      var p = this.remotePlayers[state.id];
      p.x = state.x || p.x;
      p.y = state.y || p.y;
      p.pose = state.pose || p.pose;
      p.frame = state.frame || p.frame;
      p.vx = state.vx || p.vx;
      p.vy = state.vy || p.vy;
      p.shield = !!state.shield;
    }, t.prototype.removeRemotePlayer = function (id) {
      var rp = this.remotePlayers && this.remotePlayers[id];
      if (!rp) return;
      this.objMain = this.objMain.filter(function (o) {
        return o !== rp;
      });
      delete this.remotePlayers[id];
    }, t.prototype.startRace = function (seed) {
      if ("ready" !== this.gameState) return;
      var e = h.Player.instance;
      this.seed = seed || 0;
      e.state = e.pendingStartState || "down";
      this.gameState = "playing";
      p.recordGameStart();
      this["interface"].hideScreen();
    }, t;
  }();
exports.Game = l;

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
let exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/entry.js ***!
  \**********************/


exports.__esModule = !0;
var s = __webpack_require__(/*! ./gameSetup.js */ "./src/gameSetup.js");
var n = __webpack_require__(/*! ./input.js */ "./src/input.js");
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
window.onload = function () {
  try {
    var net = __webpack_require__(/*! ./network.js */ "./src/network.js");
    if (net && net.connect) {
      net.connect(); //发起链接请求
    }
  } catch (e) {
    console.warn("network init skipped", e && e.message);
  }
  window.addEventListener('network-state-update', function (e) {
    var state = e.detail;
    if (window.game && window.game.applyRemoteState) {
      window.game.applyRemoteState(state);
    }
  });
  window.addEventListener('network-player-joined', function (e) {
    applyRemotePlayer(e && e.detail);
  });
  window.addEventListener('network-player-left', function (e) {
    var player = e && e.detail;
    if (!player || !player.id) return;
    if (window.game && window.game.removeRemotePlayer) {
      window.game.removeRemotePlayer(player.id);
      return;
    }
    delete window.__pendingRemotePlayers[player.id];
  });
  window.addEventListener('network-start', function (e) {
    if (window.game && window.game.startRace) {
      window.game.startRace(e && e.detail && e.detail.seed);
    }
  });
  n.GameInput();
  s.GameSetup();
};
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=bundle.js.map