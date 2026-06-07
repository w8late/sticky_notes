"use strict";

export function getMaxZIndex() {
    return localStorage.getItem("mzi") ?? 1;
}

export function saveMaxZIndex(newZIndex = 1) {
    localStorage.setItem("mzi", newZIndex);
}

export function randomInteger(n = Number.MAX_SAFE_INTEGER) {
    return Math.floor(Math.random() * n);
}