"use strict";

let maxZIndex = 1;

export function incrMaxZIndex() {
    return maxZIndex++;
}

export function randomInteger(n = Number.MAX_SAFE_INTEGER) {
    return Math.floor(Math.random() * n);
}