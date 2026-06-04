"use strict";

const Utility = {};
const debug = false;
Utility.dbg = function(...msg) {
    if (debug) console.log(msg);
}

Utility.randomInteger = function(n = Number.MAX_SAFE_INTEGER) {
    return Math.floor(Math.random() * n);
}