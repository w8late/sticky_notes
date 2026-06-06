"use strict";

const Utility = {};
const debug = false;
Utility.maxZIndex = 1;
Utility.dbg = function(...msgs) {
    if (debug) console.log(msgs);
}

Utility.randomInteger = function(n = Number.MAX_SAFE_INTEGER) {
    return Math.floor(Math.random() * n);
}