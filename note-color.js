"use strict";

import { randomInteger } from "./util.js";

const noteColors = Object.freeze({
    red: {
        background: "#f08080",
        borderColor: "red",
    },
    green: {
        background: "#80f087",
        borderColor: "green",
    },
    blue: {
        background: "#8980f0",
        borderColor: "blue",
    },
    yellow: {
        background: "#e9ed81",
        borderColor: "yellow",
    }
});

export function randomColor() {
    const keys = Object.keys(noteColors);
    return noteColors[keys[randomInteger(keys.length)]]
}