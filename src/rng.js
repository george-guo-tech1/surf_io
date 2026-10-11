"use strict";
exports.__esModule = !0;

// mulberry32：小巧、够用的伪随机数生成器（游戏用，非加密）。
// 返回一个函数，每次调用返回 [0, 1) 的伪随机数。
function mulberry32(seed) {
    var a = seed >>> 0;
    return function() {
        a = (a + 0x6D2B79F5) >>> 0;
        var t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// 把 (seed, slot) 混成一个新的 32 位种子，保证不同 slot 的随机序列互不相关。
function hashSeed(seed, slot) {
    var x = (seed | 0) ^ Math.imul(slot | 0, 0x9E3779B9);
    x = Math.imul(x ^ (x >>> 16), 0x7FEB352D);
    x = Math.imul(x ^ (x >>> 15), 0x846CA68B);
    return (x ^ (x >>> 16)) >>> 0;
}

exports.mulberry32 = mulberry32;
exports.hashSeed = hashSeed;
