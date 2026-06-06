"use strict";

let maxZIndex = localStorage.getItem("mzi") ?? 1;

export function incrMaxZIndex() {
    return maxZIndex++;
}

export function saveZIndex() {
    localStorage.setItem("mzi", maxZIndex);
}

export function randomInteger(n = Number.MAX_SAFE_INTEGER) {
    return Math.floor(Math.random() * n);
}