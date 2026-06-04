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
    Utility.dbg(ev.target);
    if (ev.target.name !== "stickyNote") {
        ev.preventDefault();
        saveNewSticky();
    }
});

// ..and when pressing the button

+function(){
    let newBtn = document.getElementById("new");
    newBtn.addEventListener("click", ev => {
        Utility.dbg(ev.target);
        if (ev.target.name !== "stickyNote") {
          ev.preventDefault();
          saveNewSticky();
        }
    });
}()

const Notes = {
    all: [],
    shouldSave: false,
}

//save every 5 secs
setInterval(() => {
    if (Notes.shouldSave) localStorage.setItem("notes", JSON.stringify(Notes.all));
    Notes.shouldSave = false;
}, 5000);

+function loadNotes(){
    let item;
    // get created notes from storage
    if ((item = localStorage.getItem("notes")) !== null) { 
        Utility.dbg(item);
        Notes.all = JSON.parse(item);
        for (let n of Notes.all) {
            addStickyToDocument(n);
        }
        Notes.shouldSave = true;
    } else { // if this is the first time, then create a new list
        console.error("could not parse localStorage.allNotes");
    }
}()

function saveNewSticky() {
    let s = new StickySaveData();
    Notes.all.push(s); 
    addStickyToDocument(s);
    Notes.shouldSave = true;
}

function copyStickySave(t, s) {
    t.value = s.value;
    t.style.left = s.styleLeft;
    t.style.top = s.styleTop;
}

function addStickyToDocument(s) {
    const color = Color.randomColor();
    let textArea = document.createElement("textarea");
    textArea.name = "stickyNote";
    textArea.classList.add("note");
    textArea.placeholder = "Type your notes here!"
    copyStickySave(textArea, s);
    textArea.style.borderColor = color.borderColor;
    textArea.style.background = color.background;
    textArea.addEventListener("input", ev => { 
        s.value = ev.target.value;
        Notes.shouldSave = true;
    });
    textArea.addEventListener("pointerup",  ev => {
        s.styleLeft = `${textArea.style.left}`;
        s.styleTop = `${textArea.style.top}`;
        Notes.shouldSave = true;
    });
    textArea.addEventListener("contextmenu", ev => {
        Utility.dbg(ev.target);
        textArea.style.animationName = "bounce-out";
        setTimeout(() =>document.body.removeChild(textArea), 1000);
        ev.preventDefault();
        Notes.all.splice(Notes.all.indexOf(s), 1);
        Notes.shouldSave = true;
        
    });
    Utility.dbg(textArea);
    addDragListeners(textArea);
    document.body.appendChild(textArea);
}

//https://stackoverflow.com/questions/24050738/javascript-how-to-dynamically-move-div-by-clicking-and-dragging

function addDragListeners(elem) {
    elem.addEventListener("pointerdown", ev => elem.setPointerCapture(ev.pointerId));
    elem.addEventListener("pointerup",  ev => elem.releasePointerCapture(ev.pointerId));
    elem.addEventListener("pointermove", ev => {
        // if the pointer is on this element, drag it 
        if (elem.hasPointerCapture(ev.pointerId)) {
            elem.style.left = `${elem.offsetLeft + ev.movementX}px`;
            elem.style.top = `${elem.offsetTop + ev.movementY}px`;
        }
    });
}