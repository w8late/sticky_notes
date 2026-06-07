"use strict";

import { getMaxZIndex, saveMaxZIndex } from "./util.js";
import * as Color from "./note-color.js";

class StickySaveData {
    constructor() {
        this.styleLeft = `${Math.random() * (window.innerWidth-150)}px`;
        this.styleTop = `${Math.random() * (window.innerHeight-150)}px`;
        this.value = "";
    }
}

const Notes = {
    all: [],
    shouldSave: false,
    div: document.getElementById("notes"),
    animationDuration: 950,
}

// create new sticky note on right click (on the background)
document.addEventListener("contextmenu", ev => {
    if (ev.target.name !== "stickyNote") {
        ev.preventDefault();
        saveNewSticky();
    }
});

// clear all notes
let clearBtn = document.getElementById("clear"); 
clearBtn.style.zIndex =  getMaxZIndex();
clearBtn.style.display = "none";
clearBtn.addEventListener("click", ev => {
    for (let n of Notes.div.children) {
        n.style.animationName = "bounce-out";
    }

    setTimeout(() => Notes.div.replaceChildren(), Notes.animationDuration);
    Notes.all.length = 0;
    Notes.shouldSave = true;

    // hide the button
    clearBtn.style.animationName = "slide-out";
    setTimeout(()=>clearBtn.style.display = "none", 900);
});

// buffer saves every 5 secs
setInterval(() => {
    if (Notes.shouldSave) localStorage.setItem("notes", JSON.stringify(Notes.all));
    Notes.shouldSave = false;
}, 5000);

// load notes
+function(){
    let item;
    if ((item = localStorage.getItem("notes")) !== null) { 
        Notes.all = JSON.parse(item);
        for (let n of Notes.all) {
            addStickyToDocument(n);
        }
        Notes.shouldSave = true;
    } else { // if this is the first time, then create a new list
        console.error("could not parse localStorage.notes");
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

// create textArea node from save data, and add it to the document
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
    textArea.addEventListener("pointerup", ev => {
        s.styleLeft = `${textArea.style.left}`;
        s.styleTop = `${textArea.style.top}`;
        Notes.shouldSave = true;
    });
    textArea.addEventListener("contextmenu", ev => {
        textArea.style.animationName = "bounce-out";
        setTimeout(() => { 
            try { Notes.div.removeChild(textArea); } catch(err){}
        }, Notes.animationDuration);
        ev.preventDefault();
        Notes.all.splice(Notes.all.indexOf(s), 1);
        if (Notes.all.length == 0) {
            clearBtn.style.animationName = "slide-out";
            setTimeout(()=>clearBtn.style.display = "none", 900);
        }
        Notes.shouldSave = true;
        
    });

    // make the clear button slide in 
    clearBtn.style.animationName = "slide-in";
    clearBtn.style.display = "block"; 
    
    addDragListeners(textArea);
    Notes.div.appendChild(textArea);
}

//https://stackoverflow.com/questions/24050738/javascript-how-to-dynamically-move-div-by-clicking-and-dragging *edited*

function addDragListeners(elem) {
    let offsetX = 0, offsetY = 0;
    elem.addEventListener("pointerdown", ev => { 
        elem.setPointerCapture(ev.pointerId); 
        offsetX = ev.offsetX;
        offsetY = ev.offsetY;
        debugger;
        elem.style.zIndex = getMaxZIndex();
        saveMaxZIndex(Number(getMaxZIndex()) + 1);
        clearBtn.style.zIndex = getMaxZIndex();
    });
    elem.addEventListener("pointerup", ev => elem.releasePointerCapture(ev.pointerId));
    elem.addEventListener("pointermove", ev => {
        // if the pointer is on this element, drag it 
        if (elem.hasPointerCapture(ev.pointerId)) {
            elem.style.left = `${ev.pageX-offsetX/* ev.movementX */}px`;
            elem.style.top = `${ev.pageY-offsetY/*ev.movementY*/}px`;
        }
    });
}