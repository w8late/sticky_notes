"use strict";

const debug = true;
function dbg(msg) {
    if (debug) console.log(msg)
}

const noteColors = {
    red: {
        background: "#f08080",
        borderColor: "red",
    },
    blue: {
        background: "#8980f0",
        borderColor: "blue",
    },
    green: {
        background: "#80f087",
        borderColor: "green",
    },
};

const noteColorsKeys = Object.keys(noteColors);

function mRandomInteger(n) {
    return Math.floor(Math.random() * n);
}

class StickySaveData {
    constructor() {
        this.styleLeft = `${Math.random() * window.innerWidth}px`;
        this.styleTop = `${Math.random() * window.innerHeight}px`;
        this.value = "";
    }
}

let savedNotes, item;

function addStickyToDocument(s, doc) {
    const color = noteColors[noteColorsKeys[mRandomInteger(noteColorsKeys.length)]];
    let textArea = doc.createElement("textarea");
    textArea.name = "stickyNote";
    textArea.classList.add("note");
    textArea.placeholder = "Type your notes here!"
    textArea.value = s.value ?? "";
    textArea.style.left = s.styleLeft;
    textArea.style.top = s.styleTop;
    textArea.style.borderColor = color.borderColor;
    textArea.style.background = color.background;
    textArea.addEventListener("input", ev => { 
        s.value = ev.target.value;
        localStorage.setItem("savedNotes", JSON.stringify(savedNotes))
    });
    textArea.addEventListener("pointerup",  ev => {
        s.styleLeft = `${textArea.style.left}`;
        s.styleTop = `${textArea.style.top}`;

        localStorage.setItem("savedNotes", JSON.stringify(savedNotes)); 
     });
    regsisterDrag(textArea);
    doc.body.appendChild(textArea)
}


// get created notes from storage
if ((item = localStorage.getItem("savedNotes")) !== null) { 
    dbg(item);
    savedNotes = JSON.parse(item);
    for (let n of savedNotes) {
        addStickyToDocument(n, document);
    }
} else { // if this is the first time, then create a new list
    savedNotes = new Array();
    localStorage.setItem("savedNotes", JSON.stringify(savedNotes));
    console.error("could not parse localStorage.savedNotes");
}

// create new sticky note on double click
document.addEventListener("dblclick", ev => {
    let s = new StickySaveData;
    addStickyToDocument(s, document); 
    savedNotes.push(s); 
    localStorage.setItem("savedNotes", JSON.stringify(savedNotes)); // save to storage
});

//https://stackoverflow.com/questions/24050738/javascript-how-to-dynamically-move-div-by-clicking-and-dragging

function regsisterDrag(elem) {
    elem.addEventListener("pointerdown", ev => elem.setPointerCapture(ev.pointerId));
    elem.addEventListener("pointerup",  ev => elem.releasePointerCapture(ev.pointerId));
    elem.addEventListener("pointermove", ev => {
        // if the pointer is on this element, drag it 
        if (elem.hasPointerCapture(ev.pointerId)) {
            elem.style.left = `${elem.offsetLeft + ev.movementX}px`
            elem.style.top = `${elem.offsetTop + ev.movementY}px`
        }
    })
}
