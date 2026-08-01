"use strict";

import { randomInteger } from "./util.js";

const noteColors = Object.freeze({
    Red: {
        background: "#f08080",
        borderColor: "red",
    },
    Green: {
        background: "#80f087",
        borderColor: "green",
    },
    Blue: {
        background: "#8980f0",
        borderColor: "blue",
    },
    Yellow: {
        background: "#e9ed81",
        borderColor: "yellow",
    }
});

export function randomColor() {
    const keys = Object.keys(noteColors);
    return noteColors[keys[randomInteger(keys.length)]]
}