"use strict";
    exports.__esModule = !0;
    var s = require('./interface.js')
      , n = require('./collisions.js')
      , r = require('./spawn.js')
      , a = require('./cleanup.js')
      , o = require('./background.js')
      , h = require('./player.js')
      , c = require('./islandSpawn.js')
      , p = require('./record.js')
      , g = require('./sprites.js')
      , l = function() {
        function t(e, i) {
            if (t.system)
                return t.system;
            t.system = this,
            this.canvas = e,
            this.fps = i,
            this.interval = this.fps / 60,
            this.collisions = new n.Collisions,
            this.spawn = new r.Spawn,
            this.cleanup = new a.Cleanup,
            this.background = new o.Background,
            this.islandspawn = new c.IslandSpawn,
            this.interface = new s.Interface,
            this.waitOnDeath = !1,
            this.waitOnDeathTs = 0,
            this.initializeGame()
        }
        return t.prototype.initializeGame = function() {
            this.defineCanvas(this.canvas),
            this.resetStats(),
            this.resetGame(),
            this.interface.buildInterface(),
            this.spawn.spawnPlayer(this.width, this.height),
            this.interface.buildCharacterSelection(),
            this.background.setupGradient(this.winDistance),
            this.remotePlayers = {}
        }
        ,
        t.prototype.defineCanvas = function(t) {
            this.ctx = t.getContext("2d"),
            this.ctx.imageSmoothingEnabled = !1,
            t.width = document.body.clientWidth,
            t.height = window.innerHeight,
            t.style.width = t.width + "px",
            t.style.height = t.height + "px",
            this.width = t.width,
            this.height = t.height
        }
        ,
        t.prototype.resetStats = function() {
            this.lives = 3,
            this.maxLives = 3,
            this.powerups = 0,
            this.powerupsCollected = 0,
            this.maxPowerups = 3,
            this.shields = 0,
            this.maxShields = 3,
            this.distance = 0,
            this.seed = 0,
            // distance 是像素（满速时每帧 +7.5px）；29625 = 3950 帧 × 7.5 = 原赛道的一半
            this.winDistance = 29625,
            this.clearPath = !1,
            this.dodges = 0,
            this.avoids = 0,
            this.tricks = 0,
            this.boosts = 0,
            this.escapes = 0,
            this.score = 0,
            this.infiniteLives = !1,
            this.infinitePowerups = !1,
            this.krakenCodeUsed = !1,
            this.updateFrames = 0,
            this.updateEnding = !1,
            this.finished = !1,
            this.ended = !1
        }
        ,
        t.prototype.resetGame = function() {
            this.gameState = "waiting",
            this.gameObjects = [],
            this.objUpper = [],
            this.objMain = [],
            this.objLower = [],
            this.objBack = [],
            this.interface.reset(),
            this.background.reset(),
            this.collisions.reset(),
            this.spawn.reset(),
            this.islandspawn.reset(),
            this.cleanup.reset()
        }
        ,
        t.prototype.reflowCanvas = function() {
            this.defineCanvas(this.canvas);
            var t = h.Player.instance
              , e = Math.round(this.width / 2) - (t.x + t.width / 2)
              , i = Math.round(this.height / 3) - (t.y + t.height / 2);
            this.gameObjects.forEach(function(t) {
                return t.move(e, i)
            }),
            this.background.updateWater(e, i, this.interval, t.xSpeed, t.ySpeed)
        }
        ,
        t.prototype.addLife = function() {
            this.lives < this.maxLives && (this.lives += 1,
            this.interface.updateIcons())
        }
        ,
        t.prototype.removeLife = function() {
            this.lives > 0 && !this.infiniteLives && (this.lives -= 1),
            this.interface.updateIcons()
        }
        ,
        t.prototype.removeAllLives = function() {
            this.infiniteLives = !1,
            this.lives = 0,
            this.interface.updateIcons()
        }
        ,
        t.prototype.addPowerup = function() {
            this.powerups < this.maxPowerups && (this.powerups += 1,
            this.powerupsCollected += 1,
            this.interface.updateIcons())
        }
        ,
        t.prototype.removePowerup = function() {
            this.powerups > 0 && !this.infinitePowerups && (this.powerups -= 1),
            this.interface.updateIcons()
        }
        ,
        t.prototype.removeAllPowerups = function() {
            this.infinitePowerups = !1,
            this.powerups = 0,
            this.interface.updateIcons()
        }
        ,
        t.prototype.addShields = function() {
            h.Player.instance.collectedDog = !0,
            this.shields = this.maxShields,
            this.interface.updateIcons()
        }
        ,
        t.prototype.removeShield = function() {
            this.shields > 0 && (this.shields -= 1),
            this.interface.updateIcons()
        }
        ,
        t.prototype.removeAllShields = function() {
            this.shields = 0,
            this.interface.updateIcons()
        }
        ,
        t.prototype.gameLoop = function(t) {
            "playing" === this.gameState || "ready" === this.gameState ? (
                this.interval = t / (1e3 / this.fps),
                this.updateAll(),
                this.checkWinDistance()
            ) : "lose" === this.gameState && this.updateGameOver(),
            "dead" === this.gameState && this.checkOpponentEnded();

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
        }
        ,
        t.prototype.updateAll = function() {
            h.Player.instance.isMoving && (this.distance += h.Player.instance.ySpeed * t.system.interval,
            this.updateFrames % (1 * this.fps) == 0 && this.background.updateGradient(this.distance, this.winDistance),
            this.background.updateWater(0, 0, this.interval, h.Player.instance.xSpeed, h.Player.instance.ySpeed),
            this.interface.update(),
            this.updateFrames++,
            this.distance < this.winDistance - 1.5 * this.height ? this.spawn.update() : this.distance > this.winDistance - this.height / 1.5 && !this.islandspawn.isSpawned && (this.clearPath = !0,
            this.islandspawn.isSpawned = !0,
            this.islandspawn.spawnIsland())),
            this.collisions.update(),
            this.gameObjects.forEach(function(t) {
                return t.update()
            }),
            this.cleanup.update(),
            this.updateDrawOrder()
        }
        ,
        t.prototype.updateDrawOrder = function() {
            this.objMain = this.objMain.sort(function(t, e) {
                return t.box.y + t.box.height - (e.box.y + e.box.height)
            }),
            this.gameObjects = this.objBack.concat(this.objLower).concat(this.objMain).concat(this.objUpper)
        }
        ,
        t.prototype.linearMap = function(t, e) {
            return Math.floor(t + (e + .99 - t) * Math.random())
        }
        ,
        t.prototype.drawAll = function() {
            // console.log('drawAll called');
            var t = this;
            this.ctx.clearRect(0, 0, this.width, this.height),
            this.drawBoundaries(),
            this.gameObjects.forEach(function(e) {
                return e.draw(t.ctx)
            })
        }
        ,
        t.prototype.drawBoundaries = function() {
            // 左右边界墙：固定在地图左右边界（赛道坐标 -992 / +1376），随世界滚动
            var spr = g.objects64Sprite()
              , anchor = Math.floor(this.width / 2) - 32
              , tx = h.Player.instance ? h.Player.instance.trackX : 0
              , leftX = anchor - 992 - tx
              , rightX = anchor + 1376 - tx
              , off = this.distance % 64;
            for (var y = -off; y < this.height; y += 64)
                spr.draw(this.ctx, Math.floor(leftX), Math.floor(y), 0, 0),
                spr.draw(this.ctx, Math.floor(rightX), Math.floor(y), 0, 0)
        }
        ,
        t.prototype.checkWinDistance = function() {
            if (this.islandspawn.isSpawned) {
                if (this.islandspawn.island.y + 192 > h.Player.instance.y + h.Player.instance.height)
                    return;
                this.gameWin()
            }
        }
        ,
        t.prototype.updateGameOver = function() {
            this.updateEnding ? (this.gameObjects.filter(function(t) {
                return "Enemy" === t.ObjectName && t.gotPlayer
            }).forEach(function(t) {
                t.enemyGrab()
            }),
            this.background.gameLoseGradient()) : this.gameState = "over"
        }
        ,
        t.prototype.gameLose = function() {
            if (this.waitOnDeath)
                return this.gameDead();
            this.finishByDistance()
        }
        ,
        t.prototype.gameLoseEnemy = function() {
            if (this.waitOnDeath)
                return this.gameDead();
            this.finishByDistance()
        }
        ,
        t.prototype.gameDead = function() {
            // 单方面死亡：不结束本局，进入等待状态，直到对方也结束（撞死/被抓/到终点）
            this.gameState = "dead",
            this.ended = !0,
            h.Player.instance.lose(),
            this.interface.drawDeadWaiting(),
            this.removeAllLives(),
            this.removeAllPowerups()
        }
        ,
        t.prototype.checkOpponentEnded = function() {
            if ("dead" !== this.gameState)
                return;
            var ids = Object.keys(this.remotePlayers || {});
            for (var i = 0; i < ids.length; i++) {
                var rp = this.remotePlayers[ids[i]];
                if (rp && (rp.ended || rp.finished)) {
                    // 对方到终点则本地判负；双方都撞死/被抓则按距离判胜负
                    rp.finished ? this.opponentFinished() : this.finishByDistance();
                    return
                }
            }
        }
        ,
        t.prototype.opponentFinished = function() {
            // 对方先到终点，本地判负结束
            if ("playing" !== this.gameState && "ready" !== this.gameState && "dead" !== this.gameState)
                return;
            this.gameState = "over",
            this.ended = !0,
            h.Player.instance.lose(),
            p.recordGameEnd(this, h.Player.instance),
            this.interface.drawGameOver("OPPONENT WON"),
            this.removeAllLives(),
            this.removeAllPowerups()
        }
        ,
        t.prototype.opponentDied = function() {
            // 对方撞死/被抓（未勾选"单方面死亡不结束游戏"时）：本地也结束，并按距离判胜负
            if ("playing" !== this.gameState && "ready" !== this.gameState)
                return;
            if (this.waitOnDeath)
                return;
            this.finishByDistance()
        }
        ,
        t.prototype.finishByDistance = function() {
            // 撞死/被抓导致结束时按距离判胜负：谁跑得更远谁赢
            var ids = Object.keys(this.remotePlayers || {})
              , opp = ids.length ? this.remotePlayers[ids[0]] : null
              , oppDist = opp ? opp.distance || 0 : 0
              , win = this.distance >= oppDist;
            this.gameState = "over",
            this.ended = !0,
            win ? h.Player.instance.win() : h.Player.instance.lose(),
            this.interface.drawGameOver(win ? "YOU WIN" : "OPPONENT WON"),
            p.recordGameEnd(this, h.Player.instance),
            this.removeAllLives(),
            this.removeAllPowerups()
        }
        ,
        t.prototype.gameWin = function() {
            this.islandspawn.moveIsland(),
            this.distance = this.winDistance,
            this.interface.drawGameWin(),
            h.Player.instance.win(),
            this.gameState = "over",
            this.finished = !0,
            this.ended = !0,
            p.recordGameEnd(this, h.Player.instance),
            setTimeout(function() {
                c.IslandSpawn.instance.openChest()
            }, 500),
            setTimeout(function() {
                s.Interface.system.showWinModal()
            }, 1500),
            this.islandspawn.handleEndClick()
        }
        ,
        t.prototype.applyRemoteState = function(state) {
            if (!state || !state.id) return;
            if (window.currentPlayer && state.id === window.currentPlayer.id) return;

            // 同步"单方面死亡不结束游戏"开关：双方共用同一规则，谁最后勾选谁生效，对方镜像
            if ("boolean" == typeof state.waitOnDeath && "number" == typeof state.waitOnDeathTs && state.waitOnDeathTs > this.waitOnDeathTs) {
                this.waitOnDeath = state.waitOnDeath,
                this.waitOnDeathTs = state.waitOnDeathTs,
                this.interface.updateWaitOnDeathToggle()
            }

            // 对方已到达终点：本地同步判负结束
            if (state.finished)
                this.opponentFinished();
            // 对方撞死/被抓（未勾选"单方面死亡不结束"时）：本地也一起结束
            else if (state.ended)
                this.opponentDied();

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
        }
        ,
        t.prototype.removeRemotePlayer = function(id) {
            var rp = this.remotePlayers && this.remotePlayers[id];
            if (!rp) return;
            this.objMain = this.objMain.filter(function(o) {
                return o !== rp;
            });
            delete this.remotePlayers[id];
        }
        ,
        t.prototype.startRace = function(seed) {
            if ("ready" !== this.gameState) return;
            var e = h.Player.instance;
            this.seed = seed || 0;
            e.state = e.pendingStartState || "down";
            this.gameState = "playing";
            p.recordGameStart();
            this.interface.hideScreen();
        }
        ,
        t
    }();
    exports.Game = l