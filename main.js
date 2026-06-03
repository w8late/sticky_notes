"use strict";

class StickySaveData {
    constructor() {
        this.styleLeft = `${Math.random() * (window.innerWidth-150)}px`;
        this.styleTop = `${Math.random() * (window.innerHeight-150)}px`;
        this.value = "";
    }
}

// create new sticky note on double click
document.addEventListener("contextmenu", ev => {
    ev.preventDefault();
    saveNewSticky();
});

let allNotes = [];

+function loadNotes(){
    let item;
    // get created notes from storage
    if ((item = localStorage.getItem("notes")) !== null) { 
        Utility.dbg(item);
        allNotes = JSON.parse(item);
        for (let n of allNotes) {
            addStickyToDocument(n, document);
        }
    } else { // if this is the first time, then create a new list
        console.error("could not parse localStorage.allNotes");
    }
    allNotes.save = function() {
        localStorage.setItem("notes", JSON.stringify(this));
    }
}()

function saveNewSticky() {
    let s = new StickySaveData();
    addStickyToDocument(s, document); 
    allNotes.push(s); 
    allNotes.save();
}

function copyStickySave(t, {value, styleLeft, styleTop}) {
    t.value = value;
    t.style.left = styleLeft;
    t.style.top = styleTop;
}

function addStickyToDocument(s, doc) {
    const color = Color.randomColor();
    let textArea = doc.createElement("textarea");
    textArea.name = "stickyNote";
    textArea.classList.add("note");
    textArea.placeholder = "Type your notes here!"
    copyStickySave(textArea, s);
    textArea.style.borderColor = color.borderColor;
    textArea.style.background = color.background;
    textArea.addEventListener("input", ev => { 
        s.value = ev.target.value;
        allNotes.save();
    });
    textArea.addEventListener("pointerup",  ev => {
        s.styleLeft = `${textArea.style.left}`;
        s.styleTop = `${textArea.style.top}`;
        allNotes.save();
     });
    Utility.dbg(textArea)
    addDragListeners(textArea);
    doc.body.appendChild(textArea)
}

//https://stackoverflow.com/questions/24050738/javascript-how-to-dynamically-move-div-by-clicking-and-dragging

function addDragListeners(elem) {
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