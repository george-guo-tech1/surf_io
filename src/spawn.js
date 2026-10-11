"use strict";
    exports.__esModule = !0;
    var s = require('./system.js')
      , n = require('./player.js')
      , r = require('./surfer.js')
      , a = require('./enemy.js')
      , o = require('./collisions.js')
      , h = require('./objects.js')
      , c = require('./gameObject.js')
      , p = require('./sprites.js')
      , g = require('./rng.js')//这是一行测试注释
      , l = function() {
        function t() {
            if (t.instance)
                return t.instance;
            t.instance = this,
            this.reset()
        }
        return t.prototype.reset = function() {
            this.player = [],
            this.remotePlayers = {},
            this.obstacles = [],
            this.surfers = [],
            this.enemies = [],
            this.chance = 0,
            this.spawnAccum = 25e-5,
            this.spawnRate = (.5 + this.spawnAccum) * this.chance,
            // 以下生成阈值和 system.js 的 winDistance(3950) 同单位（满速帧数）。
            // 缩短/拉长赛道时需同步等比缩放，否则敌人/道具可能整场都不会出现。
            this.nextObstacle = 188,
            this.nextCenterObstacle = 1500,
            this.freqCenterObstacle = 1125,
            this.freqObstacle = 38,
            this.nextSurfer = 750,
            this.freqSurfer = 188,
            this.nextEnemy = 7500,
            this.freqEnemy = 3000,
            this.nextPowerup = 7500,
            this.freqPowerup = 5625,
            this.nextRamp = 1875,
            this.freqRamp = 2625,
            this.nextTentacle = 2250,
            this.freqTentacle = 2250,
            this.nextDog = 10125,
            this.nextIsland = 375,
            this.freqIsland = 375,
            this.nextCharacter = 3750,
            this.freqCharacter = 1875,
            this.characterIncrement = 0,
            this.obstacleCount = 0,
            this.surferCount = 0,
            this.enemyCount = 0
        }
        ,
        t.prototype.slotRng = function(slot) {
            return g.mulberry32(g.hashSeed(s.Game.system.seed || 0, slot))
        }
        ,
        t.prototype.slotMap = function(rng, min, max) {
            return Math.floor(min + (max + .99 - min) * rng())
        }
        ,
        t.prototype.update = function() {
            this.obstacles = o.Collisions.instance.obstacles,
            this.surfers = o.Collisions.instance.surfers,
            this.enemies = o.Collisions.instance.enemies;
            var e = s.Game.system.distance;

            // 障碍物：到达距离阈值就生成，间隔由种子抖动，保证两边赛道一致
            while (e >= this.nextObstacle) {
                var rngOb = this.slotRng(this.obstacleCount);
                this.spawnNewObstacle(null, rngOb, this.nextObstacle),
                this.nextObstacle += this.freqObstacle + Math.floor(rngOb() * 22),
                this.obstacleCount += 1
            }
            // 冲浪者：同样按距离确定性生成
            while (e >= this.nextSurfer) {
                var rngSf = this.slotRng(1e6 + this.surferCount);
                this.spawnNewSurfer(null, rngSf),
                this.nextSurfer += this.freqSurfer + Math.floor(rngSf() * this.freqSurfer),
                this.surferCount += 1
            }
            // 敌人：按距离确定性生成（去掉原来"空中不生成"的本机状态判断）
            while (e >= this.nextEnemy) {
                var rngEn = this.slotRng(2e6 + this.enemyCount);
                this.spawnNewEnemy(null, 0, 0, null, rngEn),
                this.nextEnemy += this.freqEnemy + Math.floor(rngEn() * this.freqEnemy),
                this.enemyCount += 1
            }
        }
        ,
        t.prototype.spawnPlayer = function(t, e) {
            console.log('spawnPlayer', t, e),
            this.player = new n.Player(Math.floor(t / 2) - 32,Math.floor(e / 3) - 32),
            n.Player.instance.reset(),
            s.Game.system.objMain.push(this.player)
        }
        ,
        t.prototype.spawnRemotePlayer = function(id, x, y, state) {
            void 0 === state && (state = {}),
            !id && (id = "remote-player");
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
                shield: !1
            }, state);
            if (!s.Game.system.remotePlayers)
                s.Game.system.remotePlayers = {};
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
            remotePlayer.surfboardSprite = p.surfboard64Sprite();

            // 远程玩家不做本地物理更新，位置完全由服务器广播驱动
            remotePlayer.update = function() {};

            remotePlayer.applyState = function(nextState) {
                if (typeof nextState.x === "number") this.x = nextState.x;
                if (typeof nextState.y === "number") this.y = nextState.y;
                if (typeof nextState.frame === "number") this.frame = nextState.frame;
                if (typeof nextState.character === "number") this.character = nextState.character;
                if (typeof nextState.surfboardPose === "number") this.surfboardPose = nextState.surfboardPose;
                if (typeof nextState.distance === "number") this.distance = nextState.distance;
                if (typeof nextState.trackX === "number") this.trackX = nextState.trackX;
                this.shield = !!nextState.shield;
                this.ready = !!nextState.ready;
                if (nextState.state) this.state = nextState.state;
            };

            remotePlayer.draw = function(ctx) {
                var sys = s.Game.system;
                // 选人/准备阶段：在右侧预留一个位置展示对方，避免和本地玩家重叠
                if ("waiting" === sys.gameState || "ready" === sys.gameState) {
                    var px = sys.width - 160
                      , py = Math.floor(sys.height / 3) - 32
                      , character = this.character || 0;
                    ctx.save();
                    ctx.font = "bold 18px sans-serif";
                    ctx.fillStyle = "#ffffff";
                    ctx.textAlign = "center";
                    ctx.fillText(this.ready ? "PLAYER 2 - READY" : "PLAYER 2", px + 32, py - 18);
                    ctx.restore();
                    this.surfboardSprite && this.surfboardSprite.draw(ctx, px, py, 5, 0);
                    this.sprite && this.sprite.draw(ctx, px, py, 5, character);
                    return
                }

                // 游戏中：本地玩家居中不动、世界在滚动，所以不能直接用对方的 x/y。
                // 水平方向用 trackX 差换算：对方和自己之间拉开的横向距离就是
                // (remote.trackX - local.trackX)，1:1 加到屏幕坐标上，两人横向拉开时幽灵会左右偏移。
                // 垂直方向用 distance 差换算：领先的（distance 更大）更靠近下方终点，
                // 落后的（distance 更小）更靠近上方起点。distance 现在就是像素，偏移 1:1，
                // 这样对方停住时，幽灵会以世界滚动速度向上飘走，正确表现"被甩在后面"。
                var local = n.Player.instance
                  , dx = Math.floor(sys.width / 2) - 32 + ((this.trackX || 0) - (local ? local.trackX : 0))
                  , dy = (local ? Math.floor(local.y) : Math.floor(sys.height / 3) - 32)
                       + (this.distance - sys.distance);

                // 半透明幽灵，即使和本地玩家位置重合（平局）也能看清
                ctx.save();
                ctx.globalAlpha = .55;
                this.surfboardSprite && this.surfboardSprite.draw(ctx, dx, dy, this.frame || 0, this.surfboardPose || 0);
                this.sprite && this.sprite.draw(ctx, dx, dy, this.frame || 0, this.character || 0);
                ctx.restore()
            };

            s.Game.system.objMain.push(remotePlayer);
            s.Game.system.remotePlayers[id] = remotePlayer;
            return remotePlayer
        }
        ,
        t.prototype.spawnNewSurfer = function(t, rng) {
            void 0 === t && (t = null);
            var e = 0 === this.slotMap(rng, 0, 1) ? -56 : s.Game.system.height
              , i = this.slotMap(rng, 3, 12);
            null === t && ((t = new r.Surfer(s.Game.system.width / 2 - 32 + this.slotMap(rng, -608, 672) - (n.Player.instance ? n.Player.instance.trackX : 0),e)).maxSpeed = i),
            s.Game.system.objMain.push(t),
            t.surferInstance = this.slotMap(rng, 0, 8),
            t.surferInstance <= 5 ? t.surfboardInstance = this.slotMap(rng, 0, 5) : t.surfboardInstance = this.slotMap(rng, 6, 8),
            this.surfers.push(t)
        }
        ,
        t.prototype.spawnNewEnemy = function(t, e, i, r, rng) {
            void 0 === t && (t = null),
            void 0 === e && (e = 0),
            void 0 === i && (i = 0),
            void 0 === r && (r = null);
            var enemy;
            if (null === t)
                enemy = new a.Enemy(rng ? s.Game.system.width / 2 - 32 + this.slotMap(rng, -608, 672) - (n.Player.instance ? n.Player.instance.trackX : 0) : Math.floor(Math.random() * s.Game.system.width), -118);
            else
                enemy = new a.Enemy(e, i);
            enemy.currentSpeed = null === r ? n.Player.instance.ySpeed + n.Player.instance.maxSpeed / 2 : r,
            s.Game.system.objMain.push(enemy),
            this.enemies.push(enemy)
        }
        ,
        t.prototype.spawnNewObstacle = function(t, rng, spawnDistance) {
            void 0 === t && (t = null),
            null === t && (t = this.randomObstacle(rng, spawnDistance)),
            t.isInBack ? s.Game.system.objBack.push(t) : s.Game.system.objMain.push(t),
            this.obstacles.push(t)
        }
        ,
        t.prototype.spawnPowerupRow = function() {
            for (var t = -3; t <= 4; t++) {
                var e = Math.floor(s.Game.system.width / 2) + 128 * t - 32 - 64
                  , i = Math.floor(s.Game.system.height) - 128
                  , n = new h.Powerup64(e,i,1);
                s.Game.system.objBack.push(n),
                this.obstacles.push(n)
            }
        }
        ,
        t.prototype.spawnCrashedDog = function() {
            var t = new h.DogCrash64(n.Player.instance.x + 24,n.Player.instance.y + 24,11);
            s.Game.system.objMain.push(t),
            this.obstacles.push(t)
        }
        ,
        t.prototype.randomObstacle = function(rng, spawnDistance) {
            // 障碍物 x 用"绝对赛道坐标"：固定 cx 再减去本地玩家当前 trackX，
            // 两人横向位置不同时，同一个障碍物会出现在各自屏幕的不同横坐标（拉开水平差）。
            var e = void 0 === spawnDistance ? s.Game.system.distance : spawnDistance
              , i = s.Game.system.width
              , tx = n.Player.instance ? n.Player.instance.trackX : 0
              , cx = this.slotMap(rng, -928, 1312)
              , r = i / 2 - 32 + cx - tx
              , a = i / 2 - 32 + Math.floor(cx / 3) - tx
              , o = Math.floor(s.Game.system.height)
              , types = [0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8, 9, 10, 10, 11]
              , c = types[Math.floor(rng() * types.length)];

            // 每隔一段距离强制生成一个居中障碍物
            if (e > this.nextCenterObstacle) {
                r = i / 2 - 32 - tx;
                this.nextCenterObstacle += this.freqCenterObstacle;
            }

            // 特殊障碍物按距离门槛决定（去掉依赖本机状态的 air/collectedDog 判断）
            if (9 === c && e < this.nextCharacter) c = 0;
            else if (7 === c && e < this.nextPowerup) c = 0;
            else if (2 === c && e < this.nextRamp) c = 0;
            else if (6 === c && e < this.nextIsland) c = 0;
            else if (11 === c && e < this.nextDog) c = 0;
            else if (3 === c && e < this.nextTentacle) c = 5;

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
                return this.nextDog += s.Game.system.winDistance, new h.Dog64(p, o, 10)
            }
        }
        ,
        t
    }();
    exports.Spawn = l