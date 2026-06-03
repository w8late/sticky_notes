const noteColors = {
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
};

const noteColorsKeys = Object.keys(noteColors);
const noteColorsValues = Object.values(noteColors);

let Color = {};

Color.randomColor = function() {
    return noteColors[noteColorsKeys[Utility.randomInteger(noteColorsKeys.length)]]
}