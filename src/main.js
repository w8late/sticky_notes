"use strict";

import { getMaxZIndex, saveMaxZIndex } from "./util.js";
import * as Color from "./note-color.js";

const GlobalCustomEvents = Object.freeze({
    saveNotes: new CustomEvent("savenotes"),
    slideClearButtonOut: new CustomEvent("slideclearbuttonout"),
    slideClearButtonIn: new CustomEvent("slideclearbuttonin"),
});

class StickySaveData {
    constructor() {
        this.styleLeft = `${Math.random() * (window.innerWidth-150)}px`;
        this.styleTop = `${Math.random() * (window.innerHeight-150)}px`;
        this.value = "";
    }

    static fromJSON(jsonRepr) {
        let s = new StickySaveData();
        s.styleLeft = jsonRepr.styleLeft;
        s.styleTop = jsonRepr.styleTop;
        s.value = jsonRepr.value;
        return s;
    }

    saveToDocument(notes) {
        // create textArea node from save data, and add it to the document
        const color = Color.randomColor();
        let textArea = document.createElement("textarea");
        textArea.name = "stickyNote";
        textArea.classList.add("note");
        textArea.placeholder = "Type your notes here!"
        this.copyToTextArea(textArea);
        textArea.style.borderColor = color.borderColor;
        textArea.style.background = color.background;
        addDragListeners(textArea);
        textArea.addEventListener("input", ev => { 
            this.value = ev.target.value;
            queueMicrotask(()=>document.dispatchEvent(GlobalCustomEvents.saveNotes));
        });
        textArea.addEventListener("pointerup", ev => {
            this.styleLeft = `${textArea.style.left}`;
            this.styleTop = `${textArea.style.top}`;
            queueMicrotask(()=>document.dispatchEvent(GlobalCustomEvents.saveNotes));
        });
        textArea.addEventListener("contextmenu", ev => {
            ev.preventDefault();
            textArea.style.animationName = "bounce-out";
            setTimeout(() => { 
                textArea.remove();
            }, notes.animationDuration);
          
            notes.list.splice(notes.list.indexOf(this), 1);
            if (notes.list.length == 0) {
                document.dispatchEvent(GlobalCustomEvents.slideClearButtonOut);
            }
            queueMicrotask(()=>document.dispatchEvent(GlobalCustomEvents.saveNotes))
        });
        document.dispatchEvent(GlobalCustomEvents.slideClearButtonIn);
        notes.div.appendChild(textArea);
    }

    copyToTextArea(t) {
        t.value = this.value;
        t.style.left = this.styleLeft;
        t.style.top = this.styleTop;
    }
}

class NotesClass {
    constructor() {
        this.list = [];
        this.shouldSave = false;
        this.div = document.getElementById("notes");
        this.animationDuration = 950;
    }

    // load notes
    load() {
        let notesJSON;
        if ((notesJSON = localStorage.getItem("notes")) !== null) { 
            let list = JSON.parse(notesJSON);
            for (let n of list) {
                let sd = StickySaveData.fromJSON(n);
                sd.saveToDocument(notes);
                this.list.push(sd);
            }
            if (this.list.length > 0) {
                document.dispatchEvent(GlobalCustomEvents.slideClearButtonIn);
            }
        } else { // if this is the first time, then create a new list
            console.error("could not parse localStorage.notes");
        }
    }

    // clear all notes in the list
    clear() {
        //play disappearing animation for each note
        for (let n of this.div.children) {
            n.style.animationName = "bounce-out";
        }

        setTimeout(() => this.div.replaceChildren(), this.animationDuration);
        this.list.length = 0;
        queueMicrotask(()=>document.dispatchEvent(GlobalCustomEvents.saveNotes));
    }
}

// clear button
let clearBtn = document.getElementById("clear"); 
clearBtn.style.zIndex =  getMaxZIndex();
clearBtn.style.display = "none";
clearBtn.addEventListener("click", ev => {
    notes.clear();

    // hide the button
    clearBtn.style.animationName = "slide-out";
    setTimeout(()=>clearBtn.style.display = "none", 900);
});

const notes = new NotesClass();

document.addEventListener("savenotes", ev => {
    localStorage.setItem("notes", JSON.stringify(notes.list));
});

// create new sticky note on right click (on the background)
document.addEventListener("contextmenu", ev => {
    if (ev.target.name !== "stickyNote") {
        ev.preventDefault();
        let s = new StickySaveData();
        s.saveToDocument(notes);
        notes.list.push(s);
        queueMicrotask(()=>document.dispatchEvent(GlobalCustomEvents.saveNotes));
    }
});

document.addEventListener("slideclearbuttonin", ev => {
    // make the clear button slide in 
    clearBtn.style.animationName = "slide-in";
    clearBtn.style.display = "block"; 
});

document.addEventListener("slideclearbuttonout", ev => {
    clearBtn.style.animationName = "slide-out";
    setTimeout(()=>clearBtn.style.display = "none", 900);
});

notes.load();

//https://stackoverflow.com/questions/24050738/javascript-how-to-dynamically-move-div-by-clicking-and-dragging *edited*

function addDragListeners(elem) {
    let offsetX = 0, offsetY = 0;
    elem.addEventListener("pointerdown", ev => { 
        elem.setPointerCapture(ev.pointerId); 
        offsetX = ev.offsetX;
        offsetY = ev.offsetY;
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